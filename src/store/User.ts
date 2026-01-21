export interface User {
  name: string
  token: string | null
  id: string | null
}

export const defaultValue: User = {
  name: '',
  token: null,
  id: null,
}
