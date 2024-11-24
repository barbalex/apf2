import { memo, useCallback } from 'react'
import Button from '@mui/material/Button'
import remove from 'lodash/remove'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { isMobilePhone } from '../../../../modules/isMobilePhone.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'
import { StyledButton } from './index.jsx'

export const Daten = memo(({ treeNr = '' }) => {
  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const isDaten = projekteTabs.includes(`daten${treeNr}`)
  const isTree = projekteTabs.includes(`tree${treeNr}`)

  const onClickButton = useCallback(() => {
    const copyOfProjekteTabs = [...projekteTabs]
    if (isMobilePhone()) {
      // show one tab only
      setProjekteTabs([`daten${treeNr}`])
    } else {
      if (copyOfProjekteTabs.includes(`daten${treeNr}`)) {
        remove(copyOfProjekteTabs, (el) => el === `daten${treeNr}`)
      } else {
        copyOfProjekteTabs.push(`daten${treeNr}`)
      }
      setProjekteTabs(copyOfProjekteTabs)
    }
  }, [projekteTabs, setProjekteTabs, treeNr])

  let followed = projekteTabs.includes('filter')
  if (treeNr === '2') {
    followed = projekteTabs.includes('filter2')
  }

  return (
    <StyledButton
      variant={isDaten ? 'outlined' : 'text'}
      preceded={isTree.toString()}
      followed={followed.toString()}
      onClick={onClickButton}
      data-id={`nav-daten${treeNr || 1}`}
      width={treeNr === '2' ? 92 : 83}
    >
      {`Daten${treeNr === '2' ? ' 2' : ''}`}
    </StyledButton>
  )
})
