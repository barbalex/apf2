import React, { useContext, useCallback } from 'react'
import Button from '@mui/material/Button'
import remove from 'lodash/remove'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import isMobilePhone from '../../../../../modules/isMobilePhone'
import setUrlQueryValue from '../../../../../modules/setUrlQueryValue'
import storeContext from '../../../../../storeContext'

const StyledButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-right-color: ${(props) =>
    props.followed === 'true'
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
  border-left-color: ${(props) =>
    props.preceded === 'true'
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
  border-top-left-radius: ${(props) =>
    props.preceded === 'true' ? '0' : '4px'} !important;
  border-bottom-left-radius: ${(props) =>
    props.preceded === 'true' ? '0' : '4px'} !important;
  border-top-right-radius: ${(props) =>
    props.followed === 'true' ? '0' : '4px'} !important;
  border-bottom-right-radius: ${(props) =>
    props.followed === 'true' ? '0' : '4px'} !important;
  margin-right: ${(props) =>
    props.followed === 'true' ? '-1px' : 'unset'} !important;
  text-transform: none !important;
`

const MyAppBarDaten = ({ treeNr = '' }) => {
  const { dataFilterClone1To2, urlQuery, setUrlQuery, cloneTree2From1, tree } =
    useContext(storeContext)
  const { activeNodeArray } = tree

  const projekteTabs = urlQuery.projekteTabs.slice().filter((el) => !!el)
  const isDaten = projekteTabs.includes(`daten${treeNr}`)
  const isTree = projekteTabs.includes(`tree${treeNr}`)
  const isEkPlan =
    activeNodeArray.length === 3 &&
    activeNodeArray[0] === 'Projekte' &&
    activeNodeArray[2] === 'EK-Planung'

  const onClickButton = useCallback(() => {
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
        remove(copyOfProjekteTabs, (el) => el === `daten${treeNr}`)
      } else {
        copyOfProjekteTabs.push(`daten${treeNr}`)
        if (treeNr === '2') {
          cloneTree2From1()
          dataFilterClone1To2()
        }
      }
      setUrlQueryValue({
        key: 'projekteTabs',
        value: copyOfProjekteTabs,
        urlQuery,
        setUrlQuery,
      })
    }
  }, [
    cloneTree2From1,
    dataFilterClone1To2,
    projekteTabs,
    setUrlQuery,
    treeNr,
    urlQuery,
  ])

  let followed = projekteTabs.includes('filter')
  if (treeNr === '2') {
    followed = projekteTabs.includes('filter2')
  }

  return (
    <StyledButton
      variant={!isEkPlan && isDaten ? 'outlined' : 'text'}
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
