'use client'

import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import Api, { endpoints } from '@/lib/api'
import type { Dispatch, SetStateAction } from 'react'
import { login } from '@/store/slices/userSlice'
import { useTranslation } from 'react-i18next'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/button'

const GoogleLoginButton = ({ setMsg }: { setMsg: Dispatch<SetStateAction<string>> }) => {
  const dispatch = useAppDispatch()
  const nav = useRouter()
  const { t } = useTranslation()

  const handleLoginGoogle = useGoogleLogin({
    onSuccess: async (response: any) => {
      try {
        const res = await Api.post(endpoints['google-login'], {
          code: response.code,
        })

        if (res.data.data.accessToken) {
          dispatch(login({ user: res.data.data.user, accessToken: res.data.data.accessToken }))
          nav.push('/')
        } else {
          sessionStorage.setItem('signupNewUser', JSON.stringify(res.data.data))
          nav.push('/signup')
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          setMsg(error.response.data)
        } else {
          setMsg(t('validation.system_error'))
        }
      }
    },
    onError: () => setMsg(t('validation.system_error')),
    flow: 'auth-code',
  })

  return (
    <Button variant="outline" type="button" className="w-full" onClick={handleLoginGoogle}>
      <FcGoogle />
      {t('login.google')}
    </Button>
  )
}

export default GoogleLoginButton
