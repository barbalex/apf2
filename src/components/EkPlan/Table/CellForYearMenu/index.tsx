import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { MdEdit as EditIcon, MdViewList as ListIcon } from 'react-icons/md'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import {
  userNameAtom,
  addNotificationAtom,
  ekPlanShowEkAtom,
  ekPlanShowEkfAtom,
  ekPlanShowMassnAtom,
  ekPlanYearClickedAtom,
  ekPlanYearMenuAnchorAtom,
  ekPlanCloseYearCellMenuAtom,
} from '../../../../store/index.ts'
import { queryTpop } from './queryTpop.ts'
import { queryEkplansOfTpop } from './queryEkplansOfTpop.ts'
import { mutationCreateEkplan } from './mutationCreateEkplan.ts'
import { mutationDeleteEkplan } from './mutationDeleteEkplan.ts'

import { EksMenu } from './EksMenu/index.tsx'
import { EkfsMenu } from './EkfsMenu/index.tsx'
import { MassnsMenu } from './MassnsMenu/index.tsx'

import type { TpopId } from '../../../../models/apflora/Tpop.ts'
import type { PopId } from '../../../../models/apflora/Pop.ts'
import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { ProjektId } from '../../../../models/apflora/Projekt.ts'
import type { TpopkontrId } from '../../../../models/apflora/Tpopkontr.ts'
import type { TpopmassnId } from '../../../../models/apflora/Tpopmassn.ts'
import type { AdresseId } from '../../../../models/apflora/Adresse.ts'
import type { TpopkontrzaehlId } from '../../../../models/apflora/Tpopkontrzaehl.ts'
import type { TpopkontrzaehlEinheitWerteId } from '../../../../models/apflora/TpopkontrzaehlEinheitWerte.ts'
import type { TpopkontrzaehlMethodeWerteId } from '../../../../models/apflora/TpopkontrzaehlMethodeWerte.ts'

import styles from './index.module.css'

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

export const CellForYearMenu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const showEk = useAtomValue(ekPlanShowEkAtom)
  const showEkf = useAtomValue(ekPlanShowEkfAtom)
  const showMassn = useAtomValue(ekPlanShowMassnAtom)
  const yearClicked = useAtomValue(ekPlanYearClickedAtom)
  const yearMenuAnchor = useAtomValue(ekPlanYearMenuAnchorAtom)
  const closeYearCellMenu = useSetAtom(ekPlanCloseYearCellMenuAtom)
  const { year, tpopId } = yearClicked

  const [eksAnchor, setEksAnchor] = useState(null)
  const [ekfsAnchor, setEkfsAnchor] = useState(null)
  const [massnsAnchor, setMassnsAnchor] = useState(null)

  const closeEksMenu = () => setEksAnchor(null)
  const closeEkfsMenu = () => setEkfsAnchor(null)
  const closeMassnsMenu = () => setMassnsAnchor(null)

  const removeEkPlan = async (typ) => {
    let qResult
    try {
      qResult = await apolloClient.query({
        query: queryEkplansOfTpop,
        variables: {
          tpopId,
          jahr: year,
        },
      })
    } catch (error) {
      closeYearCellMenu()
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    const id = qResult.data.allEkplans.nodes.find((o) => o.typ === typ).id
    try {
      await apolloClient.mutate({
        mutation: mutationDeleteEkplan,
        variables: { id },
      })
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: ['RowQueryForEkPlan'],
    })
    closeYearCellMenu()
  }

  const onClickEkEntfernen = () => removeEkPlan('EK')
  const onClickEkfEntfernen = () => removeEkPlan('EKF')

  const userName = useAtomValue(userNameAtom)

  const addEkPlan = async (typ) => {
    const variables = {
      tpopId,
      jahr: year,
      typ,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate({
        mutation: mutationCreateEkplan,
        variables,
      })
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: ['RowQueryForEkPlan'],
    })
    closeYearCellMenu()
  }

  const onClickEkPlanen = () => addEkPlan('EK')
  const onClickEkfPlanen = () => addEkPlan('EKF')

  interface TpopkontrzaehlEinheitWerteNode {
    id: TpopkontrzaehlEinheitWerteId
    text: string | null
  }

  interface TpopkontrzaehlMethodeWerteNode {
    id: TpopkontrzaehlMethodeWerteId
    text: string | null
  }

  interface TpopkontrzaehlNode {
    id: TpopkontrzaehlId
    anzahl: number | null
    einheit?: TpopkontrzaehlEinheitWerteId | null
    tpopkontrzaehlEinheitWerteByEinheit: TpopkontrzaehlEinheitWerteNode | null
    tpopkontrzaehlMethodeWerteByMethode: TpopkontrzaehlMethodeWerteNode | null
  }

  interface AdresseNode {
    id: AdresseId
    name: string | null
  }

  interface TpopkontrNode {
    id: TpopkontrId
    datum: Date | null
    typ: string | null
    adresseByBearbeiter: AdresseNode | null
    tpopkontrzaehlsByTpopkontrId: {
      nodes: TpopkontrzaehlNode[]
    }
  }

  interface TpopmassnTypWerteNode {
    id: string
    text: string | null
  }

  interface TpopmassnNode {
    id: TpopmassnId
    datum: Date | null
    tpopmassnTypWerteByTyp: TpopmassnTypWerteNode | null
    beschreibung: string | null
    anzTriebe: number | null
    anzPflanzen: number | null
    zieleinheitAnzahl: number | null
    tpopkontrzaehlEinheitWerteByZieleinheitEinheit: TpopkontrzaehlEinheitWerteNode | null
    bemerkungen: string | null
    adresseByBearbeiter: AdresseNode | null
  }

  interface ApNode {
    id: ApId
    projId: ProjektId | null
  }

  interface PopNode {
    id: PopId
    apByApId: ApNode | null
  }

  interface TpopNode {
    id: TpopId
    eks: {
      nodes: TpopkontrNode[]
    }
    ekfs: {
      nodes: TpopkontrNode[]
    }
    massns: {
      nodes: TpopmassnNode[]
    }
    popByPopId: PopNode | null
  }

  interface EkplanmenuTpopQueryResult {
    tpopById: TpopNode | null
  }

  const { data } = useQuery({
    queryKey: ['CellForYearMenu', tpopId, year, showEk, showEkf, showMassn],
    queryFn: async () => {
      const result = await apolloClient.query<EkplanmenuTpopQueryResult>({
        query: queryTpop,
        variables: {
          tpopId,
          jahr: year,
          showEk,
          showEkf,
          showMassn,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  const tpop = data?.data?.tpopById ?? {}
  const eks = data?.data?.tpopById?.eks?.nodes ?? []
  const ekfs = data?.data?.tpopById?.ekfs?.nodes ?? []
  const massns = data?.data?.tpopById?.massns?.nodes ?? []

  return (
    <>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={{
          top: yearMenuAnchor.top,
          left: yearMenuAnchor.right,
        }}
        anchorOrigin={anchorOrigin}
        open={Boolean(yearMenuAnchor)}
        onClose={closeYearCellMenu}
      >
        <h5 className={styles.yearCellMenuTitle}>{yearClicked.title}</h5>
        {showEk && (
          <div>
            {yearClicked.ekPlan ?
              <MenuItem
                className={styles.menuItem}
                onClick={onClickEkEntfernen}
              >
                <ListItemIcon className={styles.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.listItemText}
                  primary="EK-Planung entfernen"
                />
              </MenuItem>
            : <MenuItem
                className={styles.menuItem}
                onClick={onClickEkPlanen}
              >
                <ListItemIcon className={styles.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.listItemText}
                  primary="EK planen"
                />
              </MenuItem>
            }
          </div>
        )}
        {showEkf && (
          <div>
            {yearClicked.ekfPlan ?
              <MenuItem
                className={styles.menuItem}
                onClick={onClickEkfEntfernen}
              >
                <ListItemIcon className={styles.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.listItemText}
                  primary="EKF-Planung entfernen"
                />
              </MenuItem>
            : <MenuItem
                className={styles.menuItem}
                onClick={onClickEkfPlanen}
              >
                <ListItemIcon className={styles.listItemIcon}>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  className={styles.listItemText}
                  primary="EKF planen"
                />
              </MenuItem>
            }
          </div>
        )}
        {showEk && !!eks.length && (
          <MenuItem
            className={styles.menuItem}
            onClick={(e) => setEksAnchor(e.currentTarget)}
            style={{
              backgroundColor:
                Boolean(eksAnchor) ? 'rgba(0, 0, 0, 0.08)' : 'unset',
            }}
          >
            <ListItemIcon className={styles.listItemIcon}>
              <ListIcon />
            </ListItemIcon>
            <ListItemText
              className={styles.listItemText}
              primary={`EK (${eks.length})`}
            />
          </MenuItem>
        )}
        {showEkf && !!ekfs.length && (
          <MenuItem
            className={styles.menuItem}
            onClick={(e) => setEkfsAnchor(e.currentTarget)}
            style={{
              backgroundColor:
                Boolean(ekfsAnchor) ? 'rgba(0, 0, 0, 0.08)' : 'unset',
            }}
          >
            <ListItemIcon className={styles.listItemIcon}>
              <ListIcon />
            </ListItemIcon>
            <ListItemText
              className={styles.listItemText}
              primary={`EKF (${ekfs.length})`}
            />
          </MenuItem>
        )}
        {showMassn && !!massns.length && (
          <MenuItem
            className={styles.menuItem}
            onClick={(e) => setMassnsAnchor(e.currentTarget)}
            style={{
              backgroundColor:
                Boolean(massnsAnchor) ? 'rgba(0, 0, 0, 0.08)' : 'unset',
            }}
          >
            <ListItemIcon className={styles.listItemIcon}>
              <ListIcon />
            </ListItemIcon>
            <ListItemText
              className={styles.listItemText}
              primary={`Ansiedlungen (${massns.length})`}
            />
          </MenuItem>
        )}
      </Menu>
      {!!eksAnchor && (
        <EksMenu
          tpop={tpop}
          eks={eks}
          eksAnchor={eksAnchor}
          closeEksMenu={closeEksMenu}
        />
      )}
      {!!ekfsAnchor && (
        <EkfsMenu
          tpop={tpop}
          ekfs={ekfs}
          ekfsAnchor={ekfsAnchor}
          closeEkfsMenu={closeEkfsMenu}
        />
      )}
      {!!massnsAnchor && (
        <MassnsMenu
          tpop={tpop}
          massns={massns}
          massnsAnchor={massnsAnchor}
          closeMassnsMenu={closeMassnsMenu}
        />
      )}
    </>
  )
}
