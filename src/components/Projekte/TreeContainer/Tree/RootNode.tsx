import type { TreeMenu } from './types.ts'

interface RootNodeProps {
  fetcher?: (() => TreeMenu | undefined) | undefined
}

export const RootNode = ({ fetcher }: RootNodeProps) => {
  const navData = fetcher?.()
  const Component = navData?.component

  if (!Component || !navData) return null

  return <Component menu={navData} />
}
