import React, { useContext, useState, useCallback } from 'react'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { MdPrint, MdHourglassEmpty } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { useParams, useLocation } from 'react-router-dom'

import isMobilePhone from '../../../modules/isMobilePhone'
import EkfYear from './EkfYear'
import User from './User'
import storeContext from '../../../storeContext'
import userQuery from './query'
import dataByUserIdQuery from '../../Ekf/dataByUserId'
import dataWithDateByUserIdQuery from '../../Ekf/dataWithDateByUserId'

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
  span {
    top: -5px !important;
    right: -5px !important;
  }
`
const StyledBadge = styled(Badge)`
  .MuiBadge-anchorOriginTopRightRectangular {
    top: 9px !important;
    right: 9px !important;
  }
`
const spinning = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`
const StyledMdHourglassEmpty = styled(MdHourglassEmpty)`
  animation: ${spinning} 3s linear infinite;
`

const ProjekteAppBar = () => {
  const { userId, ekfId, ekfYear } = useParams()
  const { search } = useLocation()

  const store = useContext(storeContext)
  const { user, setIsPrint, setIsEkfSinglePrint } = store
  const ekfIsActive = !!ekfId

  const isMobile = isMobilePhone()

  const { token, name: username } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'

  const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
  const ekfRefYear = new Date(ekfRefDate).getFullYear()

  const query =
    ekfRefYear === ekfYear ? dataByUserIdQuery : dataWithDateByUserIdQuery

  const { data } = useQuery(query, {
    variables: { id: userId, jahr: +ekfYear },
    fetchPolicy: 'network-only',
  })

  // if no ekfAdresseId
  // need to fetch adresse.id for this user
  // and use that instead
  const { data: userData } = useQuery(userQuery, {
    variables: { userId: userId ?? '99999999-9999-9999-9999-999999999999' },
  })

  const userName = userData?.userById?.name ?? null
  const ekfCount = (
    data?.userById?.adresseByAdresseId?.tpopkontrsByBearbeiter?.nodes ?? []
  ).length

  const [userOpen, setUserOpen] = useState(false)
  const [preparingEkfMultiprint, setPreparingEkfMultiprint] = useState(false)

  const toggleUserOpen = useCallback(() => setUserOpen(!userOpen), [userOpen])

  const onClickPrintSingle = useCallback(() => {
    setIsPrint(true)
    setIsEkfSinglePrint(true)
    setTimeout(() => {
      window.print()
      setIsPrint(false)
      setIsEkfSinglePrint(false)
    })
  }, [setIsEkfSinglePrint, setIsPrint])

  const onClickPrintAll = useCallback(() => {
    setPreparingEkfMultiprint(true)
    setIsPrint(true)
    // TODO: need to know when all tpopfreiwkontr forms have finisched rendering
    // idea for hack: use ekfCount to set timeout value?
    setTimeout(() => {
      window.print()
      setIsPrint(false)
      setPreparingEkfMultiprint(false)
      setPreparingEkfMultiprint(false)
    }, 3000 + ekfCount * 300)
  }, [ekfCount, setIsPrint])

  return (
    <>
      {!isMobile && (
        <SiteTitle
          variant="outlined"
          component={Link}
          to={`/${search}`}
          title="Home"
        >
          {userName
            ? `AP Flora: EKF von ${userName}`
            : 'AP Flora: Erfolgs-Kontrolle Freiwillige'}
        </SiteTitle>
      )}
      <MenuDiv>
        <>
          {ekfCount > 1 && (
            <StyledBadge badgeContent={ekfCount}>
              <StyledIconButton
                onClick={onClickPrintAll}
                title={`Alle ${ekfCount} EKF drucken`}
              >
                {preparingEkfMultiprint ? (
                  <StyledMdHourglassEmpty />
                ) : (
                  <MdPrint />
                )}
              </StyledIconButton>
            </StyledBadge>
          )}
          <StyledIconButton
            onClick={onClickPrintSingle}
            disabled={!ekfIsActive}
            title="Angezeigte EKF drucken"
          >
            <MdPrint />
          </StyledIconButton>
          <EkfYear />
          {!isFreiwillig && (
            <StyledButton
              variant="text"
              component={Link}
              to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
            >
              Normal-Ansicht
            </StyledButton>
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
            to={`/Dokumentation/${search}`}
          >
            Dokumentation
          </StyledButton>
        </>
      </MenuDiv>
    </>
  )
}

export default observer(ProjekteAppBar)
