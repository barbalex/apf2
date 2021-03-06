import React, { useContext, useCallback } from 'react'
import Button from '@material-ui/core/Button'
import remove from 'lodash/remove'
import styled from 'styled-components'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { Link } from 'gatsby'

import isMobilePhone from '../../../../../modules/isMobilePhone'
import setUrlQueryValue from '../../../../../modules/setUrlQueryValue'
import More from '../More'
import storeContext from '../../../../../storeContext'

const SiteTitle = styled(Button)`
  display: none !important;
  color: white !important;
  font-size: 20px !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  @media (min-width: 750px) {
    display: block !important;
  }
  :hover {
    border-width: 1px !important;
  }
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`
// need to prevent boolean props from being passed to dom
const StyledButton = ({ preceded, followed, ...rest }) => {
  const StyledButton = styled(Button)`
    color: white !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    border-right-color: ${followed
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
    border-left-color: ${preceded
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
    border-top-left-radius: ${preceded ? '0' : '4px'} !important;
    border-bottom-left-radius: ${preceded ? '0' : '4px'} !important;
    border-top-right-radius: ${followed ? '0' : '4px'} !important;
    border-bottom-right-radius: ${followed ? '0' : '4px'} !important;
    margin-right: ${followed ? '-1px' : 'unset'} !important;
    text-transform: none !important;
  `
  return <StyledButton {...rest} />
}
const DokuButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
`

const EkPlanAppBar = () => {
  const store = useContext(storeContext)
  const {
    dataFilterClone1To2,
    user,
    urlQuery,
    setUrlQuery,
    cloneTree2From1,
    tree,
  } = store

  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */
  const projekteTabs = urlQuery.projekteTabs.slice().filter(el => !!el)
  const isMobile = isMobilePhone()

  const { token } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null

  const onClickButton = useCallback(
    name => {
      if (isMobile) {
        // show one tab only
        setUrlQueryValue({
          key: 'projekteTabs',
          value: [name],
          urlQuery,
          setUrlQuery,
        })
      } else {
        if (projekteTabs.includes(name)) {
          remove(projekteTabs, el => el === name)
          if (name === 'tree2') {
            // close all tree2-tabs
            remove(projekteTabs, el => el.includes('2'))
          }
        } else {
          projekteTabs.push(name)
          if (name === 'tree2') {
            cloneTree2From1()
            dataFilterClone1To2()
          }
        }
        setUrlQueryValue({
          key: 'projekteTabs',
          value: projekteTabs,
          urlQuery,
          setUrlQuery,
        })
      }
    },
    [
      cloneTree2From1,
      isMobile,
      dataFilterClone1To2,
      projekteTabs,
      setUrlQuery,
      urlQuery,
    ],
  )
  const onClickExporte = useCallback(() => onClickButton('exporte'), [
    onClickButton,
  ])
  const onClickAp = useCallback(() => {
    // eslint-disable-next-line no-unused-vars
    const [projectTitle, projectId, ...rest] = tree.activeNodeArray
    tree.setActiveNodeArray([projectTitle, projectId])
  }, [tree])

  return (
    <>
      {!isMobile && (
        <SiteTitle variant="outlined" component={Link} to="/" title="Home">
          AP Flora: EK-Planung
        </SiteTitle>
      )}
      <MenuDiv>
        <StyledButton
          variant="text"
          preceded="false"
          followed="false"
          onClick={onClickAp}
          data-id="ek-planung"
          title="EK und EKF planen"
        >
          Aktionspläne bearbeiten
        </StyledButton>
        <DokuButton
          variant="text"
          component={Link}
          to="/Dokumentation/Benutzer/"
        >
          Dokumentation
        </DokuButton>
        <More onClickExporte={onClickExporte} role={role} />
      </MenuDiv>
    </>
  )
}

export default observer(EkPlanAppBar)
