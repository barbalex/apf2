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
import type { EkplanmenuTpopQueryResult } from './types.ts'

import styles from './index.module.css'

const anchorOrigin = {
  horizontal: 'right',
  vertical: 'top',
} as const

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

  const [eksAnchor, setEksAnchor] = useState<HTMLElement | null>(null)
  const [ekfsAnchor, setEkfsAnchor] = useState<HTMLElement | null>(null)
  const [massnsAnchor, setMassnsAnchor] = useState<HTMLElement | null>(null)

  const closeEksMenu = () => setEksAnchor(null)
  const closeEkfsMenu = () => setEkfsAnchor(null)
  const closeMassnsMenu = () => setMassnsAnchor(null)

  const removeEkPlan = async (typ: string) => {
    // menu actions only fire after a cell click set tpopId
    if (!tpopId) return
    let qResult:
    | {
        data?:
          | { allEkplans?: { nodes?: { id: string; typ: string }[] } }
          | undefined
      }
    | undefined
    try {
      qResult = (await apolloClient.query({
        query: queryEkplansOfTpop,
        variables: {
          tpopId,
          jahr: year,
        },
      })) as typeof qResult
    } catch (error) {
      closeYearCellMenu()
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    const id = qResult?.data?.allEkplans?.nodes?.find((o) => o?.typ === typ)?.id
    if (!id) return
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
    void tsQueryClient.invalidateQueries({
      queryKey: ['RowQueryForEkPlan'],
    })
    closeYearCellMenu()
  }

  const onClickEkEntfernen = () => removeEkPlan('EK')
  const onClickEkfEntfernen = () => removeEkPlan('EKF')

  const userName = useAtomValue(userNameAtom)

  const addEkPlan = async (typ: string) => {
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
    void tsQueryClient.invalidateQueries({
      queryKey: ['RowQueryForEkPlan'],
    })
    closeYearCellMenu()
  }

  const onClickEkPlanen = () => addEkPlan('EK')
  const onClickEkfPlanen = () => addEkPlan('EKF')

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
      return result.data
    },
    // DO NOT add suspense here, it breaks the menu display (entire ekplan form reloads)
  })
  const tpop = data?.tpopById ?? undefined
  const eks = data?.tpopById?.eks?.nodes ?? []
  const ekfs = data?.tpopById?.ekfs?.nodes ?? []
  const massns = data?.tpopById?.massns?.nodes ?? []

  return (
    <>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={{
          top: yearMenuAnchor?.top ?? 0,
          left: yearMenuAnchor?.right ?? 0,
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
                onClick={() => void onClickEkEntfernen()}
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
                onClick={() => void onClickEkPlanen()}
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
                onClick={() => void onClickEkfEntfernen()}
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
                onClick={() => void onClickEkfPlanen()}
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
                eksAnchor ? 'rgba(0, 0, 0, 0.08)' : 'unset',
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
                ekfsAnchor ? 'rgba(0, 0, 0, 0.08)' : 'unset',
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
                massnsAnchor ? 'rgba(0, 0, 0, 0.08)' : 'unset',
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
