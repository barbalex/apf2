import type { ComponentType, ReactNode } from 'react'

// shape of the nav data returned by the useXxxNavData hooks in src/modules
export interface NavMenuData {
  id: string
  label?: ReactNode
  labelEkf?: ReactNode
  labelEk?: ReactNode
  labelLeftElements?: ComponentType[]
  labelRightElements?: ComponentType[]
}

export interface NavData {
  id: string
  url: string
  label?: ReactNode
  labelShort?: ReactNode
  listFilter?: string
  menus: NavMenuData[]
}
