import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import jwtDecode from 'jwt-decode'

import StringToCopy from '../../../shared/StringToCopyOnlyButton'
import query from './query'
import queryTpopkontrs from './queryTpopkontrs'
import updateTpopkontrByIdGql from './updateTpopkontrById'
import createTpopkontrzaehl from './createTpopkontrzaehl'
import Title from './Title'
import Headdata from './Headdata'
import Besttime from './Besttime'
import Date from './Date'
import Map from './Map'
import Cover from './Cover'
import More from './More'
import Danger from './Danger'
import Remarks from './Remarks'
import EkfRemarks from './EkfRemarks'
import Files from './Files'
import Count from './Count'
import Verification from './Verification'
import Image from './Image'
import FormTitle from '../../../shared/FormTitle'
import FilterTitle from '../../../shared/FilterTitle'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import { simpleTypes as tpopfreiwkontrType } from '../../../../store/NodeFilterTree/tpopfreiwkontr'

const Container = styled.div`
  height: ${props =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
  @media print {
    font-size: 11px;
    height: auto;
    width: inherit;
    margin: 0 !important;
    padding: 0.5cm !important;
    overflow: hidden;
  }
`
const InnerContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
`
const GridContainer = styled.div`
  display: grid;
  grid-template-areas: ${props => {
    const { width } = props
    if (width < 600) {
      return `
        'title'
        'image'
        'headdata'
        'besttime'
        'date'
        'map'
        'count1'
        'count2'
        'count3'
        'cover'
        'more'
        'danger'
        'remarks'
        'ekfRemarks'
        'files'
        'verification'
      `
    }
    if (width < 800) {
      return `
        'title title'
        'image image'
        'headdata headdata'
        'besttime besttime'
        'date map'
        'count1 count1'
        'count2 count2'
        'count3 count3'
        'cover cover'
        'more more'
        'danger danger'
        'remarks remarks'
        'ekfRemarks ekfRemarks'
        'files files'
        'verification verification'
      `
    }
    return `
      'title title title image image image'
      'headdata headdata headdata image image image'
      'besttime besttime besttime image image image'
      'date date map image image image'
      'count1 count1 count2 count2 count3 count3'
      'cover cover cover more more more'
      'danger danger danger danger danger danger'
      'remarks remarks remarks remarks remarks remarks'
      'ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks'
      'files files files files files files'
      'verification verification verification verification verification verification'
    `
  }};
  grid-template-columns: ${props => {
    const { width } = props
    if (width < 600) return '1fr'
    if (width < 800) return 'repeat(2, 1fr)'
    return 'repeat(6, 1fr)'
  }};
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
  box-sizing: border-box;
  border-collapse: collapse;
  @media print {
    grid-template-areas:
      'title title title image image image'
      'headdata headdata headdata image image image'
      'besttime besttime besttime image image image'
      'date date map image image image'
      'count1 count1 count2 count2 count3 count3'
      'cover cover cover more more more'
      'danger danger danger danger danger danger'
      'remarks remarks remarks remarks remarks remarks'
      'ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks';
    grid-template-columns: repeat(6, 1fr);
  }
`
const CountHint = styled.div`
  grid-area: 5 / 1 / 5 / 7;
  color: red;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
`

const Tpopfreiwkontr = ({ treeName, showFilter = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    enqueNotification,
    nodeFilter,
    nodeFilterSetValue,
    isPrint,
    view,
    user,
  } = store
  const tree = store[treeName]
  const { activeNodeArray, datenWidth, filterWidth } = tree
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  const [errors, setErrors] = useState({})

  let id =
    activeNodeArray.length > 9
      ? activeNodeArray[9]
      : '99999999-9999-9999-9999-999999999999'
  const apId = activeNodeArray[3]
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
    },
  })

  const allTpopkontrFilter = {
    typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' },
    tpopByTpopId: {
      popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
    },
  }
  const tpopkontrFilter = {
    typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' },
    tpopByTpopId: {
      popByPopId: { apByApId: { projId: { equalTo: activeNodeArray[1] } } },
    },
  }
  const tpopkontrFilterValues = Object.entries(
    nodeFilter[treeName].tpopfreiwkontr,
  ).filter(e => e[1] || e[1] === 0)
  tpopkontrFilterValues.forEach(([key, value]) => {
    const expression =
      tpopfreiwkontrType[key] === 'string' ? 'includes' : 'equalTo'
    tpopkontrFilter[key] = { [expression]: value }
  })
  const { data: dataTpopkontrs } = useQuery(queryTpopkontrs, {
    variables: {
      showFilter,
      tpopkontrFilter,
      allTpopkontrFilter,
      apId,
    },
  })

  const ekzaehleinheits = get(
    data,
    'tpopkontrById.tpopByTpopId.popByPopId.apByApId.ekzaehleinheitsByApId.nodes',
    [],
  )
    .map(n => get(n, 'tpopkontrzaehlEinheitWerteByZaehleinheitId', {}))
    // remove null values stemming from efkzaehleinheit without zaehleinheit_id
    .filter(n => n !== null)
  const zaehls = get(
    data,
    'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
    [],
  )
  const zaehls1 = zaehls[0]
  const zaehls2 = zaehls[1]
  const zaehls3 = zaehls[2]
  const zaehl1WasAttributed =
    zaehls1 && (zaehls1.anzahl || zaehls1.anzahl === 0 || zaehls1.einheit)
  const zaehl2ShowNew =
    zaehl1WasAttributed && !zaehls2 && ekzaehleinheits.length > 1
  const zaehl1ShowEmpty = ekzaehleinheits.length === 0 && zaehls.length === 0
  const zaehl2ShowEmpty =
    (!zaehl1WasAttributed && !zaehls2) || ekzaehleinheits.length < 2
  const zaehl2WasAttributed =
    zaehl1WasAttributed &&
    zaehls2 &&
    (zaehls2.anzahl || zaehls2.anzahl === 0 || zaehls2.einheit)
  const zaehl3ShowNew =
    zaehl2WasAttributed && !zaehls3 && ekzaehleinheits.length > 2
  const zaehl3ShowEmpty =
    (!zaehl2WasAttributed && !zaehls3) || ekzaehleinheits.length < 3
  const einheitsUsed = get(
    data,
    'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
    [],
  )
    .filter(n => !!n.einheit)
    .map(n => n.einheit)
  const isFreiwillig = role === 'apflora_freiwillig'

  let tpopkontrTotalCount
  let tpopkontrFilteredCount
  let tpopkontrsOfApTotalCount
  let tpopkontrsOfApFilteredCount
  let row
  if (showFilter) {
    row = nodeFilter[treeName].tpopfreiwkontr
    tpopkontrTotalCount = get(dataTpopkontrs, 'allTpopkontrs.totalCount', '...')
    tpopkontrFilteredCount = get(
      dataTpopkontrs,
      'tpopkontrsFiltered.totalCount',
      '...',
    )
    const popsOfAp = get(dataTpopkontrs, 'popsOfAp.nodes', [])
    const tpopsOfAp = flatten(popsOfAp.map(p => get(p, 'tpops.nodes', [])))
    tpopkontrsOfApTotalCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map(p => get(p, 'tpopkontrs.totalCount'))
          .reduce((acc = 0, val) => acc + val)
    tpopkontrsOfApFilteredCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map(p => get(p, 'tpopkontrsFiltered.totalCount'))
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = get(data, 'tpopkontrById', {}) || {}
  }

  const artname = get(
    row,
    'tpopByTpopId.popByPopId.apByApId.aeEigenschaftenByArtId.artname',
    '',
  )
  const pop = get(row, 'tpopByTpopId.popByPopId', {})
  const tpop = get(row, 'tpopByTpopId', {})
  const { ekfBemerkungen } = row

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)
      if (showFilter) {
        return nodeFilterSetValue({
          treeName,
          table: 'tpopfreiwkontr',
          key: field,
          value,
        })
      }
      /**
       * enable passing two values
       * with same update
       */
      const variables = {
        id: row.id,
        [field]: value,
        changedBy: user.name,
      }
      let field2
      if (field === 'datum') field2 = 'jahr'
      let value2
      if (field === 'datum') {
        // this broke 13.2.2019
        // value2 = !!value ? +format(new Date(value), 'yyyy') : null
        // value can be null so check if substring method exists
        value2 = value && value.substring ? +value.substring(0, 4) : value
      }
      if (field2) variables[field2] = value2
      try {
        await client.mutate({
          mutation: updateTpopkontrByIdGql,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrById: {
              tpopkontr: {
                id: row.id,
                typ: field === 'typ' ? value : row.typ,
                jahr:
                  field === 'jahr'
                    ? value
                    : field2 === 'jahr'
                    ? value2
                    : row.jahr,
                datum:
                  field === 'datum'
                    ? value
                    : field2 === 'datum'
                    ? value2
                    : row.datum,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                flaecheUeberprueft:
                  field === 'flaecheUeberprueft'
                    ? value
                    : row.flaecheUeberprueft,
                deckungVegetation:
                  field === 'deckungVegetation' ? value : row.deckungVegetation,
                deckungNackterBoden:
                  field === 'deckungNackterBoden'
                    ? value
                    : row.deckungNackterBoden,
                deckungApArt:
                  field === 'deckungApArt' ? value : row.deckungApArt,
                vegetationshoeheMaximum:
                  field === 'vegetationshoeheMaximum'
                    ? value
                    : row.vegetationshoeheMaximum,
                vegetationshoeheMittel:
                  field === 'vegetationshoeheMittel'
                    ? value
                    : row.vegetationshoeheMittel,
                gefaehrdung: field === 'gefaehrdung' ? value : row.gefaehrdung,
                tpopId: field === 'tpopId' ? value : row.tpopId,
                bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                planVorhanden:
                  field === 'planVorhanden' ? value : row.planVorhanden,
                jungpflanzenVorhanden:
                  field === 'jungpflanzenVorhanden'
                    ? value
                    : row.jungpflanzenVorhanden,
                apberNichtRelevant:
                  field === 'apberNichtRelevant'
                    ? value
                    : row.apberNichtRelevant,
                apberNichtRelevantGrund:
                  field === 'apberNichtRelevantGrund'
                    ? value
                    : row.apberNichtRelevantGrund,
                ekfBemerkungen:
                  field === 'ekfBemerkungen' ? value : row.ekfBemerkungen,
                tpopByTpopId: row.tpopByTpopId,
                tpopkontrzaehlsByTpopkontrId: row.tpopkontrzaehlsByTpopkontrId,
                __typename: 'Tpopkontr',
              },
              __typename: 'Tpopkontr',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
    },
    [
      showFilter,
      row.id,
      row.typ,
      row.jahr,
      row.datum,
      row.bemerkungen,
      row.flaecheUeberprueft,
      row.deckungVegetation,
      row.deckungNackterBoden,
      row.deckungApArt,
      row.vegetationshoeheMaximum,
      row.vegetationshoeheMittel,
      row.gefaehrdung,
      row.tpopId,
      row.bearbeiter,
      row.planVorhanden,
      row.jungpflanzenVorhanden,
      row.apberNichtRelevant,
      row.apberNichtRelevantGrund,
      row.ekfBemerkungen,
      row.tpopByTpopId,
      row.tpopkontrzaehlsByTpopkontrId,
      user.name,
      nodeFilterSetValue,
      treeName,
      client,
    ],
  )

  useEffect(() => {
    if (!loading) {
      // loading data just finished
      // check if tpopkontr exist
      const tpopkontrCount = get(
        data,
        'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
        [],
      ).length
      if (tpopkontrCount === 0) {
        // add counts for all ekzaehleinheit
        // BUT DANGER: only for ekzaehleinheit with zaehleinheit_id
        const ekzaehleinheits = get(
          data,
          'tpopkontrById.tpopByTpopId.popByPopId.apByApId.ekzaehleinheitsByApId.nodes',
          [],
        )
          // remove ekzaehleinheits without zaehleinheit_id
          .filter(
            z =>
              !!get(z, 'tpopkontrzaehlEinheitWerteByZaehleinheitId.code', null),
          )

        Promise.all(
          ekzaehleinheits.map(z =>
            client.mutate({
              mutation: createTpopkontrzaehl,
              variables: {
                tpopkontrId: row.id,
                einheit: get(
                  z,
                  'tpopkontrzaehlEinheitWerteByZaehleinheitId.code',
                  null,
                ),
                changedBy: user.name,
              },
            }),
          ),
        )
          .then(() => refetch())
          .catch(error =>
            enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            }),
          )
      }
    }
  }, [client, data, enqueNotification, loading, refetch, row.id, user.name])

  useEffect(() => {
    setErrors({})
  }, [row.id])

  if (error) return `Fehler: ${error.message}`
  if (loading) {
    return (
      <Container>
        <InnerContainer>Lade...</InnerContainer>
      </Container>
    )
  }
  if (Object.keys(row).length === 0) return null

  return (
    <Container showfilter={showFilter}>
      {!(view === 'ekf') && showFilter && (
        <FilterTitle
          title="Freiwilligen-Kontrollen"
          treeName={treeName}
          table="tpopfreiwkontr"
          totalNr={tpopkontrTotalCount}
          filteredNr={tpopkontrFilteredCount}
          totalApNr={tpopkontrsOfApTotalCount}
          filteredApNr={tpopkontrsOfApFilteredCount}
        />
      )}
      {!(view === 'ekf') && !showFilter && (
        <FormTitle
          apId={apId}
          title="Freiwilligen-Kontrolle"
          treeName={treeName}
        />
      )}
      <InnerContainer>
        <GridContainer width={showFilter ? filterWidth : datenWidth}>
          <Title />
          <Headdata
            pop={pop}
            tpop={tpop}
            row={row}
            showFilter={showFilter}
            treeName={treeName}
          />
          <Besttime row={row} />
          <Date saveToDb={saveToDb} row={row} errors={errors} />
          <Map
            saveToDb={saveToDb}
            row={row}
            errors={errors}
            showFilter={showFilter}
          />
          <Image apId={apId} row={row} artname={artname} />
          {!showFilter && zaehls1 && (
            <Count
              id={zaehls1.id}
              nr="1"
              saveToDb={saveToDb}
              errors={errors}
              refetch={refetch}
              einheitsUsed={einheitsUsed}
              ekzaehleinheits={ekzaehleinheits}
              treeName={treeName}
            />
          )}
          {!showFilter && zaehl1ShowEmpty && (
            <CountHint>
              Sie müssen auf Ebene Aktionsplan EK-Zähleinheiten definieren, um
              hier Zählungen erfassen zu können.
            </CountHint>
          )}
          {!showFilter && zaehls2 && (
            <Count
              id={zaehls2.id}
              nr="2"
              saveToDb={saveToDb}
              errors={errors}
              refetch={refetch}
              einheitsUsed={einheitsUsed}
              ekzaehleinheits={ekzaehleinheits}
              treeName={treeName}
            />
          )}
          {!showFilter && zaehl2ShowNew && (
            <Count
              id={null}
              tpopkontrId={row.id}
              nr="2"
              saveToDb={saveToDb}
              errors={errors}
              showNew
              einheitsUsed={einheitsUsed}
              ekzaehleinheits={ekzaehleinheits}
              refetch={refetch}
              treeName={treeName}
            />
          )}
          {!showFilter && zaehl2ShowEmpty && !zaehl1ShowEmpty && (
            <Count
              id={null}
              tpopkontrId={row.id}
              nr="2"
              showEmpty
              saveToDb={saveToDb}
              errors={errors}
              showNew
              einheitsUsed={einheitsUsed}
              ekzaehleinheits={ekzaehleinheits}
              refetch={refetch}
              treeName={treeName}
            />
          )}
          {!showFilter && zaehls3 && (
            <Count
              id={zaehls3.id}
              nr="3"
              saveToDb={saveToDb}
              errors={errors}
              refetch={refetch}
              einheitsUsed={einheitsUsed}
              ekzaehleinheits={ekzaehleinheits}
              treeName={treeName}
            />
          )}
          {!showFilter && zaehl3ShowNew && (
            <Count
              id={null}
              tpopkontrId={row.id}
              nr="3"
              saveToDb={saveToDb}
              errors={errors}
              showNew
              einheitsUsed={einheitsUsed}
              ekzaehleinheits={ekzaehleinheits}
              refetch={refetch}
              treeName={treeName}
            />
          )}
          {!showFilter && zaehl3ShowEmpty && !zaehl2ShowEmpty && (
            <Count
              id={null}
              tpopkontrId={row.id}
              nr="3"
              showEmpty
              saveToDb={saveToDb}
              errors={errors}
              showNew
              einheitsUsed={einheitsUsed}
              ekzaehleinheits={ekzaehleinheits}
              refetch={refetch}
              treeName={treeName}
            />
          )}
          <Cover saveToDb={saveToDb} row={row} errors={errors} />
          <More saveToDb={saveToDb} row={row} errors={errors} />
          <Danger saveToDb={saveToDb} row={row} errors={errors} />
          <Remarks saveToDb={saveToDb} row={row} errors={errors} />
          {((isPrint && ekfBemerkungen) || !isPrint) && (
            <EkfRemarks saveToDb={saveToDb} row={row} errors={errors} />
          )}
          {!isPrint && <Files row={row} />}
          {!isPrint && !isFreiwillig && !(view === 'ekf') && (
            <Verification saveToDb={saveToDb} row={row} errors={errors} />
          )}
        </GridContainer>
        {!showFilter && !isPrint && !isFreiwillig && !(view === 'ekf') && (
          <StringToCopy text={row.id} label="GUID" />
        )}
        {!isPrint && <div style={{ height: '64px' }} />}
      </InnerContainer>
    </Container>
  )
}

export default observer(Tpopfreiwkontr)
