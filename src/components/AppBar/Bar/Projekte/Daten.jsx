import { memo, useCallback } from 'react'
import Button from '@mui/material/Button'
import remove from 'lodash/remove'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { StyledButton } from './index.jsx'
import { constants } from '../../../../modules/constants.js'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.js'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'

const isMobileView = window.innerWidth <= constants.mobileViewMaxWidth

export const Daten = memo(({ treeNr = '', hide = false, ref }) => {
  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const isDaten = projekteTabs.includes(`daten${treeNr}`)
  const isTree = projekteTabs.includes(`tree${treeNr}`)

  const [isDesktopView] = useAtom(isDesktopViewAtom)

  const onClickButton = useCallback(() => {
    const copyOfProjekteTabs = [...projekteTabs]
    if (isDesktopView) {
      if (copyOfProjekteTabs.includes(`daten${treeNr}`)) {
        remove(copyOfProjekteTabs, (el) => el === `daten${treeNr}`)
      } else {
        copyOfProjekteTabs.push(`daten${treeNr}`)
      }
      setProjekteTabs(copyOfProjekteTabs)
    } else {
      // show one tab only
      setProjekteTabs([`daten${treeNr}`])
    }
  }, [projekteTabs, setProjekteTabs, treeNr])

  let followed = projekteTabs.includes('filter')
  if (treeNr === '2') {
    followed = projekteTabs.includes('filter2')
  }

  return (
    <StyledButton
      ref={ref}
      variant={isDaten ? 'outlined' : 'text'}
      preceded={isDesktopView ? isTree.toString() : 'false'}
      followed={followed.toString()}
      onClick={onClickButton}
      data-id={`nav-daten${treeNr || 1}`}
    >
      {`Daten${treeNr === '2' ? ' 2' : ''}`}
    </StyledButton>
  )
})
