// @flow
import React, { Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import apByIdGql from './apById.graphql'
import updateApByIdGql from './updateApById.graphql'

import AutoComplete from '../../../shared/AutocompleteGql'
import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfoGql'
import TextField from '../../../shared/TextFieldGql'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #565656;
  color: white;
`
const LabelPopoverContentRow = styled(LabelPopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-top-style: none;
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const LabelPopoverRowColumnLeft = styled.div`
  width: 110px;
`
const LabelPopoverRowColumnRight = styled.div`
  padding-left: 5px;
`

const getBearbName = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adressen } = store.dropdownList
  const { activeDataset } = tree
  let name = ''
  if (row.bearbeiter && adressen.length > 0) {
    const adresse = adressen.find(a => a.id === row.bearbeiter)
    if (adresse && adresse.name) return adresse.name
  }
  return name
}

const enhance = compose(
  inject('store'),
  withProps(props => {
    const { store } = props
    const { updateProperty, updatePropertyInDb, table, tree } = store
    const { activeDataset, activeNodes } = tree
    const { ae_eigenschaften, ap } = table
    let artwert = 'Diese Art hat keinen Artwert'
    let artname = ''
    if (activeNodes.ap && ae_eigenschaften.size > 0) {
      const apArt = ap.get(activeNodes.ap).art_id
      const ae = ae_eigenschaften.get(apArt)
      if (ae && ae.artwert) {
        artwert = ae.artwert
      }
      if (ae && ae.artname) {
        artname = ae.artname
      }
    }
    return {
      artwert,
      artname,
      activeDataset,
      updateProperty,
      updatePropertyInDb,
    }
  }),
  observer
)

const Ap = ({
  id,
  store,
  tree,
  activeDataset,
  updateProperty,
  updatePropertyInDb,
  artwert,
  artname,
}: {
  id: String,
  store: Object,
  tree: Object,
  activeDataset: Object,
  updateProperty: () => void,
  updatePropertyInDb: () => void,
  artwert?: number,
  artname?: string,
}) => (
  <Query query={apByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'apById')
      let bearbeitungWerte = get(data, 'allApBearbstandWertes.nodes', [])
      bearbeitungWerte = sortBy(bearbeitungWerte, 'sort')
      bearbeitungWerte = bearbeitungWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))
      let umsetzungWerte = get(data, 'allApUmsetzungWertes.nodes', [])
      umsetzungWerte = sortBy(umsetzungWerte, 'sort')
      umsetzungWerte = umsetzungWerte.map(el => ({
        value: el.code,
        label: el.text,
      }))
      let adressenWerte = get(data, 'allAdresses.nodes', [])
      adressenWerte = sortBy(adressenWerte, 'name')
      adressenWerte = adressenWerte.map(el => ({
        id: el.id,
        value: el.name,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={id} title="Art" />
            <Mutation mutation={updateApByIdGql}>
              {(updateAp, { data }) => (
                <FieldsContainer>
                  <AutoComplete
                    key={`${row.id}artId`}
                    label="Art (gibt dem Aktionsplan den Namen)"
                    value={artname}
                    objects={store.dropdownList.artListForAp}
                    saveToDb={value =>
                      updateAp({
                        variables: {
                          id,
                          artId: value,
                        },
                      })
                    }
                  />
                  <RadioButtonGroupWithInfo
                    key={`${row.id}bearbeitung`}
                    value={row.bearbeitung}
                    dataSource={bearbeitungWerte}
                    saveToDb={value =>
                      updateAp({
                        variables: {
                          id,
                          bearbeitung: value,
                        },
                      })
                    }
                    popover={
                      <Fragment>
                        <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
                        <LabelPopoverContentRow>
                          <LabelPopoverRowColumnLeft>
                            keiner:
                          </LabelPopoverRowColumnLeft>
                          <LabelPopoverRowColumnRight>
                            kein Aktionsplan vorgesehen
                          </LabelPopoverRowColumnRight>
                        </LabelPopoverContentRow>
                        <LabelPopoverContentRow>
                          <LabelPopoverRowColumnLeft>
                            erstellt:
                          </LabelPopoverRowColumnLeft>
                          <LabelPopoverRowColumnRight>
                            Aktionsplan fertig, auf der Webseite der FNS
                          </LabelPopoverRowColumnRight>
                        </LabelPopoverContentRow>
                      </Fragment>
                    }
                    label="Aktionsplan"
                  />
                  <TextField
                    key={`${row.id}startJahr`}
                    label="Start im Jahr"
                    value={row.startJahr}
                    type="number"
                    saveToDb={event =>
                      updateAp({
                        variables: {
                          id,
                          startJahr: event.target.value,
                        },
                      })
                    }
                  />
                  <FieldContainer>
                    <RadioButtonGroupWithInfo
                      key={`${row.id}umsetzung`}
                      value={row.umsetzung}
                      dataSource={umsetzungWerte}
                      saveToDb={value =>
                        updateAp({
                          variables: {
                            id,
                            umsetzung: value,
                          },
                        })
                      }
                      popover={
                        <Fragment>
                          <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
                          <LabelPopoverContentRow>
                            <LabelPopoverRowColumnLeft>
                              noch keine<br />Umsetzung:
                            </LabelPopoverRowColumnLeft>
                            <LabelPopoverRowColumnRight>
                              noch keine Massnahmen ausgeführt
                            </LabelPopoverRowColumnRight>
                          </LabelPopoverContentRow>
                          <LabelPopoverContentRow>
                            <LabelPopoverRowColumnLeft>
                              in Umsetzung:
                            </LabelPopoverRowColumnLeft>
                            <LabelPopoverRowColumnRight>
                              bereits Massnahmen ausgeführt (auch wenn AP noch
                              nicht erstellt)
                            </LabelPopoverRowColumnRight>
                          </LabelPopoverContentRow>
                        </Fragment>
                      }
                      label="Stand Umsetzung"
                    />
                  </FieldContainer>
                  <AutoComplete
                    key={`${row.id}bearbeiter`}
                    label="Verantwortlich"
                    value={get(data, 'apById.adresseByBearbeiter.name', null)}
                    objects={adressenWerte}
                    saveToDb={value =>
                      updateAp({
                        variables: {
                          id,
                          bearbeiter: value,
                        },
                      })
                    }
                    openabove
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

export default enhance(Ap)
