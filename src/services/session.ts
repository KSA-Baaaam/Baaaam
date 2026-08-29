import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'

export type StaffAccount = {
  id: string
  name: string
  email: string
}

type AuthContextValue = {
  currentStaff: StaffAccount | null
  isSessionLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  isLoggingIn: boolean
  loginErrorMessage: string | null
  signUp: (input: { email: string; password: string; name: string }) => Promise<{
    ok: boolean
    needsEmailConfirmation: boolean
    errorMessage: string | null
  }>
  isSigningUp: boolean
  logout: () => Promise<boolean>
  isLoggingOut: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toStaffAccount(user: User | null): StaffAccount | null {
  if (!user?.email) return null

  const metadataName = user.user_metadata?.full_name
  return {
    id: user.id,
    name: typeof metadataName === 'string' && metadataName.trim() ? metadataName.trim() : user.email,
    email: user.email,
  }
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setCurrentStaff(toStaffAccount(data.user))
      setIsSessionLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setCurrentStaff(toStaffAccount(session?.user ?? null))
      setIsSessionLoading(false)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoggingIn(true)
    setLoginErrorMessage(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setLoginErrorMessage(error.message)
        return false
      }
      setCurrentStaff(toStaffAccount(data.user))
      return true
    } finally {
      setIsLoggingIn(false)
    }
  }, [])

  const signUp = useCallback(async (input: { email: string; password: string; name: string }) => {
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
        return { ok: false, needsEmailConfirmation: false, errorMessage: error.message }
      }
      if (data.session) setCurrentStaff(toStaffAccount(data.user))
      return {
        ok: true,
        needsEmailConfirmation: data.session === null,
        errorMessage: null,
      }
    } finally {
      setIsSigningUp(false)
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
      loginErrorMessage,
      signUp,
      isSigningUp,
      logout,
      isLoggingOut,
    }),
    [currentStaff, isSessionLoading, login, isLoggingIn, loginErrorMessage, signUp, isSigningUp, logout, isLoggingOut],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useOperatorSession() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthSessionProvider가 필요합니다.')
  return value
}
