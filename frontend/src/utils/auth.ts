const TOKEN_KEY = 'token'
const INFO_KEY = 'uInfo'

export const getToken = (): string => localStorage.getItem(TOKEN_KEY) || ''

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)

export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

export const getInfo = <T = any>(): T | null => {
  const raw = localStorage.getItem(INFO_KEY)
  return raw ? (JSON.parse(raw) as T) : null
}

export const setInfo = (info: unknown) => localStorage.setItem(INFO_KEY, JSON.stringify(info))

export const removeInfo = () => localStorage.removeItem(INFO_KEY)
