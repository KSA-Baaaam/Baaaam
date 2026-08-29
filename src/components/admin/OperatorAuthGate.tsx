import { useState } from 'react'

import { OperatorLoginForm } from '@/components/admin/OperatorLoginForm'
import { OperatorSignupForm } from '@/components/admin/OperatorSignupForm'

type Mode = 'login' | 'signup'

/** 운영진 인증 게이트. 로그인/가입 신청 폼을 전환한다(둘 다 실제 BaaS 계정 인증). */
export function OperatorAuthGate() {
  const [mode, setMode] = useState<Mode>('login')

  if (mode === 'signup') {
    return <OperatorSignupForm onBackToLogin={() => setMode('login')} />
  }
  return <OperatorLoginForm onSwitchToSignup={() => setMode('signup')} />
}
