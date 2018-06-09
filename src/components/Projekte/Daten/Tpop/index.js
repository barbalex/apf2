// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'


import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import AutoCompleteFromArray from '../../../shared/AutocompleteFromArray'
import RadioButton from '../../../shared/RadioButton'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import FormTitle from '../../../shared/FormTitle'
import TpopAbBerRelevantInfoPopover from '../TpopAbBerRelevantInfoPopover'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateTpopByIdGql from './updateTpopById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(
  withState('errors', 'setErrors', ({})),
  withHandlers({
    saveToDb: ({
      setErrors,
      errors,
    }) => async ({
      row,
      field,
      value,
      updateTpop,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateTpop({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopById: {
              tpop: {
                id: row.id,
                popId: field === 'popId' ? value : row.popId,
                nr: field === 'nr' ? value : row.nr,
                gemeinde: field === 'gemeinde' ? value : row.gemeinde,
                flurname: field === 'flurname' ? value : row.flurname,
                x: field === 'x' ? value : row.x,
                y: field === 'y' ? value : row.y,
                radius: field === 'radius' ? value : row.radius,
                hoehe: field === 'hoehe' ? value : row.hoehe,
                exposition: field === 'exposition' ? value : row.exposition,
                klima: field === 'klima' ? value : row.klima,
                neigung: field === 'neigung' ? value : row.neigung,
                beschreibung: field === 'beschreibung' ? value : row.beschreibung,
                katasterNr: field === 'katasterNr' ? value : row.katasterNr,
                status: field === 'status' ? value : row.status,
                statusUnklarGrund:
                  field === 'statusUnklarGrund' ? value : row.statusUnklarGrund,
                apberRelevant:
                  field === 'apberRelevant' ? value : row.apberRelevant,
                bekanntSeit: field === 'bekanntSeit' ? value : row.bekanntSeit,
                eigentuemer: field === 'eigentuemer' ? value : row.eigentuemer,
                kontakt: field === 'kontakt' ? value : row.kontakt,
                nutzungszone: field === 'nutzungszone' ? value : row.nutzungszone,
                bewirtschafter:
                  field === 'bewirtschafter' ? value : row.bewirtschafter,
                bewirtschaftung:
                  field === 'bewirtschaftung' ? value : row.bewirtschaftung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                statusUnklar: field === 'statusUnklar' ? value : row.statusUnklar,
                popStatusWerteByStatus: row.popStatusWerteByStatus,
                tpopApberrelevantWerteByApberRelevant:
                  row.tpopApberrelevantWerteByApberRelevant,
                popByPopId: row.popByPopId,
                __typename: 'Tpop',
              },
              __typename: 'Tpop',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors(({}))
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors(({}))
      }
    },
  }),
)

const Tpop = ({
  id,
  saveToDb,
  errors,
  dimensions = { width: 380 },
}: {
  id: String,
  saveToDb: () => void,
  errors: Object,
  dimensions: Object,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) {
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      }
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'tpopById')
      const apJahr = get(data, 'tpopById.popByPopId.apByApId.startJahr', null)
      let gemeindeWerte = get(data, 'allGemeindes.nodes', [])
      gemeindeWerte = gemeindeWerte.map(el => el.name).sort()
      let apberrelevantWerte = get(data, 'allTpopApberrelevantWertes.nodes', [])
      apberrelevantWerte = sortBy(apberrelevantWerte, 'sort')
      apberrelevantWerte = apberrelevantWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container innerRef={c => (this.container = c)}>
            <FormTitle
              apId={get(data, 'tpopById.popByPopId.apId')}
              title="Teil-Population"
            />
            <Mutation mutation={updateTpopByIdGql}>
              {(updateTpop, { data }) => (
                <FieldsContainer
                  data-width={isNaN(dimensions.width) ? 380 : dimensions.width}
                >
                  <TextField
                    key={`${row.id}nr`}
                    label="Nr."
                    value={row.nr}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'nr', value, updateTpop })
                    }
                    error={errors.nr}
                  />
                  <TextFieldWithInfo
                    key={`${row.id}flurname`}
                    label="Flurname"
                    value={row.flurname}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'flurname', value, updateTpop })
                    }
                    popover="Dieses Feld möglichst immer ausfüllen"
                    error={errors.flurname}
                  />
                  <Status
                    key={`${row.id}status`}
                    apJahr={apJahr}
                    herkunftValue={row.status}
                    bekanntSeitValue={row.bekanntSeit}
                    saveToDbBekanntSeit={value =>
                      updateTpop({
                        variables: {
                          id,
                          bekanntSeit: value,
                        },
                      })
                    }
                    saveToDbStatus={value =>
                      updateTpop({
                        variables: {
                          id,
                          status: value,
                        },
                      })
                    }
                  />
                  <RadioButton
                    key={`${row.id}statusUnklar`}
                    label="Status unklar"
                    value={row.statusUnklar}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'statusUnklar',
                        value,
                        updateTpop,
                      })
                    }
                    error={errors.statusUnklar}
                  />
                  <TextField
                    key={`${row.id}statusUnklarGrund`}
                    label="Begründung"
                    value={row.statusUnklarGrund}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'statusUnklarGrund',
                        value,
                        updateTpop,
                      })
                    }
                    error={errors.statusUnklarGrund}
                  />
                  <RadioButtonGroupWithInfo
                    value={row.apberRelevant}
                    dataSource={apberrelevantWerte}
                    popover={TpopAbBerRelevantInfoPopover}
                    label="Für AP-Bericht relevant"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'apberRelevant',
                        value,
                        updateTpop,
                      })
                    }
                    error={errors.apberRelevant}
                  />
                  <TextField
                    key={`${row.id}x`}
                    label="X-Koordinaten"
                    value={row.x}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'x', value, updateTpop })
                    }
                    error={errors.x}
                  />
                  <TextField
                    key={`${row.id}y`}
                    label="Y-Koordinaten"
                    value={row.y}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'y', value, updateTpop })
                    }
                    error={errors.y}
                  />
                  <AutoCompleteFromArray
                    key={`${row.id}gemeinde`}
                    label="Gemeinde"
                    value={row.gemeinde}
                    values={gemeindeWerte}
                    saveToDb={value =>
                      saveToDb({ row, field: 'gemeinde', value, updateTpop })
                    }
                    error={errors.gemeinde}
                  />
                  <TextField
                    key={`${row.id}radius`}
                    label="Radius (m)"
                    value={row.radius}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'radius', value, updateTpop })
                    }
                    error={errors.radius}
                  />
                  <TextField
                    key={`${row.id}hoehe`}
                    label="Höhe (m.ü.M.)"
                    value={row.hoehe}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'hoehe', value, updateTpop })
                    }
                    error={errors.hoehe}
                  />
                  <TextField
                    key={`${row.id}exposition`}
                    label="Exposition, Besonnung"
                    value={row.exposition}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'exposition', value, updateTpop })
                    }
                    error={errors.exposition}
                  />
                  <TextField
                    key={`${row.id}klima`}
                    label="Klima"
                    value={row.klima}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'klima', value, updateTpop })
                    }
                    error={errors.klima}
                  />
                  <TextField
                    key={`${row.id}neigung`}
                    label="Hangneigung"
                    value={row.neigung}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'neigung', value, updateTpop })
                    }
                    error={errors.neigung}
                  />
                  <TextField
                    key={`${row.id}beschreibung`}
                    label="Beschreibung"
                    value={row.beschreibung}
                    type="text"
                    multiline
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'beschreibung',
                        value,
                        updateTpop,
                      })
                    }
                    error={errors.beschreibung}
                  />
                  <TextField
                    key={`${row.id}katasterNr`}
                    label="Kataster-Nr."
                    value={row.katasterNr}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'katasterNr', value, updateTpop })
                    }
                    error={errors.katasterNr}
                  />
                  <TextField
                    key={`${row.id}eigentuemer`}
                    label="EigentümerIn"
                    value={row.eigentuemer}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'eigentuemer', value, updateTpop })
                    }
                    error={errors.eigentuemer}
                  />
                  <TextField
                    key={`${row.id}kontakt`}
                    label="Kontakt vor Ort"
                    value={row.kontakt}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'kontakt', value, updateTpop })
                    }
                    error={errors.kontakt}
                  />
                  <TextField
                    key={`${row.id}nutzungszone`}
                    label="Nutzungszone"
                    value={row.nutzungszone}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'nutzungszone',
                        value,
                        updateTpop,
                      })
                    }
                    error={errors.nutzungszone}
                  />
                  <TextField
                    key={`${row.id}bewirtschafter`}
                    label="BewirtschafterIn"
                    value={row.bewirtschafter}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'bewirtschafter',
                        value,
                        updateTpop,
                      })
                    }
                    error={errors.bewirtschafter}
                  />
                  <TextField
                    key={`${row.id}bewirtschaftung`}
                    label="Bewirtschaftung"
                    value={row.bewirtschaftung}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'bewirtschaftung',
                        value,
                        updateTpop,
                      })
                    }
                    error={errors.bewirtschaftung}
                  />
                  <TextField
                    key={`${row.id}bemerkungen`}
                    label="Bemerkungen"
                    value={row.bemerkungen}
                    type="text"
                    multiline
                    saveToDb={value =>
                      saveToDb({ row, field: 'bemerkungen', value, updateTpop })
                    }
                    error={errors.bemerkungen}
                  />
                </FieldsContainer>
              )}
            </Mutation>
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(Tpop)
