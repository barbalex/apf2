// @flow
import React from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import app from 'ampersand-app'

import StringToCopy from '../../../shared/StringToCopyOnlyButton'
import dataGql from './data'
import updateTpopkontrByIdGql from './updateTpopkontrById.graphql'
import createTpopkontrzaehl from './createTpopkontrzaehl.graphql'
import Title from './Title'
import Headdata from './Headdata'
import Besttime from './Besttime'
import Date from './Date'
import Map from './Map'
import Cover from './Cover'
import More from './More'
import Danger from './Danger'
import Remarks from './Remarks'
import Count from './Count'
import Verification from './Verification'
import Image from './Image'

const Container = styled.div`
  padding: 10px;
  @media print {
    font-size: 11px;
    height: auto;
    width: inherit;
    margin: 0 !important;
    padding: 0.5cm !important;
    overflow: hidden;
  }
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
  dataGql,
  withState('errors', 'setErrors', {}),
  withState('titleHeight', 'setTitleHeight', 184),
  withState('headdataHeight', 'setHeaddataHeight', 184),
  withState('besttimeHeight', 'setBesttimeHeight', 79),
  withState('dateHeight', 'setDateHeight', 86),
  withHandlers({
    saveToDb: ({ setErrors, errors, data }) => async ({
      row,
      field,
      value,
      field2,
      value2,
      updateTpopkontr,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      /**
       * enable passing two values
       * with same update
       */
      const variables = {
        id: row.id,
        [field]: value,
      }
      if (field2) variables[field2] = value2
      const adresseByBearbeiter =
        field === 'bearbeiter'
          ? row.adresseByBearbeiter
          : get(data, 'allAdresses.nodes', []).find(r => r.id === value)
      try {
        await updateTpopkontr({
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
                adresseByBearbeiter,
                ekfVerifiziert:
                  field === 'ekfVerifiziert' ? value : row.ekfVerifiziert,
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
  }),
  withLifecycle({
    async onDidUpdate(prevProps, props) {
      if (prevProps.data.loading && !props.data.loading) {
        // loading data just finished
        // check if tpopkontr exist
        const tpopkontrCount = get(
          props.data,
          'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
          []
        ).length
        if (tpopkontrCount === 0) {
          // add counts for all ekfzaehleinheit
          const ekfzaehleinheits = get(
            props.data,
            'tpopkontrById.tpopByTpopId.popByPopId.apByApId.ekfzaehleinheitsByApId.nodes'
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
                      null
                    ),
                  },
                })
              )
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
      const { data, setErrors, errors } = props
      const row = get(data, 'tpopkontrById')
      const bearbeiter = get(row, 'bearbeiter')
      const userCount = get(
        row,
        'adresseByBearbeiter.usersByAdresseId.totalCount'
      )
      if (bearbeiter && !userCount && !errors.bearbeiter) {
        setErrors({
          bearbeiter:
            'Es ist kein Benutzer mit dieser Adresse verbunden. Damit dieser Benutzer Kontrollen erfassen kann, muss er ein Benutzerkonto haben, in dem die oben gwählte Adresse als zugehörig erfasst wurde.',
        })
      }
    },
  })
)

const Tpopfreiwkontr = ({
  id,
  data,
  dimensions,
  saveToDb,
  errors,
  setErrors,
  activeNodeArray,
  role,
  titleHeight,
  setTitleHeight,
  headdataHeight,
  setHeaddataHeight,
  besttimeHeight,
  setBesttimeHeight,
  dateHeight,
  setDateHeight,
}: {
  id: String,
  data: Object,
  dimensions: Object,
  saveToDb: () => void,
  errors: Object,
  setErrors: () => void,
  activeNodeArray: Array<String>,
  role: String,
  titleHeight: Number,
  setTitleHeight: () => void,
  headdataHeight: Number,
  setHeaddataHeight: () => void,
  besttimeHeight: Number,
  setBesttimeHeight: () => void,
  dateHeight: Number,
  setDateHeight: () => void,
}) => {
  const ekfzaehleinheits = get(
    data,
    'tpopkontrById.tpopByTpopId.popByPopId.apByApId.ekfzaehleinheitsByApId.nodes',
    []
  ).map(n => get(n, 'tpopkontrzaehlEinheitWerteByZaehleinheitId', {}))
  const zaehls = sortBy(
    get(data, 'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes', []),
    'einheit'
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
    []
  )
    .filter(n => !!n.einheit)
    .map(n => n.einheit)
  const isPrint = get(data, 'isPrint', false)
  const isFreiwillig = role === 'apflora_freiwillig'
  const { width } = dimensions
  const imageHeight =
    titleHeight + headdataHeight + besttimeHeight + dateHeight + 30

  return (
    <Mutation mutation={updateTpopkontrByIdGql}>
      {updateTpopkontr => (
        <Container>
          <GridContainer width={width}>
            <Title setTitleHeight={setTitleHeight} />
            <Headdata
              saveToDb={saveToDb}
              errors={errors}
              setErrors={setErrors}
              data={data}
              updateTpopkontr={updateTpopkontr}
              setHeaddataHeight={setHeaddataHeight}
            />
            <Besttime data={data} setBesttimeHeight={setBesttimeHeight} />
            <Date
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
              setDateHeight={setDateHeight}
            />
            <Map
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            <Image data={data} width={width} height={imageHeight} />
            {zaehls1 && (
              <Count
                id={zaehls1.id}
                nr="1"
                saveToDb={saveToDb}
                errors={errors}
                updateTpopkontr={updateTpopkontr}
                refetch={data.refetch}
                activeNodeArray={activeNodeArray}
                einheitsUsed={einheitsUsed}
                ekfzaehleinheits={ekfzaehleinheits}
              />
            )}
            {zaehl1ShowEmpty && (
              <CountHint>
                Sie müssen auf Ebene Aktionsplan EKF-Zähleinheiten definieren,
                um hier Zählungen erfassen zu können.
              </CountHint>
            )}
            {zaehls2 && (
              <Count
                id={zaehls2.id}
                nr="2"
                saveToDb={saveToDb}
                errors={errors}
                updateTpopkontr={updateTpopkontr}
                refetch={data.refetch}
                activeNodeArray={activeNodeArray}
                einheitsUsed={einheitsUsed}
                ekfzaehleinheits={ekfzaehleinheits}
              />
            )}
            {zaehl2ShowNew && (
              <Count
                id={null}
                tpopkontrId={id}
                nr="2"
                saveToDb={saveToDb}
                errors={errors}
                updateTpopkontr={updateTpopkontr}
                showNew
                refetch={data.refetch}
              />
            )}
            {zaehl2ShowEmpty && !zaehl1ShowEmpty && <Count nr="2" showEmpty />}
            {zaehls3 && (
              <Count
                id={zaehls3.id}
                nr="3"
                saveToDb={saveToDb}
                errors={errors}
                updateTpopkontr={updateTpopkontr}
                refetch={data.refetch}
                activeNodeArray={activeNodeArray}
                einheitsUsed={einheitsUsed}
                ekfzaehleinheits={ekfzaehleinheits}
              />
            )}
            {zaehl3ShowNew && (
              <Count
                id={null}
                tpopkontrId={id}
                nr="3"
                saveToDb={saveToDb}
                errors={errors}
                updateTpopkontr={updateTpopkontr}
                showNew
                refetch={data.refetch}
              />
            )}
            {zaehl3ShowEmpty && !zaehl2ShowEmpty && <Count nr="3" showEmpty />}
            <Cover
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            <More
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            <Danger
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            <Remarks
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            {!isPrint &&
              !isFreiwillig && (
                <Verification
                  saveToDb={saveToDb}
                  errors={errors}
                  data={data}
                  updateTpopkontr={updateTpopkontr}
                />
              )}
          </GridContainer>
          {!isFreiwillig && <StringToCopy text={id} label="GUID" />}
        </Container>
      )}
    </Mutation>
  )
}

export default enhance(Tpopfreiwkontr)
