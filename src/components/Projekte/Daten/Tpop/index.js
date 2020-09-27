import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import query from './query'
import queryTpops from './queryTpops'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import { simpleTypes as tpopType } from '../../../../store/Tree/DataFilter/tpop'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import Ek from './Ek'
import Tpop from './Tpop'
import Files from '../../../shared/Files'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import {
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments'

const Container = styled.div`
  height: ${(props) =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
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
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const FilesContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
`

const fieldTypes = {
  popId: 'UUID',
  nr: 'Int',
  gemeinde: 'String',
  flurname: 'String',
  geomPoint: 'GeoJSON',
  radius: 'Int',
  hoehe: 'Int',
  exposition: 'String',
  klima: 'String',
  neigung: 'String',
  beschreibung: 'String',
  katasterNr: 'String',
  status: 'Int',
  statusUnklarGrund: 'String',
  apberRelevant: 'Boolean',
  apberRelevantGrund: 'Int',
  bekanntSeit: 'Int',
  eigentuemer: 'String',
  kontakt: 'String',
  nutzungszone: 'String',
  bewirtschafter: 'String',
  bewirtschaftung: 'String',
  ekfrequenz: 'UUID',
  ekfrequenzAbweichend: 'Boolean',
  ekfKontrolleur: 'UUID',
  ekfrequenzStartjahr: 'Int',
  bemerkungen: 'String',
  statusUnklar: 'Boolean',
}

const TpopForm = ({ treeName, showFilter = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { dataFilterSetValue, refetch, urlQuery, setUrlQuery } = store

  const { activeNodeArray, dataFilter, datenWidth } = store[treeName]
  const [tab, setTab] = useState(get(urlQuery, 'tpopTab', 'tpop'))
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'tpopTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

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
  const tpopFilterValues = Object.entries(dataFilter.tpop).filter(
    (e) => e[1] || e[1] === 0,
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
    row = dataFilter.tpop
    tpopTotalCount = get(dataTpops, 'allTpops.totalCount', '...')
    tpopFilteredCount = get(dataTpops, 'tpopsFiltered.totalCount', '...')
    const popsOfAp = get(dataTpops, 'popsOfAp.nodes', [])
    tpopOfApTotalCount = !popsOfAp.length
      ? '...'
      : popsOfAp
          .map((p) => get(p, 'tpops.totalCount'))
          .reduce((acc = 0, val) => acc + val)
    tpopOfApFilteredCount = !popsOfAp.length
      ? '...'
      : popsOfAp
          .map((p) => get(p, 'tpopsFiltered.totalCount'))
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = get(data, 'tpopById', {})
  }

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // when GeomPoint is changed, Coordinates takes over
      // need to return
      if (changedField === null) return

      const value = values[changedField]
      if (showFilter) {
        return dataFilterSetValue({
          treeName,
          table: 'tpop',
          key: changedField,
          value,
        })
      } else {
        let geomPoint = get(values, 'geomPoint.geojson') || null
        if (geomPoint) {
          geomPoint = JSON.parse(geomPoint)
          // need to add crs otherwise PostGIS v2.5 (on server) errors
          geomPoint.crs = {
            type: 'name',
            properties: {
              name: 'urn:ogc:def:crs:EPSG::4326',
            },
          }
        }
        const variables = {
          ...objectsEmptyValuesToNull(values),
          // need to pass geomPoint as GeoJSON
          geomPoint,
          changedBy: store.user.name,
        }
        try {
          await client.mutate({
            mutation: gql`
              mutation updateTpop(
                $id: UUID!
                $${changedField}: ${fieldTypes[changedField]}
                $changedBy: String
              ) {
                updateTpopById(
                  input: {
                    id: $id
                    tpopPatch: {
                      ${changedField}: $${changedField}
                      changedBy: $changedBy
                    }
                  }
                ) {
                  tpop {
                    ...TpopFields
                    popStatusWerteByStatus {
                      ...PopStatusWerteFields
                    }
                    tpopApberrelevantGrundWerteByApberRelevantGrund {
                      ...TpopApberrelevantGrundWerteFields
                    }
                    popByPopId {
                      id
                      apId
                    }
                  }
                }
              }
              ${popStatusWerte}
              ${tpop}
              ${tpopApberrelevantGrundWerte}
            `,
            variables,
            // no optimistic responce as geomPoint
            /*optimisticResponse: {
              __typename: 'Mutation',
              updateTpopById: {
                tpop: {
                  ...variables,
                  // need to pass geomPoint with its typename
                  //geomPoint: values.geomPoint,
                  geomPoint: JSON.stringify({
                    ...values.geomPoint,
                    geojson: {
                      ...geomPoint,
                      crs: {
                        type: 'name',
                        properties: {
                          name: 'urn:ogc:def:crs:EPSG::4326',
                        },
                      },
                    },
                  }),
                  __typename: 'Tpop',
                },
                __typename: 'Tpop',
              },
            },*/
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
          if (refetch.tpopForMap) {
            // need to also refetch pop in case pop was new
            refetch.popForMap && refetch.popForMap()
            refetch.tpopForMap()
          }
        }
        setErrors({})
      }
    },
    [
      row,
      showFilter,
      dataFilterSetValue,
      treeName,
      client,
      store.user.name,
      refetch,
    ],
  )

  if (error) return `Fehler beim Laden der Daten: ${error.message}`
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
            <StyledTab label="Teil-Population" value="tpop" data-id="tpop" />
            <StyledTab label="EK" value="ek" data-id="ek" />
            {!showFilter && (
              <StyledTab label="Dateien" value="dateien" data-id="dateien" />
            )}
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
          ) : tab === 'ek' ? (
            <Ek
              treeName={treeName}
              showFilter={showFilter}
              onSubmit={onSubmit}
              row={row}
            />
          ) : (
            <FilesContainer data-width={datenWidth}>
              <Files parentId={row.id} parent="tpop" />
            </FilesContainer>
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TpopForm)
