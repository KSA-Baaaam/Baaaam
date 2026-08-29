import { useCallback, useMemo, useState } from 'react'

import { getBaasAuthSdk } from '@/lib/baas-auth-sdk'
import type { SignupConfig, SignupTerms } from '@/lib/baas-auth-sdk'

/**
 * 운영진 계정(PRD "운영진 계정" 엔티티) 표시·세션 관리.
 *
 * 실제 BaaS 회원 인증(`window.BaasSDK`의 계정 훅)을 감싼 도메인 훅이다. `window.BaasSDK`
 * 접근은 이 파일과 `@/lib/baas-auth-sdk` 안에만 두고, 화면은 이 모듈이 내보내는 훅만 쓴다.
 */
export type StaffAccount = {
  id: string
  name: string
  email: string
}

export type { SignupConfig, SignupTerms }

function toStaffAccount(user: { id: string; email: string; name: string } | null): StaffAccount | null {
  if (!user) {
    return null
  }
  return { id: user.id, name: user.name || user.email, email: user.email }
}

/** 관리자 화면(`/admin`)의 로그인 세션. */
export function useOperatorSession() {
  const sdk = getBaasAuthSdk()
  const { isLoggedIn, user, loading: isSessionLoading } = sdk.useAuth()
  const { login, loading: isLoggingIn, error: loginError } = sdk.useLogin()
  const { logout: sdkLogout } = sdk.useLogout()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const currentStaff = useMemo(() => (isLoggedIn ? toStaffAccount(user) : null), [isLoggedIn, user])

  const logout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      return await sdkLogout()
    } finally {
      setIsLoggingOut(false)
    }
  }, [sdkLogout])

  return {
    currentStaff,
    isSessionLoading,
    login, // (email, password) => Promise<boolean> — 실패해도 throw 하지 않는다
    isLoggingIn,
    loginErrorMessage: loginError?.message ?? null,
    logout,
    isLoggingOut,
  }
}

export type OperatorSignupInput = {
  email: string
  password: string
  name: string
  phone: string
  termsAgreed: boolean
  privacyAgreed: boolean
}

/** 운영진 가입 신청(`/admin`의 가입 화면). 프로젝트 설정(`config`)을 매번 읽어 화면을 분기한다. */
export function useOperatorSignup() {
  const sdk = getBaasAuthSdk()
  const {
    signup,
    config,
    terms,
    verified,
    fetchConfig,
    fetchTerms,
    sendCode,
    verifyCode,
    loading: isSubmitting,
    error: signupError,
  } = sdk.useSignup()

  const signUp = useCallback(
    async (input: OperatorSignupInput) => {
      if (!terms || !input.termsAgreed || !input.privacyAgreed) {
        return null
      }
      return signup(input.email, input.password, input.name, input.phone, {
        terms_agreed: input.termsAgreed,
        privacy_agreed: input.privacyAgreed,
        terms_version: terms.version,
      })
    },
    [signup, terms],
  )

  const formatPhone = useCallback((value: string) => sdk.formatPhone(value), [sdk])

  return {
    config,
    terms,
    verified,
    fetchConfig,
    fetchTerms,
    sendCode,
    verifyCode,
    signUp,
    isSubmitting,
    signupErrorMessage: signupError?.message ?? null,
    formatPhone,
  }
}
