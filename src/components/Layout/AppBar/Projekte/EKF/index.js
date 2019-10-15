import React, { useContext, useState, useCallback } from 'react'
import Button from '@material-ui/core/Button'
import remove from 'lodash/remove'
import styled from 'styled-components'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import { Link } from 'gatsby'
import get from 'lodash/get'
import { MdPrint } from 'react-icons/md'
import IconButton from '@material-ui/core/IconButton'

import isMobilePhone from '../../../../../modules/isMobilePhone'
import setUrlQueryValue from '../../../../../modules/setUrlQueryValue'
import More from '../More'
import EkfYear from '../EkfYear'
import User from './User'
import storeContext from '../../../../../storeContext'
import queryAdresse from './queryAdresse'

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
const StyledButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
`
const StyledIconButton = styled(IconButton)`
  color: white !important;
`

const ProjekteAppBar = () => {
  const store = useContext(storeContext)
  const {
    nodeFilterClone1To2,
    user,
    setView,
    urlQuery,
    setUrlQuery,
    cloneTree2From1,
    ekfAdresseId,
  } = store
  const { activeForm } = store.tree
  console.log('Appbar EKF, activeForm', activeForm)
  const ekfIsActive = activeForm.form === 'tpopfreiwkontr'

  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */
  const projekteTabs = urlQuery.projekteTabs.slice().filter(el => !!el)
  const isMobile = isMobilePhone()

  const { token, name: username } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'

  const { data } = useQuery(queryAdresse, {
    variables: { id: ekfAdresseId },
  })
  const adresseName = get(data, 'adresseById.name') || null

  const [userOpen, setUserOpen] = useState(false)

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
            nodeFilterClone1To2()
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
      nodeFilterClone1To2,
      projekteTabs,
      setUrlQuery,
      urlQuery,
    ],
  )
  const onClickExporte = useCallback(() => onClickButton('exporte'), [
    onClickButton,
  ])
  const setViewNormal = useCallback(() => setView('normal'), [setView])
  const toggleUserOpen = useCallback(() => setUserOpen(!userOpen), [userOpen])

  return (
    <>
      {!isMobile && (
        <SiteTitle variant="outlined" component={Link} to="/" title="Home">
          {!!adresseName
            ? `AP Flora: EKF von ${adresseName}`
            : 'AP Flora: Erfolgs-Kontrolle Freiwillige'}
        </SiteTitle>
      )}
      <MenuDiv>
        <>
          {ekfIsActive && (
            <StyledIconButton>
              <MdPrint />
            </StyledIconButton>
          )}
          <EkfYear />
          {!isFreiwillig && (
            <StyledButton onClick={setViewNormal}>Normal-Ansicht</StyledButton>
          )}
          {isFreiwillig && (
            <>
              <StyledButton onClick={toggleUserOpen}>
                {`Benutzer: ${username}`}
              </StyledButton>
              <User
                username={username}
                userOpen={userOpen}
                toggleUserOpen={toggleUserOpen}
              />
            </>
          )}
          <StyledButton
            variant="text"
            component={Link}
            to="/Dokumentation/Benutzer/"
          >
            Dokumentation
          </StyledButton>
          <More onClickExporte={onClickExporte} role={role} />
        </>
      </MenuDiv>
    </>
  )
}

export default observer(ProjekteAppBar)
