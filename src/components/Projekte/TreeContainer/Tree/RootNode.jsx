import { memo } from 'react'

export const RootNode = memo(({ fetcher }) => {
  const { navData } = fetcher?.() ?? {}
  console.log('RootNode', { fetcher, navData })

  if (!navData) return null

  return <navData.component menu={navData} />
})
