import React, { useCallback, useContext, useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import gql from 'graphql-tag'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient } from 'react-apollo-hooks'

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
const StyledMenuItem = styled(MenuItem)`
  min-height: 36px !important;
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
const ekplansOfTpopQuery = gql`
  query EkplansOfTpopQuery($tpopId: UUID!, $jahr: Int) {
    allEkplans(
      filter: { tpopId: { equalTo: $tpopId }, jahr: { equalTo: $jahr } }
    ) {
      nodes {
        id
        typ
      }
    }
  }
`
const deleteEkplanMutation = gql`
  mutation deleteEkplanById($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      deletedEkplanId
    }
  }
`
const tpopQuery = gql`
  query EkplanmenuTpopQuery(
    $tpopId: UUID!
    $jahr: Int
    $showEk: Boolean!
    $showEkf: Boolean!
    $showMassn: Boolean!
  ) {
    tpopById(id: $tpopId) {
      id
      ek: tpopkontrsByTpopId(
        filter: {
          jahr: { equalTo: $jahr }
          typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
        }
        orderBy: DATUM_ASC
      ) @include(if: $showEk) {
        nodes {
          id
          datum
          typ
          adresseByBearbeiter {
            id
            name
          }
          tpopkontrzaehlsByTpopkontrId {
            nodes {
              id
              einheit
              anzahl
              tpopkontrzaehlEinheitWerteByEinheit {
                id
                text
              }
              tpopkontrzaehlMethodeWerteByMethode {
                id
                text
              }
            }
          }
        }
      }
      ekf: tpopkontrsByTpopId(
        filter: {
          jahr: { equalTo: $jahr }
          typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
        }
        orderBy: DATUM_ASC
      ) @include(if: $showEkf) {
        nodes {
          id
          datum
          typ
          adresseByBearbeiter {
            id
            name
          }
          tpopkontrzaehlsByTpopkontrId {
            nodes {
              id
              einheit
              anzahl
              tpopkontrzaehlEinheitWerteByEinheit {
                id
                text
              }
              tpopkontrzaehlMethodeWerteByMethode {
                id
                text
              }
            }
          }
        }
      }
      massn: tpopmassnsByTpopId(
        filter: {
          jahr: { equalTo: $jahr }
          tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: -1 } }
        }
        orderBy: DATUM_ASC
      ) @include(if: $showMassn) {
        nodes {
          id
          datum
          tpopmassnTypWerteByTyp {
            id
            text
          }
          beschreibung
          anzTriebe
          anzPflanzen
          bemerkungen
          adresseByBearbeiter {
            id
            name
          }
        }
      }
      popByPopId {
        id
        apByApId {
          id
          projId
        }
      }
    }
  }
`

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

  const onClickEkEntfernen = useCallback(async () => removeEkPlan('EK'), [
    yearClickedState,
  ])
  const onClickEkfEntfernen = useCallback(async () => removeEkPlan('EKF'), [
    yearClickedState,
  ])
  const removeEkPlan = useCallback(
    async typ => {
      let qResult
      try {
        qResult = await client.query({
          query: ekplansOfTpopQuery,
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
          mutation: deleteEkplanMutation,
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

  const onClickEkPlanen = useCallback(async () => addEkPlan('EK'), [
    yearClickedState,
  ])
  const onClickEkfPlanen = useCallback(async () => addEkPlan('EKF'), [
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
      refetch()
      closeYearCellMenu()
    },
    [store.user.name, yearClickedState],
  )

  const { data } = useQuery(tpopQuery, {
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
