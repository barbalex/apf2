import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import flatten from 'lodash/flatten'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import jwtDecode from 'jwt-decode'
import { MdPrint } from 'react-icons/md'
import IconButton from '@material-ui/core/IconButton'
import { withResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'

import StringToCopy from '../../../shared/StringToCopyOnlyButton'
import query from './query'
import queryTpopkontrs from './queryTpopkontrs'
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
import { simpleTypes as tpopfreiwkontrType } from '../../../../store/Tree/DataFilter/tpopfreiwkontr'
import {
  adresse as adresseFragment,
  pop as popFragment,
  tpop as tpopFragment,
  tpopfreiwkontr as tpopfreiwkontrFragment,
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
} from '../../../shared/fragments'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: ${(props) =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
  @media print {
    font-size: 11px;
    height: auto;
    width: inherit;
    margin: 0 !important;
    padding: 0.5cm !important;
    overflow: hidden;
    page-break-after: always;
  }
`
const LoadingContainer = styled.div`
  height: calc(100vh - 64px);
  padding: 10px;
`
const ScrollContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const FormContainer = styled.div`
  padding: 10px;
  width: 100%;
`
const GridContainer = styled.div`
  display: grid;
  grid-template-areas: ${(props) => {
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
  grid-template-columns: ${(props) => {
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
const StyledIconButton = styled(IconButton)`
  color: white !important;
  margin-right: 10px !important;
`

const fieldTypes = {
  typ: 'String',
  datum: 'Date',
  jahr: 'Int',
  bemerkungen: 'String',
  flaecheUeberprueft: 'Int',
  deckungVegetation: 'Int',
  deckungNackterBoden: 'Int',
  deckungApArt: 'Int',
  vegetationshoeheMaximum: 'Int',
  vegetationshoeheMittel: 'Int',
  gefaehrdung: 'String',
  tpopId: 'UUID',
  bearbeiter: 'UUID',
  planVorhanden: 'Boolean',
  jungpflanzenVorhanden: 'Boolean',
  apberNichtRelevant: 'Boolean',
  apberNichtRelevantGrund: 'String',
  ekfBemerkungen: 'String',
}

const Tpopfreiwkontr = ({
  treeName,
  showFilter = false,
  id: idPassed,
  width = 1000,
}) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    enqueNotification,
    dataFilterSetValue,
    isPrint,
    setIsPrint,
    view,
    user,
  } = store
  const tree = store[treeName]
  const { activeNodeArray, dataFilter } = tree
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  const [errors, setErrors] = useState({})

  let id = idPassed
    ? idPassed
    : activeNodeArray.length > 9
    ? activeNodeArray[9]
    : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
    },
  })
  // DO NOT fetch apId from activeNodeArray because this form is also used for mass prints
  //const apId = activeNodeArray[3]
  const apId =
    get(data, 'tpopkontrById.tpopByTpopId.popByPopId.apId') ||
    '99999999-9999-9999-9999-999999999999'

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
    dataFilter.tpopfreiwkontr,
  ).filter((e) => e[1] || e[1] === 0)
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

  const ekzaehleinheitsOriginal = get(
    data,
    'tpopkontrById.tpopByTpopId.popByPopId.apByApId.ekzaehleinheitsByApId.nodes',
    [],
  )
  const ekzaehleinheits = ekzaehleinheitsOriginal
    .map((n) => get(n, 'tpopkontrzaehlEinheitWerteByZaehleinheitId', {}))
    // remove null values stemming from efkzaehleinheit without zaehleinheit_id
    .filter((n) => n !== null)
  const zaehls = get(
    data,
    'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
    [],
  )
  const zaehlsSorted = sortBy(zaehls, (z) => {
    const ekzaehleinheitOriginal = ekzaehleinheitsOriginal.find(
      (e) => e.tpopkontrzaehlEinheitWerteByZaehleinheitId.code === z.einheit,
    )
    if (!ekzaehleinheitOriginal) return 999
    return ekzaehleinheitOriginal.sort || 999
  })
  const zaehls1 = zaehlsSorted[0]
  const zaehls2 = zaehlsSorted[1]
  const zaehls3 = zaehlsSorted[2]
  const zaehl1WasAttributed =
    zaehls1 && (zaehls1.anzahl || zaehls1.anzahl === 0 || zaehls1.einheit)
  const zaehl2ShowNew =
    zaehl1WasAttributed && !zaehls2 && ekzaehleinheits.length > 1
  const zaehl1ShowEmpty =
    ekzaehleinheits.length === 0 && zaehlsSorted.length === 0
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
  const einheitsUsed = zaehlsSorted
    .filter((n) => !!n.einheit)
    .map((n) => n.einheit)
  const isFreiwillig = role === 'apflora_freiwillig'

  let tpopkontrTotalCount
  let tpopkontrFilteredCount
  let tpopkontrsOfApTotalCount
  let tpopkontrsOfApFilteredCount
  let row
  if (showFilter) {
    row = dataFilter.tpopfreiwkontr
    tpopkontrTotalCount = get(dataTpopkontrs, 'allTpopkontrs.totalCount', '...')
    tpopkontrFilteredCount = get(
      dataTpopkontrs,
      'tpopkontrsFiltered.totalCount',
      '...',
    )
    const popsOfAp = get(dataTpopkontrs, 'popsOfAp.nodes', [])
    const tpopsOfAp = flatten(popsOfAp.map((p) => get(p, 'tpops.nodes', [])))
    tpopkontrsOfApTotalCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => get(p, 'tpopkontrs.totalCount'))
          .reduce((acc = 0, val) => acc + val)
    tpopkontrsOfApFilteredCount = !tpopsOfAp.length
      ? '...'
      : tpopsOfAp
          .map((p) => get(p, 'tpopkontrsFiltered.totalCount'))
          .reduce((acc = 0, val) => acc + val)
  } else {
    row = get(data, 'tpopkontrById', {}) || {}
  }

  const artname = get(
    row,
    'tpopByTpopId.popByPopId.apByApId.aeTaxonomyByArtId.artname',
    '',
  )
  const pop = get(row, 'tpopByTpopId.popByPopId', {})
  const tpop = get(row, 'tpopByTpopId', {})
  const { ekfBemerkungen } = row

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)
      if (showFilter) {
        return dataFilterSetValue({
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
          mutation: gql`
            mutation updateTpopkontrForEkf(
              $id: UUID!
                $${field}: ${fieldTypes[field]}
                ${field === 'jahr' ? '$datum: Date' : ''}
                ${field === 'datum' ? '$jahr: Int' : ''}
              $changedBy: String
            ) {
              updateTpopkontrById(
                input: {
                  id: $id
                  tpopkontrPatch: {
                      ${field}: $${field}
                      ${field === 'jahr' ? 'datum: $datum' : ''}
                      ${field === 'datum' ? 'jahr: $jahr' : ''}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopkontr {
                  ...TpopfreiwkontrFields
                  adresseByBearbeiter {
                    ...AdresseFields
                    usersByAdresseId {
                      totalCount
                    }
                  }
                  tpopByTpopId {
                    ...TpopFields
                    popByPopId {
                      ...PopFields
                      apByApId {
                        id
                        ekzaehleinheitsByApId {
                          nodes {
                            id
                            tpopkontrzaehlEinheitWerteByZaehleinheitId {
                              ...TpopkontrzaehlEinheitWerteFields
                            }
                          }
                        }
                      }
                    }
                  }
                  tpopkontrzaehlsByTpopkontrId {
                    nodes {
                      id
                      anzahl
                      einheit
                    }
                  }
                }
              }
            }
            ${adresseFragment}
            ${popFragment}
            ${tpopFragment}
            ${tpopfreiwkontrFragment}
            ${tpopkontrzaehlEinheitWerteFragment}
          `,
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
      dataFilterSetValue,
      treeName,
      client,
    ],
  )

  useEffect(() => {
    if (!loading) {
      // loading data just finished
      // check if tpopkontr exist
      const tpopkontrCount = zaehls.length
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
            (z) =>
              !!get(z, 'tpopkontrzaehlEinheitWerteByZaehleinheitId.code', null),
          )

        Promise.all(
          ekzaehleinheits.map((z) =>
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
          .catch((error) =>
            enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            }),
          )
      }
    }
  }, [
    client,
    data,
    enqueNotification,
    loading,
    refetch,
    row.id,
    user.name,
    zaehls.length,
  ])

  useEffect(() => {
    setErrors({})
  }, [row.id])

  const onClickPrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsPrint(true)
      setTimeout(() => {
        window.print()
        setIsPrint(false)
      })
    }
  }, [setIsPrint])

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (loading) return <LoadingContainer>Lade...</LoadingContainer>
  if (error) return <Error error={error} />
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
          setFormTitleHeight={setFormTitleHeight}
        />
      )}
      {!(view === 'ekf') && !showFilter && (
        <FormTitle
          apId={apId}
          title="Freiwilligen-Kontrolle"
          treeName={treeName}
          setFormTitleHeight={setFormTitleHeight}
          buttons={
            <>
              <StyledIconButton onClick={onClickPrint} title="drucken">
                <MdPrint />
              </StyledIconButton>
            </>
          }
        />
      )}
      <ScrollContainer data-form-title-height={formTitleHeight}>
        <SimpleBar
          style={{
            maxHeight: '100%',
            height: '100%',
          }}
        >
          <FormContainer>
            <GridContainer width={width}>
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
              {!showFilter && (
                <>
                  <Image key={apId} apId={apId} artname={artname} />
                  {zaehls1 && (
                    <Count
                      key={zaehls1.id}
                      id={zaehls1.id}
                      tpopkontrId={row.id}
                      nr="1"
                      refetch={refetch}
                      einheitsUsed={einheitsUsed}
                      ekzaehleinheits={ekzaehleinheits}
                      ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                      treeName={treeName}
                    />
                  )}
                  {zaehl1ShowEmpty && (
                    <CountHint>
                      Sie müssen auf Ebene Aktionsplan EK-Zähleinheiten
                      definieren, um hier Zählungen erfassen zu können.
                    </CountHint>
                  )}
                  {zaehls2 && (
                    <Count
                      key={zaehls2.id}
                      id={zaehls2.id}
                      tpopkontrId={row.id}
                      nr="2"
                      refetch={refetch}
                      einheitsUsed={einheitsUsed}
                      ekzaehleinheits={ekzaehleinheits}
                      ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                      treeName={treeName}
                    />
                  )}
                  {zaehl2ShowNew && (
                    <Count
                      id={null}
                      tpopkontrId={row.id}
                      nr="2"
                      showNew
                      refetch={refetch}
                      einheitsUsed={einheitsUsed}
                      ekzaehleinheits={ekzaehleinheits}
                      ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                      treeName={treeName}
                    />
                  )}
                  {zaehl2ShowEmpty && !zaehl1ShowEmpty && (
                    <Count
                      id={null}
                      tpopkontrId={row.id}
                      nr="2"
                      showEmpty
                      showNew
                      refetch={refetch}
                      einheitsUsed={einheitsUsed}
                      ekzaehleinheits={ekzaehleinheits}
                      ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                      treeName={treeName}
                    />
                  )}
                  {zaehls3 && (
                    <Count
                      key={zaehls3.id}
                      id={zaehls3.id}
                      tpopkontrId={row.id}
                      nr="3"
                      refetch={refetch}
                      einheitsUsed={einheitsUsed}
                      ekzaehleinheits={ekzaehleinheits}
                      ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                      treeName={treeName}
                    />
                  )}
                  {zaehl3ShowNew && (
                    <Count
                      id={null}
                      tpopkontrId={row.id}
                      nr="3"
                      showNew
                      refetch={refetch}
                      einheitsUsed={einheitsUsed}
                      ekzaehleinheits={ekzaehleinheits}
                      ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                      treeName={treeName}
                    />
                  )}
                  {zaehl3ShowEmpty && !zaehl2ShowEmpty && (
                    <Count
                      id={null}
                      tpopkontrId={row.id}
                      nr="3"
                      showEmpty
                      showNew
                      refetch={refetch}
                      einheitsUsed={einheitsUsed}
                      ekzaehleinheits={ekzaehleinheits}
                      ekzaehleinheitsOriginal={ekzaehleinheitsOriginal}
                      treeName={treeName}
                    />
                  )}
                </>
              )}
              <Cover saveToDb={saveToDb} row={row} errors={errors} />
              <More saveToDb={saveToDb} row={row} errors={errors} />
              <Danger saveToDb={saveToDb} row={row} errors={errors} />
              <Remarks saveToDb={saveToDb} row={row} errors={errors} />
              {((isPrint && ekfBemerkungen) || !isPrint) && (
                <EkfRemarks saveToDb={saveToDb} row={row} errors={errors} />
              )}
              {!isPrint && !showFilter && <Files row={row} />}
              {!isPrint && !isFreiwillig && !(view === 'ekf') && (
                <Verification saveToDb={saveToDb} row={row} errors={errors} />
              )}
            </GridContainer>
            {!showFilter && !isPrint && !isFreiwillig && !(view === 'ekf') && (
              <StringToCopy text={row.id} label="GUID" />
            )}
            {!isPrint && <div style={{ height: '64px' }} />}
          </FormContainer>
        </SimpleBar>
      </ScrollContainer>
    </Container>
  )
}

export default withResizeDetector(observer(Tpopfreiwkontr))
