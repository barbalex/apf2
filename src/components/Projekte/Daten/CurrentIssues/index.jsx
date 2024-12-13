import { memo } from 'react'
import { useAtom } from 'jotai'

import { useCurrentissuesNavData } from '../../../../modules/useCurrentissuesNavData.js'
import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'

export const Component = memo(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  const { navData, isLoading, error } = useCurrentissuesNavData()
  const currentissues = navData?.data?.allCurrentissues?.nodes ?? []
  const totalCount = navData?.data?.allCurrentissues?.totalCount ?? 0

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <List
      items={navData.menus}
      title={navData.label}
    />
  )
})
