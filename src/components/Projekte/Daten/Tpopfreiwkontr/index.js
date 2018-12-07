// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import StringToCopy from '../../../shared/StringToCopyOnlyButton'
import query from './data'
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
import Count from './Count'
import Verification from './Verification'
import Image from './Image'
import FormTitle from '../../../shared/FormTitle'
import withAllAdresses from './withAllAdresses'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
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
        'verification'
        'ekfRemarks'
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
        'verification verification'
        'ekfRemarks ekfRemarks'
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
      'verification verification verification verification verification verification'
      'ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks'
    `
  }};
  grid-template-columns: ${props => {
    const { width } = props
    if (width < 600) return '1fr'
    if (width < 800) return 'repeat(2, 1fr)'
    return 'repeat(6, 1fr)'
  }};
  grid-column-gap: 10px;
  grid-row-gap: 10px;
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
      'remarks remarks remarks remarks remarks remarks';
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

/**
 * on componentDidMount
 * check number of tpopkontrzaehl
 * if none: create new ones
 * then refetch data
 */
const enhance = compose(
  withAllAdresses,
  observer,
)

const Tpopfreiwkontr = ({
  dimensions,
  role,
  treeName,
  dataAllAdresses,
}: {
  dimensions: Object,
  role: string,
  treeName: string,
  dataAllAdresses: Object,
}) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const { addError, nodeFilter, nodeFilterSetValue, isPrint, view } = mobxStore
  const tree = mobxStore[treeName]
  const { activeNodeArray } = tree

  const [errors, setErrors] = useState({})

  const showFilter = !!nodeFilter[treeName].activeTable

  const { data, loading, error } = useQuery(query, {
    suspend: false,
    variables: {
      id:
        activeNodeArray.length > 9
          ? activeNodeArray[9]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const ekfzaehleinheits = get(
    data,
    'tpopkontrById.tpopByTpopId.popByPopId.apByApId.ekfzaehleinheitsByApId.nodes',
    [],
  )
    .map(n => get(n, 'tpopkontrzaehlEinheitWerteByZaehleinheitId', {}))
    // remove null values stemming from efkzaehleinheit without zaehleinheit_id
    .filter(n => n !== null)
  const zaehls = sortBy(
    get(data, 'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes', []),
    'einheit',
  )
  const zaehls1 = zaehls[0]
  const zaehls2 = zaehls[1]
  const zaehls3 = zaehls[2]
  const zaehl1WasAttributed =
    zaehls1 && (zaehls1.anzahl || zaehls1.anzahl === 0 || zaehls1.einheit)
  const zaehl2ShowNew =
    zaehl1WasAttributed && !zaehls2 && ekfzaehleinheits.length > 1
  const zaehl1ShowEmpty = ekfzaehleinheits.length === 0 && zaehls.length === 0
  const zaehl2ShowEmpty =
    (!zaehl1WasAttributed && !zaehls2) || ekfzaehleinheits.length < 2
  const zaehl2WasAttributed =
    zaehl1WasAttributed &&
    zaehls2 &&
    (zaehls2.anzahl || zaehls2.anzahl === 0 || zaehls2.einheit)
  const zaehl3ShowNew =
    zaehl2WasAttributed && !zaehls3 && ekfzaehleinheits.length > 2
  const zaehl3ShowEmpty =
    (!zaehl2WasAttributed && !zaehls3) || ekfzaehleinheits.length < 3
  const einheitsUsed = get(
    data,
    'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
    [],
  )
    .filter(n => !!n.einheit)
    .map(n => n.einheit)
  const isFreiwillig = role === 'apflora_freiwillig'
  const { width } = dimensions

  let row
  if (showFilter) {
    row = nodeFilter[treeName].tpopfreiwkontr
  } else {
    row = get(data, 'tpopkontrById', {})
  }

  const apId = get(row, 'tpopByTpopId.popByPopId.apId')
  const artname = get(
    row,
    'tpopByTpopId.popByPopId.apByApId.aeEigenschaftenByArtId.artname',
    '',
  )
  const ekfBeobachtungszeitpunkt = get(
    row,
    'tpopByTpopId.popByPopId.apByApId.ekfBeobachtungszeitpunkt',
    '',
  )
  const pop = get(row, 'tpopByTpopId.popByPopId', {})
  const tpop = get(row, 'tpopByTpopId', {})
  const adressenNodes = get(dataAllAdresses, 'allAdresses.nodes', [])
  const {
    bearbeiter,
    bemerkungen,
    datum,
    deckungApArt,
    deckungNackterBoden,
    ekfBemerkungen,
    ekfVerifiziert,
    flaecheUeberprueft,
    gefaehrdung,
    jungpflanzenVorhanden,
    planVorhanden,
    vegetationshoeheMaximum,
    vegetationshoeheMittel,
  } = row

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = event.target.value
      if ([undefined, ''].includes(value)) value = null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
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
        changedBy: mobxStore.user.name,
      }
      let field2
      if (field === 'datum') field2 = 'jahr'
      let value2
      if (field === 'datum') value2 = !!value ? format(value, 'YYYY') : null
      if (field2) variables[field2] = value2
      /*const adresseByBearbeiter =
      field === 'bearbeiter'
        ? row.adresseByBearbeiter
        : get(dataAllAdresses, 'allAdresses.nodes', []).find(
            r => r.id === value,
        )*/
      try {
        await client.mutate({
          mutation: updateTpopkontrByIdGql,
          variables,
          /*optimisticResponse: {
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
              adresseByBearbeiter,
              ekfVerifiziert:
                field === 'ekfVerifiziert' ? value : row.ekfVerifiziert,
              ekfBemerkungen:
                field === 'ekfBemerkungen' ? value : row.ekfBemerkungen,
              tpopByTpopId: row.tpopByTpopId,
              tpopkontrzaehlsByTpopkontrId: row.tpopkontrzaehlsByTpopkontrId,
              __typename: 'Tpopkontr',
            },
            __typename: 'Tpopkontr',
          },
        },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
    },
    [showFilter, row],
  )

  useEffect(
    () => {
      if (!loading) {
        // loading data just finished
        // check if tpopkontr exist
        const tpopkontrCount = get(
          data,
          'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
          [],
        ).length
        if (tpopkontrCount === 0) {
          // add counts for all ekfzaehleinheit
          // BUT DANGER: only for ekfzaehleinheit with zaehleinheit_id
          const ekfzaehleinheits = get(
            data,
            'tpopkontrById.tpopByTpopId.popByPopId.apByApId.ekfzaehleinheitsByApId.nodes',
            [],
          )
            // remove ekfzaehleinheits without zaehleinheit_id
            .filter(
              z =>
                !!get(
                  z,
                  'tpopkontrzaehlEinheitWerteByZaehleinheitId.code',
                  null,
                ),
            )

          Promise.all(
            ekfzaehleinheits.map(z =>
              client.mutate({
                mutation: createTpopkontrzaehl,
                variables: {
                  tpopkontrId: row.id,
                  einheit: get(
                    z,
                    'tpopkontrzaehlEinheitWerteByZaehleinheitId.code',
                    null,
                  ),
                  changedBy: mobxStore.user.name,
                },
              }),
            ),
          )
            .then(() => data.refetch())
            .catch(error => addError(error))
        }
      }
    },
    [loading],
  )

  useEffect(() => setErrors({}), [row])

  useEffect(
    () => {
      // check if adresse is choosen but no registered user exists
      if (!showFilter) {
        const userCount = get(
          row,
          'adresseByBearbeiter.usersByAdresseId.totalCount',
          0,
        )
        if (bearbeiter && !userCount && !errors.bearbeiter) {
          setErrors({
            bearbeiter:
              'Es ist kein Benutzer mit dieser Adresse verbunden. Damit dieser Benutzer Kontrollen erfassen kann, muss er ein Benutzerkonto haben, in dem obige Adresse als zugehörig erfasst wurde.',
          })
        }
      }
    },
    [showFilter, bearbeiter],
  )

  if (dataAllAdresses.error) return `Fehler: ${dataAllAdresses.error.message}`
  if (error) return `Fehler: ${error.message}`
  if (loading || dataAllAdresses.loading) {
    return (
      <Container>
        <InnerContainer>Lade...</InnerContainer>
      </Container>
    )
  }

  return (
    <Container showfilter={showFilter}>
      {!(view === 'ekf') && (
        <FormTitle
          apId={apId}
          title="Freiwilligen-Kontrolle"
          treeName={treeName}
          table="tpopfreiwkontr"
        />
      )}
      <InnerContainer>
        <GridContainer width={width}>
          <Title />
          <Headdata
            id={row.id}
            bearbeiter={bearbeiter}
            errorsBearbeiter={errors.bearbeiter}
            pop={pop}
            tpop={tpop}
            saveToDb={saveToDb}
            setErrors={setErrors}
            adressenNodes={adressenNodes}
            row={row}
            showFilter={showFilter}
          />
          <Besttime ekfBeobachtungszeitpunkt={ekfBeobachtungszeitpunkt} />
          <Date
            id={row.id}
            datum={datum}
            saveToDb={saveToDb}
            errorsDatum={errors.datum}
            row={row}
          />
          <Map
            id={row.id}
            planVorhanden={planVorhanden}
            planVorhandenErrors={errors.planVorhanden}
            saveToDb={saveToDb}
            row={row}
            showFilter={showFilter}
          />
          <Image apId={apId} row={row} artname={artname} />
          {!showFilter && zaehls1 && (
            <Count
              id={zaehls1.id}
              nr="1"
              saveToDb={saveToDb}
              errors={errors}
              refetch={data.refetch}
              einheitsUsed={einheitsUsed}
              ekfzaehleinheits={ekfzaehleinheits}
              treeName={treeName}
            />
          )}
          {!showFilter && zaehl1ShowEmpty && (
            <CountHint>
              Sie müssen auf Ebene Aktionsplan EKF-Zähleinheiten definieren, um
              hier Zählungen erfassen zu können.
            </CountHint>
          )}
          {!showFilter && zaehls2 && (
            <Count
              id={zaehls2.id}
              nr="2"
              saveToDb={saveToDb}
              errors={errors}
              refetch={data.refetch}
              einheitsUsed={einheitsUsed}
              ekfzaehleinheits={ekfzaehleinheits}
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
              ekfzaehleinheits={ekfzaehleinheits}
              refetch={data.refetch}
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
              ekfzaehleinheits={ekfzaehleinheits}
              refetch={data.refetch}
              treeName={treeName}
            />
          )}
          {!showFilter && zaehls3 && (
            <Count
              id={zaehls3.id}
              nr="3"
              saveToDb={saveToDb}
              errors={errors}
              refetch={data.refetch}
              einheitsUsed={einheitsUsed}
              ekfzaehleinheits={ekfzaehleinheits}
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
              ekfzaehleinheits={ekfzaehleinheits}
              refetch={data.refetch}
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
              ekfzaehleinheits={ekfzaehleinheits}
              refetch={data.refetch}
              treeName={treeName}
            />
          )}
          <Cover
            id={row.id}
            deckungApArt={deckungApArt}
            deckungNackterBoden={deckungNackterBoden}
            saveToDb={saveToDb}
            errorsDeckungApArt={errors.deckungApArt}
            errorsDeckungNackterBoden={errors.deckungNackterBoden}
            row={row}
          />
          <More
            id={row.id}
            flaecheUeberprueft={flaecheUeberprueft}
            errorsFlaecheUeberprueft={errors.flaecheUeberprueft}
            jungpflanzenVorhanden={jungpflanzenVorhanden}
            errorsJungpflanzenVorhanden={errors.jungpflanzenVorhanden}
            vegetationshoeheMaximum={vegetationshoeheMaximum}
            errorsVegetationshoeheMaximum={errors.vegetationshoeheMaximum}
            vegetationshoeheMittel={vegetationshoeheMittel}
            errorsVegetationshoeheMittel={errors.vegetationshoeheMittel}
            saveToDb={saveToDb}
            row={row}
          />
          <Danger
            id={row.id}
            gefaehrdung={gefaehrdung}
            errorsGefaehrdung={errors.gefaehrdung}
            saveToDb={saveToDb}
            row={row}
          />
          <Remarks
            id={row.id}
            bemerkungen={bemerkungen}
            errorsBemerkungen={errors.bemerkungen}
            saveToDb={saveToDb}
            row={row}
          />
          {!isPrint && !isFreiwillig && !(view === 'ekf') && (
            <Verification
              id={row.id}
              ekfVerifiziert={ekfVerifiziert}
              errorsEkfVerifiziert={errors.ekfVerifiziert}
              saveToDb={saveToDb}
              row={row}
            />
          )}
          {!isPrint && (
            <EkfRemarks
              id={row.id}
              ekfBemerkungen={ekfBemerkungen}
              saveToDb={saveToDb}
              errorsEkfBemerkungen={errors.ekfBemerkungen}
              row={row}
            />
          )}
        </GridContainer>
        {!showFilter && !isPrint && !isFreiwillig && !(view === 'ekf') && (
          <StringToCopy text={row.id} label="GUID" />
        )}
      </InnerContainer>
    </Container>
  )
}

export default enhance(Tpopfreiwkontr)
