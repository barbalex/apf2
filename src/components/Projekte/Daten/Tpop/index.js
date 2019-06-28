import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import ErrorBoundary from 'react-error-boundary'

import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import query from './query'
import queryTpops from './queryTpops'
import updateTpopByIdGql from './updateTpopById'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopType } from '../../../../store/NodeFilterTree/tpop'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import Ek from './Ek'
import Tpop from './Tpop'

const Container = styled.div`
  height: ${props =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  overflow: hidden !important;
  height: 100%;
  fieldset {
    padding-right: 30px;
  }
`
const LoadingDiv = styled.div`
  padding: 10px;
`

const TpopForm = ({ treeName, showFilter = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    nodeFilter,
    nodeFilterSetValue,
    refetch,
    urlQuery,
    setUrlQuery,
  } = store

  const { activeNodeArray } = store[treeName]
  const [tab, setTab] = useState(get(urlQuery, 'tpopTab', 'tpop'))
  const onChangeTab = useCallback((event, value) => {
    setUrlQueryValue({
      key: 'tpopTab',
      value,
      urlQuery,
      setUrlQuery,
    })
    setTab(value)
  })

  let id =
    activeNodeArray.length > 7
      ? activeNodeArray[7]
      : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const apId = activeNodeArray[3]
  const { data, loading, error, refetch: refetchTpop } = useQuery(query, {
    variables: {
      id,
    },
  })
  const apJahr = get(data, 'tpopById.popByPopId.apByApId.startJahr', null)

  const allTpopsFilter = {
    popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
  }
  const tpopFilter = {
    popId: { isNull: false },
    popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
  }
  const tpopFilterValues = Object.entries(nodeFilter[treeName].tpop).filter(
    e => e[1] || e[1] === 0,
  )
  tpopFilterValues.forEach(([key, value]) => {
    const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
    tpopFilter[key] = { [expression]: value }
  })

  const { data: dataTpops } = useQuery(queryTpops, {
    variables: {
      showFilter,
      allTpopsFilter,
      tpopFilter,
      apId,
    },
  })

  let tpopTotalCount
  let tpopFilteredCount
  let tpopOfApTotalCount
  let tpopOfApFilteredCount
  let row
  if (showFilter) {
    row = nodeFilter[treeName].tpop
    tpopTotalCount = get(dataTpops, 'allTpops.totalCount', '...')
    tpopFilteredCount = get(dataTpops, 'tpopsFiltered.totalCount', '...')
    const popsOfAp = get(dataTpops, 'popsOfAp.nodes', [])
    tpopOfApTotalCount = !popsOfAp.length
      ? '...'
      : popsOfAp
          .map(p => get(p, 'tpops.totalCount'))
          .reduce((acc = 0, val) => acc + val)
    tpopOfApFilteredCount = !popsOfAp.length
      ? '...'
      : popsOfAp
          .map(p => get(p, 'tpopsFiltered.totalCount'))
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = get(data, 'tpopById', {})
  }

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const value = values[changedField]
      if (showFilter) {
        nodeFilterSetValue({
          treeName,
          table: 'tpop',
          key: changedField,
          value,
        })
      } else {
        try {
          await client.mutate({
            mutation: updateTpopByIdGql,
            variables: {
              ...objectsEmptyValuesToNull(values),
              changedBy: store.user.name,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateTpopById: {
                tpop: {
                  ...values,
                  __typename: 'Tpop',
                },
                __typename: 'Tpop',
              },
            },
          })
        } catch (error) {
          return setErrors({ [changedField]: error.message })
        }
        // update tpop on map
        if (
          (value &&
            ((changedField === 'ylv95Y' && row.lv95X) ||
              (changedField === 'lv95X' && row.y))) ||
          (!value && (changedField === 'ylv95Y' || changedField === 'lv95X'))
        ) {
          if (refetch.tpopForMap) refetch.tpopForMap()
        }
        setErrors({})
      }
    },
    [showFilter, row],
  )

  if (error) return `Fehler: ${error.message}`
  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        {showFilter ? (
          <FilterTitle
            title="Teil-Population"
            treeName={treeName}
            table="tpop"
            totalNr={tpopTotalCount}
            filteredNr={tpopFilteredCount}
            totalApNr={tpopOfApTotalCount}
            filteredApNr={tpopOfApFilteredCount}
          />
        ) : (
          <FormTitle
            apId={get(data, 'tpopById.popByPopId.apId')}
            title="Teil-Population"
            treeName={treeName}
          />
        )}
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Teil-Population" value="tpop" data-id="tpop" />
            <Tab label="EK" value="ek" data-id="ek" />
          </Tabs>
          {!showFilter && loading ? (
            <LoadingDiv>Lade...</LoadingDiv>
          ) : tab === 'tpop' ? (
            <Tpop
              treeName={treeName}
              showFilter={showFilter}
              onSubmit={onSubmit}
              row={row}
              apJahr={apJahr}
              refetchTpop={refetchTpop}
            />
          ) : (
            <Ek
              treeName={treeName}
              showFilter={showFilter}
              onSubmit={onSubmit}
              row={row}
            />
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TpopForm)
