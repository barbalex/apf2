// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import app from 'ampersand-app'
import format from 'date-fns/format'

import StringToCopy from '../../../shared/StringToCopyOnlyButton'
import dataGql from './data'
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
import withNodeFilter from '../../../../state/withNodeFilter'
import FormTitle from '../../../shared/FormTitle'
import withAllAdresses from './withAllAdresses'

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
  withNodeFilter,
  dataGql,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({
      setErrors,
      errors,
      data,
      nodeFilterState,
      treeName,
      dataAllAdresses,
    }) => async event => {
      const field = event.target.name
      let value = event.target.value
      if (value === undefined) value = null
      const showFilter = !!nodeFilterState.state[treeName].activeTable
      let row
      if (showFilter) {
        row = nodeFilterState.state[treeName].tpopfreiwkontr
      } else {
        row = get(data, 'tpopkontrById', {})
      }
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      if (showFilter) {
        return nodeFilterState.setValue({
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
        await app.client.mutate({
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
  }),
  withLifecycle({
    async onDidUpdate(prevProps, props) {
      if (prevProps.data.loading && !props.data.loading) {
        // loading data just finished
        // check if tpopkontr exist
        const tpopkontrCount = get(
          props.data,
          'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
          [],
        ).length
        if (tpopkontrCount === 0) {
          // add counts for all ekfzaehleinheit
          // BUT DANGER: only for ekfzaehleinheit with zaehleinheit_id
          const ekfzaehleinheits = get(
            props.data,
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
          try {
            await Promise.all(
              ekfzaehleinheits.map(z =>
                app.client.mutate({
                  mutation: createTpopkontrzaehl,
                  variables: {
                    tpopkontrId: props.id,
                    einheit: get(
                      z,
                      'tpopkontrzaehlEinheitWerteByZaehleinheitId.code',
                      null,
                    ),
                  },
                }),
              ),
            )
          } catch (error) {
            props.errorState.add(error)
          }
          props.data.refetch()
        }
      }
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
      // check if adresse is choosen but no registered user exists
      const { data, setErrors, errors, nodeFilterState, treeName } = props

      const showFilter = !!nodeFilterState.state[treeName].activeTable
      let row
      if (!showFilter) {
        row = get(data, 'tpopkontrById', {})
        const bearbeiter = get(row, 'bearbeiter')
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
  }),
)

const Tpopfreiwkontr = ({
  // pass in fake id to avoid error when filter is shown
  // which means there is no id
  id = '99999999-9999-9999-9999-999999999999',
  data,
  dimensions,
  saveToDb,
  errors,
  setErrors,
  activeNodeArray,
  role,
  nodeFilterState,
  treeName,
  dataAllAdresses,
}: {
  id: string,
  data: Object,
  dimensions: Object,
  saveToDb: () => void,
  errors: Object,
  setErrors: () => void,
  activeNodeArray: Array<string>,
  role: string,
  nodeFilterState: Object,
  treeName: string,
  dataAllAdresses: Object,
}) => {
  if (dataAllAdresses.error) return `Fehler: ${dataAllAdresses.error.message}`
  if (data.error) return `Fehler: ${data.error.message}`
  if (data.loading || dataAllAdresses.loading)
    return <Container>Lade...</Container>
  const showFilter = !!nodeFilterState.state[treeName].activeTable
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
  const isPrint = get(data, 'isPrint', false)
  const view = get(data, 'view')
  const isFreiwillig = role === 'apflora_freiwillig'
  const { width } = dimensions

  let row
  if (showFilter) {
    row = nodeFilterState.state[treeName].tpopfreiwkontr
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
            id={id}
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
            id={id}
            datum={datum}
            saveToDb={saveToDb}
            errorsDatum={errors.datum}
            row={row}
          />
          <Map
            id={id}
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
              activeNodeArray={activeNodeArray}
              einheitsUsed={einheitsUsed}
              ekfzaehleinheits={ekfzaehleinheits}
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
              activeNodeArray={activeNodeArray}
              einheitsUsed={einheitsUsed}
              ekfzaehleinheits={ekfzaehleinheits}
            />
          )}
          {!showFilter && zaehl2ShowNew && (
            <Count
              id={null}
              tpopkontrId={id}
              nr="2"
              saveToDb={saveToDb}
              errors={errors}
              showNew
              refetch={data.refetch}
            />
          )}
          {!showFilter && zaehl2ShowEmpty && !zaehl1ShowEmpty && (
            <Count nr="2" showEmpty />
          )}
          {!showFilter && zaehls3 && (
            <Count
              id={zaehls3.id}
              nr="3"
              saveToDb={saveToDb}
              errors={errors}
              refetch={data.refetch}
              activeNodeArray={activeNodeArray}
              einheitsUsed={einheitsUsed}
              ekfzaehleinheits={ekfzaehleinheits}
            />
          )}
          {!showFilter && zaehl3ShowNew && (
            <Count
              id={null}
              tpopkontrId={id}
              nr="3"
              saveToDb={saveToDb}
              errors={errors}
              showNew
              refetch={data.refetch}
            />
          )}
          {!showFilter && zaehl3ShowEmpty && !zaehl2ShowEmpty && (
            <Count nr="3" showEmpty />
          )}
          <Cover
            id={id}
            deckungApArt={deckungApArt}
            deckungNackterBoden={deckungNackterBoden}
            saveToDb={saveToDb}
            errorsDeckungApArt={errors.deckungApArt}
            errorsDeckungNackterBoden={errors.deckungNackterBoden}
            row={row}
          />
          <More
            id={id}
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
            id={id}
            gefaehrdung={gefaehrdung}
            errorsGefaehrdung={errors.gefaehrdung}
            saveToDb={saveToDb}
            row={row}
          />
          <Remarks
            id={id}
            bemerkungen={bemerkungen}
            errorsBemerkungen={errors.bemerkungen}
            saveToDb={saveToDb}
            row={row}
          />
          {!isPrint && !isFreiwillig && !(view === 'ekf') && (
            <Verification
              id={id}
              ekfVerifiziert={ekfVerifiziert}
              errorsEkfVerifiziert={errors.ekfVerifiziert}
              saveToDb={saveToDb}
              row={row}
            />
          )}
          {!isPrint && (
            <EkfRemarks
              id={id}
              ekfBemerkungen={ekfBemerkungen}
              saveToDb={saveToDb}
              errorsEkfBemerkungen={errors.ekfBemerkungen}
              row={row}
            />
          )}
        </GridContainer>
        {!showFilter && !isPrint && !isFreiwillig && !(view === 'ekf') && (
          <StringToCopy text={id} label="GUID" />
        )}
      </InnerContainer>
    </Container>
  )
}

export default enhance(Tpopfreiwkontr)
