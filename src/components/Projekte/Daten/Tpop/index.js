// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import TextField from '../../../shared/TextFieldGql'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import AutoCompleteFromArrayNew from '../../../shared/AutocompleteFromArray'
import RadioButton from '../../../shared/RadioButton'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
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
  const { activeDataset } = tree
  const ads = store.table.pop.get(activeDataset.row.id)
  const apId = ads && ads.ap_id ? ads.ap_id : null
  const ap = store.table.ap.get(apId)
  const apJahr = ap && ap.start_jahr ? ap.start_jahr : null
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
        let popentwicklungWerte = get(
          data,
          'allTpopEntwicklungWertes.nodes',
          []
        )
        popentwicklungWerte = sortBy(popentwicklungWerte, 'sort')
        popentwicklungWerte = popentwicklungWerte.map(el => ({
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
                      key={`${activeDataset.row.id}nr`}
                      label="Nr."
                      value={activeDataset.row.nr}
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
                      key={`${activeDataset.row.id}flurname`}
                      label="Flurname"
                      value={activeDataset.row.flurname}
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
                      key={`${activeDataset.row.id}status`}
                      tree={tree}
                      apJahr={apJahr}
                      herkunftFieldName="status"
                      herkunftValue={activeDataset.row.status}
                      bekanntSeitFieldName="bekannt_seit"
                      bekanntSeitValue={activeDataset.row.bekannt_seit}
                      bekanntSeitValid={activeDataset.valid.bekannt_seit}
                      updateProperty={store.updateProperty}
                      updatePropertyInDb={store.updatePropertyInDb}
                    />
                    <RadioButton
                      tree={tree}
                      fieldName="status_unklar"
                      label="Status unklar"
                      value={activeDataset.row.status_unklar}
                      updatePropertyInDb={store.updatePropertyInDb}
                    />
                    <TextField
                      key={`${activeDataset.row.id}statusUnklarGrund`}
                      label="Begründung"
                      value={activeDataset.row.statusUnklarGrund}
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
                      tree={tree}
                      fieldName="apber_relevant"
                      value={activeDataset.row.apber_relevant}
                      dataSource={store.dropdownList.tpopApBerichtRelevantWerte}
                      updatePropertyInDb={store.updatePropertyInDb}
                      popover={TpopAbBerRelevantInfoPopover}
                      label="Für AP-Bericht relevant"
                    />
                    <TextField
                      key={`${activeDataset.row.id}x`}
                      label="X-Koordinaten"
                      value={activeDataset.row.x}
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
                      key={`${activeDataset.row.id}y`}
                      label="Y-Koordinaten"
                      value={activeDataset.row.y}
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
                    <AutoCompleteFromArrayNew
                      key={`${activeDataset.row.id}gemeinde`}
                      tree={tree}
                      label="Gemeinde"
                      fieldName="gemeinde"
                      value={activeDataset.row.gemeinde}
                      errorText={activeDataset.valid.gemeinde}
                      values={store.dropdownList.gemeinden}
                      updatePropertyInDb={store.updatePropertyInDb}
                    />
                    <TextField
                      key={`${activeDataset.row.id}radius`}
                      label="Radius (m)"
                      value={activeDataset.row.radius}
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
                      key={`${activeDataset.row.id}hoehe`}
                      label="Höhe (m.ü.M.)"
                      value={activeDataset.row.hoehe}
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
                      key={`${activeDataset.row.id}exposition`}
                      label="Exposition, Besonnung"
                      value={activeDataset.row.exposition}
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
                      key={`${activeDataset.row.id}klima`}
                      label="Klima"
                      value={activeDataset.row.klima}
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
                      key={`${activeDataset.row.id}neigung`}
                      label="Hangneigung"
                      value={activeDataset.row.neigung}
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
                      key={`${activeDataset.row.id}beschreibung`}
                      label="Beschreibung"
                      value={activeDataset.row.beschreibung}
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
                      key={`${activeDataset.row.id}katasterNr`}
                      label="Kataster-Nr."
                      value={activeDataset.row.katasterNr}
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
                      key={`${activeDataset.row.id}eigentuemer`}
                      label="EigentümerIn"
                      value={activeDataset.row.eigentuemer}
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
                      key={`${activeDataset.row.id}kontakt`}
                      label="Kontakt vor Ort"
                      value={activeDataset.row.kontakt}
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
                      key={`${activeDataset.row.id}nutzungszone`}
                      label="Nutzungszone"
                      value={activeDataset.row.nutzungszone}
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
                      key={`${activeDataset.row.id}bewirtschafter`}
                      label="BewirtschafterIn"
                      value={activeDataset.row.bewirtschafter}
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
                      key={`${activeDataset.row.id}bewirtschaftung`}
                      label="Bewirtschaftung"
                      value={activeDataset.row.bewirtschaftung}
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
                      key={`${activeDataset.row.id}bemerkungen`}
                      label="Bemerkungen"
                      value={activeDataset.row.bemerkungen}
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
