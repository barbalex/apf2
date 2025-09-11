import { memo, useCallback, useContext, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { MdEdit as EditIcon, MdViewList as ListIcon } from 'react-icons/md'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from "@apollo/client/react";

import { MobxContext } from '../../../../mobxContext.js'
import { queryTpop } from './queryTpop.js'
import { queryEkplansOfTpop } from './queryEkplansOfTpop.js'
import { mutationCreateEkplan } from './mutationCreateEkplan.js'
import { mutationDeleteEkplan } from './mutationDeleteEkplan.js'

import { EksMenu } from './EksMenu/index.jsx'
import { EkfsMenu } from './EkfsMenu/index.jsx'
import { MassnsMenu } from './MassnsMenu/index.jsx'

const YearCellMenuTitle = styled.h5`
  margin-top: 0;
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: grey;
`
export const StyledMenuItem = styled(MenuItem)`
  min-height: 17px !important;
  line-height: 1rem !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  background-color: ${(props) =>
    props.active === 'true' ? 'rgba(0, 0, 0, 0.08) !important' : 'unset'};
`
const StyledListItemText = styled(ListItemText)`
  span {
    font-size: 0.85rem !important;
  }
`
const StyledListItemIcon = styled(ListItemIcon)`
  min-width: 36px !important;
`

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

export const CellForYearMenu = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const client = useApolloClient()
    const {
      showEk,
      showEkf,
      showMassn,
      yearClicked,
      yearMenuAnchor,
      closeYearCellMenu,
    } = store.ekPlan
    const { year, tpopId } = yearClicked

    const [eksAnchor, setEksAnchor] = useState(null)
    const [ekfsAnchor, setEkfsAnchor] = useState(null)
    const [massnsAnchor, setMassnsAnchor] = useState(null)

    const closeEksMenu = useCallback(() => setEksAnchor(null), [])
    const closeEkfsMenu = useCallback(() => setEkfsAnchor(null), [])
    const closeMassnsMenu = useCallback(() => setMassnsAnchor(null), [])

    const removeEkPlan = useCallback(
      async (typ) => {
        let qResult
        try {
          qResult = await client.query({
            query: queryEkplansOfTpop,
            variables: {
              tpopId,
              jahr: year,
            },
          })
        } catch (error) {
          closeYearCellMenu()
          return store.enqueNotification({
            message: error.message,
            options: {
              variant: 'error',
            },
          })
        }
        const id = qResult.data.allEkplans.nodes.find((o) => o.typ === typ).id
        try {
          await client.mutate({
            mutation: mutationDeleteEkplan,
            variables: {
              id,
            },
            refetchQueries: ['RowQueryForEkPlan'],
          })
        } catch (error) {
          store.enqueNotification({
            message: error.message,
            options: {
              variant: 'error',
            },
          })
        }
        closeYearCellMenu()
      },
      [client, closeYearCellMenu, store, tpopId, year],
    )
    const onClickEkEntfernen = useCallback(
      () => removeEkPlan('EK'),
      [removeEkPlan],
    )
    const onClickEkfEntfernen = useCallback(
      () => removeEkPlan('EKF'),
      [removeEkPlan],
    )

    const addEkPlan = useCallback(
      async (typ) => {
        const variables = {
          tpopId,
          jahr: year,
          typ,
          changedBy: store.user.name,
        }
        try {
          await client.mutate({
            mutation: mutationCreateEkplan,
            variables,
            refetchQueries: ['RowQueryForEkPlan'],
          })
        } catch (error) {
          store.enqueNotification({
            message: error.message,
            options: {
              variant: 'error',
            },
          })
        }
        closeYearCellMenu()
      },
      [client, closeYearCellMenu, store, tpopId, year],
    )
    const onClickEkPlanen = useCallback(() => addEkPlan('EK'), [addEkPlan])
    const onClickEkfPlanen = useCallback(() => addEkPlan('EKF'), [addEkPlan])

    const { data } = useQuery(queryTpop, {
      variables: {
        tpopId,
        jahr: year,
        showEk,
        showEkf,
        showMassn,
      },
    })
    const tpop = data?.tpopById ?? {}
    const eks = data?.tpopById?.eks?.nodes ?? []
    const ekfs = data?.tpopById?.ekfs?.nodes ?? []
    const massns = data?.tpopById?.massns?.nodes ?? []

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
          <YearCellMenuTitle>{yearClicked.title}</YearCellMenuTitle>
          {showEk && (
            <div>
              {yearClicked.ekPlan ? (
                <StyledMenuItem onClick={onClickEkEntfernen}>
                  <StyledListItemIcon>
                    <EditIcon />
                  </StyledListItemIcon>
                  <StyledListItemText primary="EK-Planung entfernen" />
                </StyledMenuItem>
              ) : (
                <StyledMenuItem onClick={onClickEkPlanen}>
                  <StyledListItemIcon>
                    <EditIcon />
                  </StyledListItemIcon>
                  <StyledListItemText primary="EK planen" />
                </StyledMenuItem>
              )}
            </div>
          )}
          {showEkf && (
            <div>
              {yearClicked.ekfPlan ? (
                <StyledMenuItem onClick={onClickEkfEntfernen}>
                  <StyledListItemIcon>
                    <EditIcon />
                  </StyledListItemIcon>
                  <StyledListItemText primary="EKF-Planung entfernen" />
                </StyledMenuItem>
              ) : (
                <StyledMenuItem onClick={onClickEkfPlanen}>
                  <StyledListItemIcon>
                    <EditIcon />
                  </StyledListItemIcon>
                  <StyledListItemText primary="EKF planen" />
                </StyledMenuItem>
              )}
            </div>
          )}
          {showEk && !!eks.length && (
            <StyledMenuItem
              onClick={(e) => setEksAnchor(e.currentTarget)}
              active={Boolean(eksAnchor).toString()}
            >
              <StyledListItemIcon>
                <ListIcon />
              </StyledListItemIcon>
              <StyledListItemText primary={`EK (${eks.length})`} />
            </StyledMenuItem>
          )}
          {showEkf && !!ekfs.length && (
            <StyledMenuItem
              onClick={(e) => setEkfsAnchor(e.currentTarget)}
              active={Boolean(ekfsAnchor).toString()}
            >
              <StyledListItemIcon>
                <ListIcon />
              </StyledListItemIcon>
              <StyledListItemText primary={`EKF (${ekfs.length})`} />
            </StyledMenuItem>
          )}
          {showMassn && !!massns.length && (
            <StyledMenuItem
              onClick={(e) => setMassnsAnchor(e.currentTarget)}
              active={Boolean(massnsAnchor).toString()}
            >
              <StyledListItemIcon>
                <ListIcon />
              </StyledListItemIcon>
              <StyledListItemText primary={`Ansiedlungen (${massns.length})`} />
            </StyledMenuItem>
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
  }),
)
