import { memo } from 'react'

export const RootNode = memo(({ fetcher }) => {
  const res = fetcher?.()
  const navData = res?.navData
  console.log('RootNode', { fetcher, navData })

  if (!navData) return null

  return <navData.component menu={navData} />
})
