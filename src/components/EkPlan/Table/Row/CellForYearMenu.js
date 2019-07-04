import React, { useCallback, useContext } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import { ekplan } from '../../../shared/fragments'
import storeContext from '../../../../storeContext'

const YearCellMenuTitle = styled.h5`
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: grey;
`
const anchorOrigin = { horizontal: 'right', vertical: 'bottom' }

const createEkplanMutation = gql`
  mutation createEkplan(
    $tpopId: UUID
    $jahr: Int
    $typ: EkType
    $changedBy: String
  ) {
    createEkplan(
      input: {
        ekplan: {
          tpopId: $tpopId
          jahr: $jahr
          typ: $typ
          changedBy: $changedBy
        }
      }
    ) {
      ekplan {
        ...EkplanFields
      }
    }
  }
  ${ekplan}
`

const CellForYearMenu = ({
  yearMenuAnchor,
  yearClickedState,
  closeYearCellMenu,
}) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { year, tpopId, tpop, ekPlan, ekfPlan } = yearClickedState
  const variables = {
    tpopId,
    jahr: year,
    typ: 'EK',
    changedBy: store.user.name,
  }
  const onClickEkPlanen = useCallback(async () => planen('EK'), [])
  const onClickEkfPlanen = useCallback(async () => planen('EKF'), [])
  const planen = useCallback(
    async typ => {
      const variables = {
        tpopId,
        jahr: year,
        typ,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: createEkplanMutation,
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
      closeYearCellMenu()
    },
    [yearClickedState],
  )

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
        <MenuItem
          onClick={() => {
            console.log('TODO')
            closeYearCellMenu()
          }}
        >
          EK-Planung entfernen
        </MenuItem>
      ) : (
        <MenuItem onClick={onClickEkPlanen}>EK planen</MenuItem>
      )}
      {yearClickedState.ekfPlan ? (
        <MenuItem
          onClick={() => {
            console.log('TODO')
            closeYearCellMenu()
          }}
        >
          EKF-Planung entfernen
        </MenuItem>
      ) : (
        <MenuItem onClick={onClickEkfPlanen}>EKF planen</MenuItem>
      )}
    </Menu>
  )
}

export default observer(CellForYearMenu)
