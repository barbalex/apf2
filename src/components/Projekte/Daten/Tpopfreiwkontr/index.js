// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import RadioButton from '../../../shared/RadioButton'
import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import AutoComplete from '../../../shared/Autocomplete'
import StringToCopy from '../../../shared/StringToCopy'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateTpopkontrByIdGql from './updateTpopkontrById.graphql'

const LadeContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
`
const Container = styled.div`
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
    'remarks remarks remarks remarks remarks copyId';
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid rgba(0, 0, 0, 0.1);
`
const Title = styled.div`
  grid-area: title;
`
const Image = styled.div`
  grid-area: image;
`
const Headdata = styled.div`
  grid-area: headdata;
`
const Besttime = styled.div`
  grid-area: besttime;
`
const Date = styled.div`
  grid-area: date;
`
const Map = styled.div`
  grid-area: map;
`
const Count1 = styled.div`
  grid-area: count1;
`
const Count2 = styled.div`
  grid-area: count2;
`
const Count3 = styled.div`
  grid-area: count3;
`
const Cover = styled.div`
  grid-area: cover;
`
const More = styled.div`
  grid-area: more;
`
const Danger = styled.div`
  grid-area: danger;
`
const Remarks = styled.div`
  grid-area: remarks;
`
const CopyId = styled.div`
  grid-area: copyId;
`

const enhance = compose(
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
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  })
)

const jungpflanzenVorhandenDataSource = [
  { value: true, label: 'ja' },
  { value: false, label: 'nein' },
]

const Tpopfreiwkontr = ({
  id,
  saveToDb,
  dimensions,
  errors,
}: {
  id: String,
  saveToDb: () => void,
  dimensions: Number,
  errors: Object,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return <LadeContainer>Lade...</LadeContainer>
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'tpopkontrById')
      let adressenWerte = get(data, 'allAdresses.nodes', [])
      adressenWerte = sortBy(adressenWerte, 'name')
      adressenWerte = adressenWerte.map(el => ({
        id: el.id,
        value: el.name,
      }))

      return (
        <Mutation mutation={updateTpopkontrByIdGql}>
          {(updateTpopkontr, { data }) => (
            <Container>
              <Title>Erfolgskontrolle Artenschutz Flora</Title>
              <Headdata>
                <div>Population: Flaach</div>
                <AutoComplete
                  key={`${row.id}bearbeiter`}
                  label="BearbeiterIn"
                  value={get(row, 'adresseByBearbeiter.name')}
                  objects={adressenWerte}
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'bearbeiter',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.bearbeiter}
                />
              </Headdata>
              <Besttime>August</Besttime>
              <Date>
                <DateFieldWithPicker
                  key={`${row.id}datum`}
                  label="Datum"
                  value={row.datum}
                  saveToDb={value => {
                    saveToDb({
                      row,
                      field: 'datum',
                      value,
                      field2: 'jahr',
                      value2: !!value ? format(value, 'YYYY') : null,
                      updateTpopkontr,
                    })
                  }}
                  error={errors.datum}
                />
              </Date>
              <Map>
                <RadioButton
                  key={`${row.id}planVorhanden`}
                  label="Auf Plan eingezeichnet"
                  value={row.planVorhanden}
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'planVorhanden',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.planVorhanden}
                />
              </Map>
              <Image>Image</Image>
              <Count1>count1</Count1>
              <Count2>count2</Count2>
              <Count3>count3</Count3>
              <Cover>
                <TextField
                  key={`${row.id}deckungApArt`}
                  label="Deckung überprüfte Art (%)"
                  value={row.deckungApArt}
                  type="number"
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'deckungApArt',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.deckungApArt}
                />
                <TextField
                  key={`${row.id}deckungNackterBoden`}
                  label="Deckung nackter Boden (%)"
                  value={row.deckungNackterBoden}
                  type="number"
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'deckungNackterBoden',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.deckungNackterBoden}
                />
              </Cover>
              <More>
                <TextField
                  key={`${row.id}flaecheUeberprueft`}
                  label="Überprüfte Fläche in m2"
                  value={row.flaecheUeberprueft}
                  type="number"
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'flaecheUeberprueft',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.flaecheUeberprueft}
                />

                <RadioButtonGroup
                  label="Auch junge Pflanzen vorhanden"
                  value={row.jungpflanzenVorhanden}
                  dataSource={jungpflanzenVorhandenDataSource}
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'jungpflanzenVorhanden',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.jungpflanzenVorhanden}
                />
                <TextField
                  key={`${row.id}vegetationshoeheMaximum`}
                  label="Maximum der Vegetationshöhe in cm"
                  value={row.vegetationshoeheMaximum}
                  type="number"
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'vegetationshoeheMaximum',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.vegetationshoeheMaximum}
                />
                <TextField
                  key={`${row.id}vegetationshoeheMittel`}
                  label="Mittelwert der Vegetationshöhe in cm"
                  value={row.vegetationshoeheMittel}
                  type="number"
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'vegetationshoeheMittel',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.vegetationshoeheMittel}
                />
              </More>
              <Danger>
                <TextField
                  key={`${row.id}gefaehrdung`}
                  label="Gefährdung"
                  value={row.gefaehrdung}
                  type="text"
                  multiLine
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'gefaehrdung',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.gefaehrdung}
                />
              </Danger>
              <Remarks>
                <TextField
                  key={`${row.id}bemerkungen`}
                  label="Bemerkungen"
                  value={row.bemerkungen}
                  type="text"
                  multiLine
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'bemerkungen',
                      value,
                      updateTpopkontr,
                    })
                  }
                  error={errors.bemerkungen}
                />
              </Remarks>
              <CopyId>
                <StringToCopy text={row.id} label="GUID" />
              </CopyId>
            </Container>
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default enhance(Tpopfreiwkontr)
