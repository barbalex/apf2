// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import TextField from '../../../shared/TextFieldGql'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoGql'
import Status from '../../../shared/Status'
import AutoCompleteFromArray from '../../../shared/AutocompleteFromArrayGql'
import RadioButton from '../../../shared/RadioButtonGql'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfoGql'
import FormTitle from '../../../shared/FormTitle'
import TpopAbBerRelevantInfoPopover from '../TpopAbBerRelevantInfoPopover'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import tpopByIdGql from './tpopById.graphql'
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

const enhance = compose(inject('store'), observer)

const Tpop = ({
  id,
  store,
  tree,
  dimensions = { width: 380 },
}: {
  id: String,
  store: Object,
  tree: Object,
  dimensions: Object,
}) => {
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <Query query={tpopByIdGql} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Container>
              <FieldsContainer>Lade...</FieldsContainer>
            </Container>
          )
        if (error) return `Fehler: ${error.message}`

        const row = get(data, 'tpopById')
        const ads = store.table.pop.get(row.id)
        const apId = ads && ads.ap_id ? ads.ap_id : null
        const ap = store.table.ap.get(apId)
        const apJahr = ap && ap.start_jahr ? ap.start_jahr : null
        let gemeindeWerte = get(data, 'allGemeindes.nodes', [])
        gemeindeWerte = gemeindeWerte.map(el => el.name).sort()
        let apberrelevantWerte = get(
          data,
          'allTpopApberrelevantWertes.nodes',
          []
        )
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
                  <FieldsContainer data-width={width}>
                    <TextField
                      key={`${row.id}nr`}
                      label="Nr."
                      value={row.nr}
                      type="number"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            nr: event.target.value,
                          },
                        })
                      }
                    />
                    <TextFieldWithInfo
                      key={`${row.id}flurname`}
                      label="Flurname"
                      value={row.flurname}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            flurname: event.target.value,
                          },
                        })
                      }
                      popover="Dieses Feld möglichst immer ausfüllen"
                    />
                    <Status
                      key={`${row.id}status`}
                      apJahr={apJahr}
                      herkunftValue={row.status}
                      bekanntSeitValue={row.bekanntSeit}
                      saveToDbBekanntSeit={event =>
                        updateTpop({
                          variables: {
                            id,
                            bekanntSeit: event.target.value,
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
                        updateTpop({
                          variables: {
                            id,
                            statusUnklar: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}statusUnklarGrund`}
                      label="Begründung"
                      value={row.statusUnklarGrund}
                      type="text"
                      multiLine
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            statusUnklarGrund: event.target.value,
                          },
                        })
                      }
                    />
                    <RadioButtonGroupWithInfo
                      value={row.apberRelevant}
                      dataSource={apberrelevantWerte}
                      popover={TpopAbBerRelevantInfoPopover}
                      label="Für AP-Bericht relevant"
                      saveToDb={value =>
                        updateTpop({
                          variables: {
                            id,
                            apberRelevant: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}x`}
                      label="X-Koordinaten"
                      value={row.x}
                      type="number"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            x: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}y`}
                      label="Y-Koordinaten"
                      value={row.y}
                      type="number"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            y: event.target.value,
                          },
                        })
                      }
                    />
                    <AutoCompleteFromArray
                      key={`${row.id}gemeinde`}
                      label="Gemeinde"
                      value={row.gemeinde}
                      values={gemeindeWerte}
                      saveToDb={value =>
                        updateTpop({
                          variables: {
                            id,
                            gemeinde: value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}radius`}
                      label="Radius (m)"
                      value={row.radius}
                      type="number"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            radius: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}hoehe`}
                      label="Höhe (m.ü.M.)"
                      value={row.hoehe}
                      type="number"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            hoehe: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}exposition`}
                      label="Exposition, Besonnung"
                      value={row.exposition}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            exposition: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}klima`}
                      label="Klima"
                      value={row.klima}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            klima: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}neigung`}
                      label="Hangneigung"
                      value={row.neigung}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            neigung: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}beschreibung`}
                      label="Beschreibung"
                      value={row.beschreibung}
                      type="text"
                      multiline
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            beschreibung: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}katasterNr`}
                      label="Kataster-Nr."
                      value={row.katasterNr}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            katasterNr: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}eigentuemer`}
                      label="EigentümerIn"
                      value={row.eigentuemer}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            eigentuemer: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}kontakt`}
                      label="Kontakt vor Ort"
                      value={row.kontakt}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            kontakt: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}nutzungszone`}
                      label="Nutzungszone"
                      value={row.nutzungszone}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            nutzungszone: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}bewirtschafter`}
                      label="BewirtschafterIn"
                      value={row.bewirtschafter}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            bewirtschafter: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}bewirtschaftung`}
                      label="Bewirtschaftung"
                      value={row.bewirtschaftung}
                      type="text"
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            bewirtschaftung: event.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      key={`${row.id}bemerkungen`}
                      label="Bemerkungen"
                      value={row.bemerkungen}
                      type="text"
                      multiline
                      saveToDb={event =>
                        updateTpop({
                          variables: {
                            id,
                            bemerkungen: event.target.value,
                          },
                        })
                      }
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
}

export default enhance(Tpop)
