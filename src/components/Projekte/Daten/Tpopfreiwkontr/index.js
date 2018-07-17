// @flow
import React from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import get from 'lodash/get'
import app from 'ampersand-app'

import StringToCopy from '../../../shared/StringToCopyOnlyButton'
import data from './data'
import updateTpopkontrByIdGql from './updateTpopkontrById.graphql'
import Headdata from './Headdata'
import Besttime from './Besttime'
import Date from './Date'
import Map from './Map'
import Cover from './Cover'
import More from './More'
import Danger from './Danger'
import Remarks from './Remarks'

const Container = styled.div`
  padding: 10px;
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
`
const Image = styled(Area)`
  grid-area: image;
`
const Count1 = styled(Area)`
  grid-area: count1;
`
const Count2 = styled(Area)`
  grid-area: count2;
`
const Count3 = styled(Area)`
  grid-area: count3;
`

/**
 * TODO
 * on componentDidMount
 * check number of tpopkontrzaehl
 * if none: create one
 * then refetch data
 */
const enhance = compose(
  data,
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
    onDidUpdate(prevProps, props) {
      if (prevProps.data.loading && !props.data.loading) {
        // loading data just finished
        // check if tpopkontr exist
        const tpopkontrCount = get(
          props.data,
          'tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes',
          []
        ).length
        if (tpopkontrCount === 0) {
          console.log(
            'Tpopfreiwkontr onDidUpdate: TODO: need to create tpopkontrzaehl with:',
            { tpopkontrId: props.id, client: app.client }
          )
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
}: {
  id: String,
  data: Object,
  dimensions: Object,
  saveToDb: () => void,
  errors: Object,
}) => (
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
          <Count1>count1</Count1>
          <Count2>count2</Count2>
          <Count3>count3</Count3>
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
      </Container>
    )}
  </Mutation>
)

export default enhance(Tpopfreiwkontr)
