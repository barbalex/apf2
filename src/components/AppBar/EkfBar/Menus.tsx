import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
import { Link } from 'react-router'
import { MdPrint, MdHourglassEmpty } from 'react-icons/md'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { useParams, useLocation } from 'react-router'
import { useSetAtom, useAtomValue } from 'jotai'

import { EkfYear } from './EkfYear.tsx'
import { User } from './User/index.tsx'
import {
  setIsPrintAtom,
  setIsEkfSinglePrintAtom,
  userTokenAtom,
  userNameAtom,
} from '../../../store/index.ts'
import { dataByUserId as dataByUserIdQuery } from '../../Ekf/dataByUserId.ts'
import { dataWithDateByUserId as dataWithDateByUserIdQuery } from '../../Ekf/dataWithDateByUserId.ts'

import type { UserId, AdresseId } from '../../../models/apflora/public/User.ts'
import type { TpopkontrId } from '../../../models/apflora/public/Tpopkontr.ts'

import styles from './Menus.module.css'

interface TpopkontrNode {
  id: TpopkontrId
}

interface EkfMenusQueryResult {
  userById: {
    id: UserId
    adresseByAdresseId: {
      tpopkontrsByBearbeiter: {
        nodes: TpopkontrNode[]
      }
    } | null
  } | null
}

export const Menus = () => {
  const { userId, ekfId, ekfYear } = useParams()
  const { search } = useLocation()
  const apolloClient = useApolloClient()

  const token = useAtomValue(userTokenAtom)
  const username = useAtomValue(userNameAtom)
  const setIsPrint = useSetAtom(setIsPrintAtom)
  const setIsEkfSinglePrint = useSetAtom(setIsEkfSinglePrintAtom)
  const ekfIsActive = !!ekfId

  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'

  const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
  const ekfRefYear = new Date(ekfRefDate).getFullYear()

  const query =
    ekfRefYear === ekfYear ? dataByUserIdQuery : dataWithDateByUserIdQuery

  const { data } = useQuery({
    queryKey: ['ekfMenus', userId, ekfYear],
    queryFn: async () => {
      const result = await apolloClient.query<EkfMenusQueryResult>({
        query,
        variables: { id: userId, jahr: +ekfYear },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const ekfCount = (
    data.userById.adresseByAdresseId.tpopkontrsByBearbeiter.nodes
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
    // TODO: need to know when all tpopfreiwkontr forms have finished rendering
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
        <Badge
          className={styles.badge}
          badgeContent={ekfCount}
        >
          <Tooltip title={`Alle ${ekfCount} EKF drucken`}>
            <IconButton
              className={styles.iconButton}
              onClick={onClickPrintAll}
            >
              {preparingEkfMultiprint ?
                <MdHourglassEmpty className={styles.hourglass} />
              : <MdPrint />}
            </IconButton>
          </Tooltip>
        </Badge>
      )}
      <Tooltip title="Angezeigte EKF drucken">
        <span>
          <IconButton
            className={styles.iconButton}
            onClick={onClickPrintSingle}
            disabled={!ekfIsActive}
          >
            <MdPrint />
          </IconButton>
        </span>
      </Tooltip>
      <EkfYear />
      {!isFreiwillig && (
        <Tooltip title="In die Normal-Ansicht wechseln">
          <Button
            className={styles.button}
            variant="text"
            component={Link}
            to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
          >
            Normal-Ansicht
          </Button>
        </Tooltip>
      )}
      {isFreiwillig && (
        <>
          <Button
            className={styles.button}
            onClick={toggleUserOpen}
          >
            {`Benutzer: ${username}`}
          </Button>
          <User
            username={username}
            userOpen={userOpen}
            toggleUserOpen={toggleUserOpen}
          />
        </>
      )}
      <Tooltip title="Dokumentation öffnen">
        <Button
          className={styles.button}
          variant="text"
          component={Link}
          to={`/Dokumentation/${search}`}
        >
          Dokumentation
        </Button>
      </Tooltip>
    </>
  )
}
