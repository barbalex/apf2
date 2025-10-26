import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router'
import { MdPrint, MdHourglassEmpty } from 'react-icons/md'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { useParams, useLocation } from 'react-router'

import { EkfYear } from './EkfYear.jsx'
import { User } from './User/index.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { dataByUserId as dataByUserIdQuery } from '../../Ekf/dataByUserId.js'
import { dataWithDateByUserId as dataWithDateByUserIdQuery } from '../../Ekf/dataWithDateByUserId.js'

const StyledButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
  width: ${(props) => `${props.width}px` ?? 'unset'} !important;
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
    color: white !important;
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

export const Menus = observer(() => {
  const { userId, ekfId, ekfYear } = useParams()
  const { search } = useLocation()

  const store = useContext(MobxContext)
  const { user, setIsPrint, setIsEkfSinglePrint } = store
  const ekfIsActive = !!ekfId

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

  const ekfCount = (
    data?.userById?.adresseByAdresseId?.tpopkontrsByBearbeiter?.nodes ?? []
  ).length

  const [userOpen, setUserOpen] = useState(false)
  const [preparingEkfMultiprint, setPreparingEkfMultiprint] = useState(false)

  const toggleUserOpen = () => setUserOpen(!userOpen)

  const onClickPrintSingle = () => {
    setIsPrint(true)
    setIsEkfSinglePrint(true)
    setTimeout(() => {
      window.print()
      setIsPrint(false)
      setIsEkfSinglePrint(false)
    })
  }

  const onClickPrintAll = () => {
    setPreparingEkfMultiprint(true)
    setIsPrint(true)
    // TODO: need to know when all tpopfreiwkontr forms have finisched rendering
    // idea for hack: use ekfCount to set timeout value?
    setTimeout(
      () => {
        window.print()
        setIsPrint(false)
        setPreparingEkfMultiprint(false)
        setPreparingEkfMultiprint(false)
      },
      3000 + ekfCount * 300,
    )
  }

  return (
    <>
      {ekfCount > 1 && (
        <StyledBadge badgeContent={ekfCount}>
          <Tooltip title={`Alle ${ekfCount} EKF drucken`}>
            <StyledIconButton onClick={onClickPrintAll}>
              {preparingEkfMultiprint ?
                <StyledMdHourglassEmpty />
              : <MdPrint />}
            </StyledIconButton>
          </Tooltip>
        </StyledBadge>
      )}
      <Tooltip title="Angezeigte EKF drucken">
        <span>
          <StyledIconButton
            onClick={onClickPrintSingle}
            disabled={!ekfIsActive}
          >
            <MdPrint />
          </StyledIconButton>
        </span>
      </Tooltip>
      <EkfYear />
      {!isFreiwillig && (
        <Tooltip title="In die Normal-Ansicht wechseln">
          <StyledButton
            variant="text"
            component={Link}
            to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
          >
            Normal-Ansicht
          </StyledButton>
        </Tooltip>
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
      <Tooltip title="Dokumentation öffnen">
        <StyledButton
          variant="text"
          component={Link}
          to={`/Dokumentation/${search}`}
          // width={129}
        >
          Dokumentation
        </StyledButton>
      </Tooltip>
    </>
  )
})
