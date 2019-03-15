// @flow
import React, { useContext, useCallback } from 'react'
import Button from '@material-ui/core/Button'
import remove from 'lodash/remove'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import isMobilePhone from '../../modules/isMobilePhone'
import setUrlQueryValue from '../../modules/setUrlQueryValue'
import mobxStoreContext from '../../mobxStoreContext'

const StyledButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-right-color: ${props =>
    props.followed === 'true'
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
  border-left-color: ${props =>
    props.preceded === 'true'
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
  border-top-left-radius: ${props =>
    props.preceded === 'true' ? '0' : '4px'} !important;
  border-bottom-left-radius: ${props =>
    props.preceded === 'true' ? '0' : '4px'} !important;
  border-top-right-radius: ${props =>
    props.followed === 'true' ? '0' : '4px'} !important;
  border-bottom-right-radius: ${props =>
    props.followed === 'true' ? '0' : '4px'} !important;
  margin-right: ${props =>
    props.followed === 'true' ? '-1px' : 'unset'} !important;
`

const MyAppBarDaten = ({ treeNr = '' }: { treeNr: string }) => {
  const {
    nodeFilterClone1To2,
    urlQuery,
    setUrlQuery,
    cloneTree2From1,
  } = useContext(mobxStoreContext)

  const { projekteTabs } = urlQuery
  const isDaten = projekteTabs.includes(`daten${treeNr}`)
  const isTree = projekteTabs.includes(`tree${treeNr}`)

  const onClickButton = useCallback(
    event => {
      // catch case when inner filter button was clicked
      if (event.target.localName !== 'span') return
      const copyOfProjekteTabs = [...projekteTabs]
      if (isMobilePhone()) {
        // show one tab only
        setUrlQueryValue({
          key: 'projekteTabs',
          value: [`daten${treeNr}`],
          urlQuery,
          setUrlQuery,
        })
      } else {
        if (copyOfProjekteTabs.includes(`daten${treeNr}`)) {
          remove(copyOfProjekteTabs, el => el === `daten${treeNr}`)
        } else {
          copyOfProjekteTabs.push(`daten${treeNr}`)
          if (treeNr === '2') {
            cloneTree2From1()
            nodeFilterClone1To2()
          }
        }
        setUrlQueryValue({
          key: 'projekteTabs',
          value: copyOfProjekteTabs,
          urlQuery,
          setUrlQuery,
        })
      }
    },
    [projekteTabs, urlQuery],
  )

  let followed = projekteTabs.slice().includes('filter')
  if (treeNr === '2') followed = false

  return (
    <StyledButton
      variant={isDaten ? 'outlined' : 'text'}
      preceded={isTree.toString()}
      followed={followed.toString()}
      onClick={onClickButton}
      data-id={`nav-daten${treeNr || 1}`}
    >
      {`Daten${treeNr === '2' ? ' 2' : ''}`}
    </StyledButton>
  )
}

export default observer(MyAppBarDaten)
