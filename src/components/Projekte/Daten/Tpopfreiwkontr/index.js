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
import dataGql from './data.graphql'
import updateTpopkontrByIdGql from './updateTpopkontrById.graphql'

const LadeContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
`
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
    'remarks remarks remarks remarks remarks copyId';
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
const Headdata = styled(Area)`
  grid-area: headdata;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'popLabel popVal popVal'
    'tpopLabel tpopVal tpopVal'
    'koordLabel koordVal koordVal'
    'tpopNrLabel tpopNrVal statusVal'
    'bearbLabel bearbVal bearbVal';
  div:nth-child(n + 3) {
    padding-top: 10px;
  }
`
const Label = styled.div`
  font-weight: 700;
  padding-right: 4px;
`
const PopLabel = styled(Label)`
  grid-area: popLabel;
`
const PopVal = styled.div`
  grid-area: popVal;
`
const TpopLabel = styled(Label)`
  grid-area: tpopLabel;
`
const TpopVal = styled.div`
  grid-area: tpopVal;
`
const KoordLabel = styled(Label)`
  grid-area: koordLabel;
`
const KoordVal = styled.div`
  grid-area: koordVal;
`
const TpopNrLabel = styled(Label)`
  grid-area: tpopNrLabel;
`
const TpopNrVal = styled.div`
  grid-area: tpopNrVal;
`
const BearbLabel = styled(Label)`
  grid-area: bearbLabel;
`
const BearbVal = styled.div`
  grid-area: bearbVal;
`
const StatusLabel = styled(Label)`
  grid-area: statusVal;
`
const Besttime = styled(Area)`
  grid-area: besttime;
`
const Date = styled(Area)`
  grid-area: date;
`
const Map = styled(Area)`
  grid-area: map;
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
const Cover = styled(Area)`
  grid-area: cover;
`
const More = styled(Area)`
  grid-area: more;
`
const Danger = styled(Area)`
  grid-area: danger;
`
const Remarks = styled(Area)`
  grid-area: remarks;
`
const CopyId = styled(Area)`
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
      const statusValue = get(row, 'tpopByTpopId.status', '')
      const status = [200, 201, 202].includes(statusValue)
        ? 'angesiedelt'
        : 'natürlich'

      return (
        <Mutation mutation={updateTpopkontrByIdGql}>
          {(updateTpopkontr, { data }) => (
            <Container>
              <GridContainer>
                <Title>Erfolgskontrolle Artenschutz Flora</Title>
                <Headdata>
                  <PopLabel>Population</PopLabel>
                  <PopVal>
                    {get(row, 'tpopByTpopId.popByPopId.name', '')}
                  </PopVal>
                  <TpopLabel>Teilpopulation</TpopLabel>
                  <TpopVal>{get(row, 'tpopByTpopId.flurname', '')}</TpopVal>
                  <KoordLabel>Koordinaten</KoordLabel>
                  <KoordVal>{`${get(row, 'tpopByTpopId.x', '')} / ${get(
                    row,
                    'tpopByTpopId.y'
                  )}`}</KoordVal>
                  <TpopNrLabel>Teilpop.Nr.</TpopNrLabel>
                  <TpopNrVal>{`${get(
                    row,
                    'tpopByTpopId.popByPopId.nr',
                    ''
                  )}.${get(row, 'tpopByTpopId.nr')}`}</TpopNrVal>
                  <BearbLabel>BeobachterIn</BearbLabel>
                  <BearbVal>
                    <AutoComplete
                      key={`${row.id}bearbeiter`}
                      label=""
                      value={get(row, 'adresseByBearbeiter.name', '')}
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
                  </BearbVal>
                  <StatusLabel>{status}</StatusLabel>
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
              </GridContainer>
            </Container>
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default enhance(Tpopfreiwkontr)
