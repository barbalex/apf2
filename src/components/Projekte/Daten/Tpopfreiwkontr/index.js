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
import Headdata from './Headdata'
import Besttime from './Besttime'
import Date from './Date'
import Map from './Map'
import Cover from './Cover'
import More from './More'
import Danger from './Danger'
import Remarks from './Remarks'
import Count from './Count'

const Container = styled.div`
  padding: 10px;
  @media print {
    font-size: 11px;
    /* this is when it is actually printed */
    height: auto;
    width: inherit;

    margin: 0 !important;
    padding: 0.5cm !important;
    overflow-y: hidden !important;

    box-shadow: unset;
    overflow: visible;
  }
`
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    'title title title image image image'
    'headdata headdata headdata image image image'
    'besttime besttime besttime image image image'
    'date date map image image image'
    'count1 count1 count2 count2 count3 count3'
    'cover cover cover more more more'
    'danger danger danger danger danger danger'
    'remarks remarks remarks remarks remarks remarks';
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
  box-sizing: border-box;
  border-collapse: collapse;
`
const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
`
const Title = styled(Area)`
  grid-area: title;
  font-weight: 700;
  font-size: 22px;
  @media print {
    font-size: 16px;
  }
`
const Image = styled(Area)`
  grid-area: image;
`

/**
 * TODO
 * on componentDidMount
 * check number of tpopkontrzaehl
 * if none: create new ones
 * then refetch data
 */
const enhance = compose(
  dataGql,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ setErrors, errors }) => async ({
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
                adresseByBearbeiter: row.adresseByBearbeiter,
                tpopByTpopId: row.tpopByTpopId,
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
    },
  })
)

const Tpopfreiwkontr = ({
  id,
  data,
  // TODO: use dimensions to show in one row on narrow screens
  dimensions,
  saveToDb,
  errors,
  activeNodeArray,
}: {
  id: String,
  data: Object,
  dimensions: Object,
  saveToDb: () => void,
  errors: Object,
  activeNodeArray: Array<String>,
}) => {
  const zaehls = sortBy(
    get(data, 'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes', []),
    'einheit'
  )
  const zaehls1 = zaehls[0]
  const zaehls2 = zaehls[1]
  const zaehls3 = zaehls[2]
  const zaehl1WasAttributed =
    zaehls1 && (zaehls1.anzahl || zaehls1.anzahl === 0 || zaehls1.einheit)
  const zaehl2ShowNew = zaehl1WasAttributed && !zaehls2
  const zaehl2ShowEmpty = !zaehl1WasAttributed && !zaehls2
  const zaehl2WasAttributed =
    zaehl1WasAttributed &&
    zaehls2 &&
    (zaehls2.anzahl || zaehls2.anzahl === 0 || zaehls2.einheit)
  const zaehl3ShowNew = zaehl2WasAttributed && !zaehls3
  const zaehl3ShowEmpty = !zaehl2WasAttributed && !zaehls3
  const einheitsUsed = get(
    data,
    'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
    []
  )
    .filter(n => !!n.einheit)
    .map(n => n.einheit)

  return (
    <Mutation mutation={updateTpopkontrByIdGql}>
      {updateTpopkontr => (
        <Container>
          <GridContainer>
            <Title>Erfolgskontrolle Artenschutz Flora</Title>
            <Headdata
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            <Besttime
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            <Date
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            <Map
              saveToDb={saveToDb}
              errors={errors}
              data={data}
              updateTpopkontr={updateTpopkontr}
            />
            <Image>Image</Image>
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
              />
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
            {zaehl2ShowEmpty && (
              <Count
                id={null}
                nr="2"
                saveToDb={saveToDb}
                errors={errors}
                updateTpopkontr={updateTpopkontr}
                showEmpty
              />
            )}
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
            {zaehl3ShowEmpty && (
              <Count
                id={null}
                nr="3"
                saveToDb={saveToDb}
                errors={errors}
                updateTpopkontr={updateTpopkontr}
                showEmpty
              />
            )}
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
          </GridContainer>
          <StringToCopy text={id} label="GUID" />
          <div>another div</div>
          <div>another div</div>
          <div>another div</div>
          <div>another div</div>
          <div>another div</div>
          <div>another div</div>
          <div>another div</div>
        </Container>
      )}
    </Mutation>
  )
}

export default enhance(Tpopfreiwkontr)
