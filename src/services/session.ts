import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'
import { profilesService } from '@/services/profiles'
import type { UserRole } from '@/services/profiles'

const adminLoginEmail = 'admin@baaaam.app'

export type StaffAccount = {
  id: string
  name: string
  email: string
  role: UserRole
}

type AuthContextValue = {
  currentStaff: StaffAccount | null
  isSessionLoading: boolean
  login: (identifier: string, password: string) => Promise<boolean>
  isLoggingIn: boolean
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

async function toStaffAccount(user: User | null): Promise<StaffAccount | null> {
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
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let active = true

    void supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return
      setCurrentStaff(await toStaffAccount(data.user))
      setIsSessionLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      void toStaffAccount(session?.user ?? null).then((account) => {
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

  const login = useCallback(async (identifier: string, password: string) => {
    setIsLoggingIn(true)
    try {
      const email = identifier.trim().toLowerCase() === 'admin' ? adminLoginEmail : identifier.trim()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return false
      }
      setCurrentStaff(await toStaffAccount(data.user))
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
      if (data.session) setCurrentStaff(await toStaffAccount(data.user))
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
      signUp,
      isSigningUp,
      logout,
      isLoggingOut,
    }),
    [currentStaff, isSessionLoading, login, isLoggingIn, signUp, isSigningUp, logout, isLoggingOut],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useOperatorSession() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthSessionProvider가 필요합니다.')
  return value
}
