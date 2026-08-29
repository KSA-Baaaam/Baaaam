import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'
import { profilesService } from '@/services/profiles'
import type { UserRole } from '@/services/profiles'

const adminLoginEmail = 'parkhtaek@naver.com'

export type EmailCodePurpose = 'login' | 'signup'

type EmailChallenge = {
  email: string
  purpose: EmailCodePurpose
}

type AuthDestination = '/' | '/admin'

type AuthResult = {
  ok: boolean
  challenge: EmailChallenge | null
  errorMessage: string | null
  destination?: AuthDestination
}

type AccountDeletionResult = {
  ok: boolean
  errorMessage: string | null
}

export type StaffAccount = {
  id: string
  name: string
  email: string
  role: UserRole
}

type AuthContextValue = {
  currentStaff: StaffAccount | null
  isSessionLoading: boolean
  login: (identifier: string, password: string) => Promise<AuthResult>
  isLoggingIn: boolean
  signUp: (input: { email: string; password: string; name: string }) => Promise<AuthResult>
  isSigningUp: boolean
  verifyEmailCode: (input: EmailChallenge & { token: string }) => Promise<{ ok: boolean; errorMessage: string | null; destination?: AuthDestination }>
  isVerifyingEmailCode: boolean
  resendEmailCode: (challenge: EmailChallenge) => Promise<{ ok: boolean; errorMessage: string | null }>
  isResendingEmailCode: boolean
  logout: () => Promise<boolean>
  isLoggingOut: boolean
  deleteAccount: (password: string) => Promise<AccountDeletionResult>
  isDeletingAccount: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function sessionHasVerifiedEmail(session: Session | null) {
  return Boolean(session?.user.email && session.user.email_confirmed_at)
}

async function toStaffAccount(session: Session | null): Promise<StaffAccount | null> {
  if (!sessionHasVerifiedEmail(session)) return null
  const user = session?.user
  if (!user?.email) return null

  const profile = await profilesService.getById(user.id).catch(() => null)
  const metadataName = user.user_metadata?.full_name
  return {
    id: user.id,
    name:
      profile?.displayName ??
      (typeof metadataName === 'string' && metadataName.trim() ? metadataName.trim() : user.email),
    email: user.email,
    role: profile?.role ?? 'general',
  }
}

function destinationFor(account: StaffAccount | null): AuthDestination {
  return account?.role === 'author' || account?.role === 'admin' ? '/admin' : '/'
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false)
  const [isResendingEmailCode, setIsResendingEmailCode] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  useEffect(() => {
    let active = true

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      if (data.session && !sessionHasVerifiedEmail(data.session)) {
        await supabase.auth.signOut({ scope: 'local' })
      }
      setCurrentStaff(await toStaffAccount(data.session))
      setIsSessionLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      void toStaffAccount(session).then((account) => {
        if (!active) return
        setCurrentStaff(account)
        setIsSessionLoading(false)
      })
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
    setIsLoggingIn(true)
    try {
      const normalizedIdentifier = identifier.trim().toLowerCase()
      const normalizedEmail = normalizedIdentifier === 'admin' ? adminLoginEmail : normalizedIdentifier
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
      if (error || !data.session) {
        return { ok: false, challenge: null, errorMessage: '아이디 또는 이메일과 비밀번호를 확인해주세요.' }
      }

      if (!sessionHasVerifiedEmail(data.session)) {
        await supabase.auth.signOut({ scope: 'local' })
        return { ok: false, challenge: null, errorMessage: '회원가입 때 받은 이메일 인증을 먼저 완료해주세요.' }
      }

      const account = await toStaffAccount(data.session)
      setCurrentStaff(account)
      return {
        ok: true,
        challenge: null,
        errorMessage: null,
        destination: destinationFor(account),
      }
    } finally {
      setIsLoggingIn(false)
    }
  }, [])

  const signUp = useCallback(async (input: { email: string; password: string; name: string }): Promise<AuthResult> => {
    setIsSigningUp(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { full_name: input.name },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (error) {
        return { ok: false, challenge: null, errorMessage: error.message }
      }

      if (data.session) {
        await supabase.auth.signOut({ scope: 'local' })
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: input.email,
          options: { shouldCreateUser: false },
        })
        if (otpError) {
          return { ok: false, challenge: null, errorMessage: otpError.message }
        }
        return {
          ok: true,
          challenge: { email: input.email, purpose: 'login' },
          errorMessage: null,
        }
      }

      return {
        ok: true,
        challenge: { email: input.email, purpose: 'signup' },
        errorMessage: null,
      }
    } finally {
      setIsSigningUp(false)
    }
  }, [])

  const verifyEmailCode = useCallback(async (input: EmailChallenge & { token: string }) => {
    setIsVerifyingEmailCode(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: input.email,
        token: input.token,
        type: input.purpose === 'signup' ? 'signup' : 'email',
      })
      if (error || !data.session) {
        return { ok: false, errorMessage: '인증코드가 올바르지 않거나 만료되었어요.' }
      }
      const account = await toStaffAccount(data.session)
      setCurrentStaff(account)
      return {
        ok: true,
        errorMessage: null,
        destination: destinationFor(account),
      }
    } finally {
      setIsVerifyingEmailCode(false)
    }
  }, [])

  const resendEmailCode = useCallback(async (challenge: EmailChallenge) => {
    setIsResendingEmailCode(true)
    try {
      const { error } = challenge.purpose === 'signup'
        ? await supabase.auth.resend({ type: 'signup', email: challenge.email })
        : await supabase.auth.signInWithOtp({
            email: challenge.email,
            options: { shouldCreateUser: false },
          })
      if (error) {
        return { ok: false, errorMessage: '인증코드를 다시 보내지 못했어요. 잠시 후 시도해주세요.' }
      }
      return { ok: true, errorMessage: null }
    } finally {
      setIsResendingEmailCode(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) return false
      setCurrentStaff(null)
      return true
    } finally {
      setIsLoggingOut(false)
    }
  }, [])

  const deleteAccount = useCallback(async (password: string): Promise<AccountDeletionResult> => {
    if (!currentStaff) {
      return { ok: false, errorMessage: '로그인 정보를 확인할 수 없어요. 다시 로그인해주세요.' }
    }

    setIsDeletingAccount(true)
    try {
      const { data: passwordData, error: passwordError } = await supabase.auth.signInWithPassword({
        email: currentStaff.email,
        password,
      })
      if (passwordError || passwordData.user?.id !== currentStaff.id) {
        return { ok: false, errorMessage: '비밀번호가 올바르지 않아요.' }
      }

      const { error: deletionError } = await supabase.functions.invoke('delete-account', {
        body: { confirmation: 'delete-my-account' },
      })
      if (deletionError) {
        return { ok: false, errorMessage: '계정을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.' }
      }

      await supabase.auth.signOut({ scope: 'local' })
      setCurrentStaff(null)
      return { ok: true, errorMessage: null }
    } finally {
      setIsDeletingAccount(false)
    }
  }, [currentStaff])

  const value = useMemo<AuthContextValue>(
    () => ({
      currentStaff,
      isSessionLoading,
      login,
      isLoggingIn,
      signUp,
      isSigningUp,
      verifyEmailCode,
      isVerifyingEmailCode,
      resendEmailCode,
      isResendingEmailCode,
      logout,
      isLoggingOut,
      deleteAccount,
      isDeletingAccount,
    }),
    [currentStaff, isSessionLoading, login, isLoggingIn, signUp, isSigningUp, verifyEmailCode, isVerifyingEmailCode, resendEmailCode, isResendingEmailCode, logout, isLoggingOut, deleteAccount, isDeletingAccount],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useOperatorSession() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthSessionProvider가 필요합니다.')
  return value
}
