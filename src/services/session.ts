import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'
import { profilesService } from '@/services/profiles'
import type { UserRole } from '@/services/profiles'

const adminLoginEmail = 'dev.baaaam@gmail.com'

export type EmailCodePurpose = 'login' | 'signup'

type EmailChallenge = {
  email: string
  purpose: EmailCodePurpose
}

type AuthResult = {
  ok: boolean
  challenge: EmailChallenge | null
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
  verifyEmailCode: (input: EmailChallenge & { token: string }) => Promise<{ ok: boolean; errorMessage: string | null }>
  isVerifyingEmailCode: boolean
  resendEmailCode: (challenge: EmailChallenge) => Promise<{ ok: boolean; errorMessage: string | null }>
  isResendingEmailCode: boolean
  logout: () => Promise<boolean>
  isLoggingOut: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function sessionUsesEmailOtp(session: Session | null) {
  if (!session?.access_token) return false

  try {
    const encodedPayload = session.access_token.split('.')[1]
    if (!encodedPayload) return false
    const normalizedPayload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=')
    const payload = JSON.parse(atob(paddedPayload)) as { amr?: Array<{ method?: string }> }
    return payload.amr?.[0]?.method === 'otp'
  } catch {
    return false
  }
}

async function toStaffAccount(session: Session | null): Promise<StaffAccount | null> {
  if (!sessionUsesEmailOtp(session)) return null
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

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false)
  const [isResendingEmailCode, setIsResendingEmailCode] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let active = true

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      if (data.session && !sessionUsesEmailOtp(data.session)) {
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
      const email = identifier.trim().toLowerCase() === 'admin' ? adminLoginEmail : identifier.trim()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { ok: false, challenge: null, errorMessage: '아이디 또는 비밀번호를 확인해주세요.' }
      }

      await supabase.auth.signOut({ scope: 'local' })
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      })
      if (otpError) {
        return { ok: false, challenge: null, errorMessage: '인증코드 전송에 실패했어요. 잠시 후 다시 시도해주세요.' }
      }

      return { ok: true, challenge: { email, purpose: 'login' }, errorMessage: null }
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
      setCurrentStaff(await toStaffAccount(data.session))
      return { ok: true, errorMessage: null }
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
    }),
    [currentStaff, isSessionLoading, login, isLoggingIn, signUp, isSigningUp, verifyEmailCode, isVerifyingEmailCode, resendEmailCode, isResendingEmailCode, logout, isLoggingOut],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useOperatorSession() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthSessionProvider가 필요합니다.')
  return value
}
