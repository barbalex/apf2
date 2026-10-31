import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { MdPrint, MdHourglassEmpty, MdRefresh } from 'react-icons/md'
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
import { apiFetch } from '../../../modules/api.ts'
import { clearSiteData } from '../../../modules/clearSiteData.ts'

import type { UserId } from '../../../models/apflora/User.ts'
import type { TpopkontrId } from '../../../models/apflora/Tpopkontr.ts'

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

  const token = useAtomValue(userTokenAtom)
  const username = useAtomValue(userNameAtom)
  const setIsPrint = useSetAtom(setIsPrintAtom)
  const setIsEkfSinglePrint = useSetAtom(setIsEkfSinglePrintAtom)
  const ekfIsActive = !!ekfId

  const tokenDecoded = token ? jwtDecode<{ role?: string }>(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'

  const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
  const ekfRefYear = new Date(ekfRefDate).getFullYear()

  const { data } = useQuery({
    queryKey: ['ekfMenus', userId, ekfYear],
    queryFn: async (): Promise<EkfMenusQueryResult> => {
      // phase 5: user → its adresse → this year's freiwilligen-kontrollen.
      // accept empty jahr only when the reference year matches (former
      // dataByUserId vs dataWithDateByUserId)
      const jahr = +(ekfYear ?? 0)
      const acceptNullJahr = ekfRefYear === jahr
      const users =
        (await apiFetch<{ adresse_id: string | null }[]>(
          `/user?id=eq.${userId}&select=adresse_id:adresse_id`,
        )) ?? []
      const adresseId = users[0]?.adresse_id ?? null
      if (!adresseId) return { userById: null }
      const nodes =
        (await apiFetch<TpopkontrNode[]>('/rpc/query_tpopkontr?select=id', {
          method: 'POST',
          body: JSON.stringify({
            p_filter: {
              bearbeiter: adresseId,
              typ: { equalTo: 'Freiwilligen-Kontrolle' },
              ...(acceptNullJahr ?
                {
                  or: [{ jahr: { equalTo: jahr } }, { jahr: { isNull: true } }],
                }
              : { jahr: { equalTo: jahr } }),
            },
          }),
        })) ?? []
      return {
        userById: {
          id: userId as UserId,
          adresseByAdresseId: {
            tpopkontrsByBearbeiter: { nodes },
          },
        },
      }
    },
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
            to={`/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903${search}`}
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
      <Tooltip title={`${username} abmelden und Cache leeren`}>
        <IconButton
          className={styles.iconButton}
          aria-label={`${username} abmelden und Cache leeren`}
          data-id="ekf-bar-clear-site-data"
          onClick={() => void clearSiteData()}
        >
          <MdRefresh />
        </IconButton>
      </Tooltip>
    </>
  )
}
