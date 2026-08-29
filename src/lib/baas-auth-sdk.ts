import type { ReactNode } from 'react'

/**
 * `window.BaasSDK`는 CDN 전역이라 `.d.ts`가 없다(런타임 전역, 배포물은 스크립트뿐).
 * 인증(account) 기능이 실제로 쓰는 표면만 여기서 직접 선언해 캐스팅한다.
 * 권위 원본: skills/baas-integration-sdk/reference/sdk-surface.md "인증 (account)" 절.
 */

export type BaasUser = {
  id: string
  user_id: string
  email: string
  name: string
  phone: string | null
  is_profile_completed: boolean
  status: string
}

export type BaasSdkError = {
  message: string
  errorCode?: string
  status?: number
}

export type UseAuthResult = {
  isLoggedIn: boolean
  user: BaasUser | null
  loading: boolean
  error: BaasSdkError | null
  refetch: () => void
  clear: () => void
}

export type UseLoginResult = {
  login: (userId: string, userPw: string) => Promise<boolean>
  loading: boolean
  error: BaasSdkError | null
}

export type UseLogoutResult = {
  logout: () => Promise<boolean>
}

export type SignupConfig = {
  signup_verification: 'NONE' | 'EMAIL'
  require_signup_approval: boolean
}

export type SignupTermsSection = {
  title: string
  content: string
}

export type SignupTerms = {
  version: string
  terms: SignupTermsSection
  privacy: SignupTermsSection
}

export type SignupExtra = {
  terms_agreed: boolean
  privacy_agreed: boolean
  terms_version: string
}

export type UseSignupResult = {
  signup: (
    userId: string,
    userPw: string,
    name: string,
    phone: string,
    extra: SignupExtra,
  ) => Promise<BaasUser | null>
  config: SignupConfig | null
  terms: SignupTerms | null
  verified: boolean
  fetchConfig: () => Promise<SignupConfig | null>
  fetchTerms: () => Promise<SignupTerms | null>
  sendCode: (email: string) => Promise<boolean>
  verifyCode: (email: string, code: string) => Promise<boolean>
  loading: boolean
  error: BaasSdkError | null
}

export type BaasAuthSurface = {
  AuthProvider: (props: { children: ReactNode }) => ReactNode
  useAuth: () => UseAuthResult
  useLogin: () => UseLoginResult
  useLogout: () => UseLogoutResult
  useSignup: () => UseSignupResult
  formatPhone: (value: string) => string
}

declare global {
  interface Window {
    BaasSDK?: BaasAuthSurface
  }
}

/**
 * 앱 루트(`src/main.tsx`)가 `window.BaasSDK` 존재를 이미 보장한 뒤에만 화면이 렌더되므로,
 * 여기서는 실제 쓰는 표면 타입으로 캐스팅만 한다(별도 null 체크 없이 바로 사용).
 */
export function getBaasAuthSdk(): BaasAuthSurface {
  return window.BaasSDK as unknown as BaasAuthSurface
}
