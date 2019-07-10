import React, { useCallback, useContext, useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient } from 'react-apollo-hooks'

import storeContext from '../../../../../storeContext'
import queryTpop from './queryTpop'
import queryEkplansOfTpop from './queryEkplansOfTpop'
import mutationCreateEkplan from './mutationCreateEkplan'
import mutationDeleteEkplan from './mutationDeleteEkplan'

const YearCellMenuTitle = styled.h5`
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: grey;
`
export const StyledMenuItem = styled(MenuItem)`
  min-height: 36px !important;
`

const anchorOrigin = { horizontal: 'right', vertical: 'bottom' }

const CellForYearMenu = ({
  yearMenuAnchor,
  yearClickedState,
  closeYearCellMenu,
  refetch,
}) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { year, tpopId } = yearClickedState
  const { showEk, showEkf, showMassn } = store.ekPlan

  const [eksAnchor, setEksAnchor] = useState(null)
  const [ekfsAnchor, setEkfsAnchor] = useState(null)
  const [massnsAnchor, setMassnsAnchor] = useState(null)

  const onClickEkEntfernen = useCallback(() => removeEkPlan('EK'), [
    yearClickedState,
  ])
  const onClickEkfEntfernen = useCallback(() => removeEkPlan('EKF'), [
    yearClickedState,
  ])
  const removeEkPlan = useCallback(
    async typ => {
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
      const id = qResult.data.allEkplans.nodes.find(o => o.typ === typ).id
      try {
        await client.mutate({
          mutation: mutationDeleteEkplan,
          variables: {
            id,
          },
        })
      } catch (error) {
        store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      refetch()
      closeYearCellMenu()
    },
    [yearClickedState],
  )

  const onClickEkPlanen = useCallback(() => addEkPlan('EK'), [yearClickedState])
  const onClickEkfPlanen = useCallback(() => addEkPlan('EKF'), [
    yearClickedState,
  ])
  const addEkPlan = useCallback(
    async typ => {
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
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopById: {
              tpop: variables,
              __typename: 'Tpop',
            },
          },
        })
      } catch (error) {
        store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      refetch()
      closeYearCellMenu()
    },
    [store.user.name, yearClickedState],
  )

  const { data } = useQuery(queryTpop, {
    variables: {
      tpopId,
      jahr: year,
      showEk,
      showEkf,
      showMassn,
    },
  })
  const eks = get(data, 'tpopById.ek.nodes', [])
  const ekfs = get(data, 'tpopById.ekf.nodes', [])
  const massns = get(data, 'tpopById.massn.nodes', [])

  return (
    <Menu
      id="yearCellMenu"
      anchorEl={yearMenuAnchor}
      keepMounted
      open={Boolean(yearMenuAnchor)}
      onClose={closeYearCellMenu}
      anchorOrigin={anchorOrigin}
    >
      <YearCellMenuTitle>{`${yearClickedState.tpop}, ${yearClickedState.year}`}</YearCellMenuTitle>
      {yearClickedState.ekPlan ? (
        <StyledMenuItem onClick={onClickEkEntfernen}>
          EK-Planung entfernen
        </StyledMenuItem>
      ) : (
        <StyledMenuItem onClick={onClickEkPlanen}>EK planen</StyledMenuItem>
      )}
      {yearClickedState.ekfPlan ? (
        <StyledMenuItem onClick={onClickEkfEntfernen}>
          EKF-Planung entfernen
        </StyledMenuItem>
      ) : (
        <StyledMenuItem onClick={onClickEkfPlanen}>EKF planen</StyledMenuItem>
      )}
      {!!eks.length && (
        <StyledMenuItem
          onClick={e => setEksAnchor(e.currentTarget)}
        >{`EK (${eks.length})`}</StyledMenuItem>
      )}
      {!!ekfs.length && (
        <StyledMenuItem
          onClick={e => setEkfsAnchor(e.currentTarget)}
        >{`EKF (${ekfs.length})`}</StyledMenuItem>
      )}
      {!!massns.length && (
        <StyledMenuItem
          onClick={e => setMassnsAnchor(e.currentTarget)}
        >{`Ansiedlungen (${massns.length})`}</StyledMenuItem>
      )}
    </Menu>
  )
}

export default observer(CellForYearMenu)
