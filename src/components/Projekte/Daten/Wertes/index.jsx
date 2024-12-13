import { memo } from 'react'
import { useAtom } from 'jotai'

import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useWertesNavData } from '../../../../modules/useWertesNavData.js'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'

export const Component = memo(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)
  
  const { navData, isLoading, error } = useWertesNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <List
      items={navData?.menus}
      title={navData?.label}
    />
  )
})
