import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | undefined>(undefined)

  useEffect(() => {
    const authToken = Cookies.get('auth_token')
    setToken(authToken)
  }, [])

  return { token }
}
