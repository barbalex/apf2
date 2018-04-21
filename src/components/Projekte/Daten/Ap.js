// @flow
import React, { Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'

import AutoComplete from '../../shared/Autocomplete'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'
import ErrorBoundary from '../../shared/ErrorBoundary'

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
  background-color: grey;
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
  if (activeDataset.row.bearbeiter && adressen.length > 0) {
    const adresse = adressen.find(a => a.id === activeDataset.row.bearbeiter)
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
  store,
  tree,
  activeDataset,
  updateProperty,
  updatePropertyInDb,
  artwert,
  artname,
}: {
  store: Object,
  tree: Object,
  activeDataset: Object,
  updateProperty: () => void,
  updatePropertyInDb: () => void,
  artwert?: number,
  artname?: string,
}) => (
  <ErrorBoundary>
    <Container>
      <FormTitle tree={tree} title="Art" />
      <FieldsContainer>
        <AutoComplete
          key={`${activeDataset.row.id}art_id`}
          tree={tree}
          label="Art (gibt dem Aktionsplan den Namen)"
          fieldName="art_id"
          value={artname}
          objects={store.dropdownList.artListForAp}
          updatePropertyInDb={updatePropertyInDb}
        />
        <RadioButtonGroupWithInfo
          tree={tree}
          fieldName="bearbeitung"
          value={activeDataset.row.bearbeitung}
          dataSource={store.dropdownList.apStati}
          updatePropertyInDb={updatePropertyInDb}
          popover={
            <Fragment>
              <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
              <LabelPopoverContentRow>
                <LabelPopoverRowColumnLeft>keiner:</LabelPopoverRowColumnLeft>
                <LabelPopoverRowColumnRight>
                  kein Aktionsplan vorgesehen
                </LabelPopoverRowColumnRight>
              </LabelPopoverContentRow>
              <LabelPopoverContentRow>
                <LabelPopoverRowColumnLeft>erstellt:</LabelPopoverRowColumnLeft>
                <LabelPopoverRowColumnRight>
                  Aktionsplan fertig, auf der Webseite der FNS
                </LabelPopoverRowColumnRight>
              </LabelPopoverContentRow>
            </Fragment>
          }
          label="Aktionsplan"
        />
        <TextField
          key={`${activeDataset.row.id}start_jahr`}
          tree={tree}
          label="Start im Jahr"
          fieldName="start_jahr"
          value={activeDataset.row.start_jahr}
          errorText={activeDataset.valid.start_jahr}
          type="number"
          updateProperty={updateProperty}
          updatePropertyInDb={updatePropertyInDb}
        />
        <FieldContainer>
          <RadioButtonGroupWithInfo
            tree={tree}
            fieldName="umsetzung"
            value={activeDataset.row.umsetzung}
            errorText={activeDataset.valid.umsetzung}
            dataSource={store.dropdownList.apUmsetzungen}
            updatePropertyInDb={updatePropertyInDb}
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
                    bereits Massnahmen ausgeführt (auch wenn AP noch nicht
                    erstellt)
                  </LabelPopoverRowColumnRight>
                </LabelPopoverContentRow>
              </Fragment>
            }
            label="Stand Umsetzung"
          />
        </FieldContainer>
        <AutoComplete
          key={`${activeDataset.row.id}bearbeiter`}
          tree={tree}
          label="Verantwortlich"
          fieldName="bearbeiter"
          value={getBearbName({ store, tree })}
          objects={store.dropdownList.adressen}
          updatePropertyInDb={updatePropertyInDb}
          openabove
        />
      </FieldsContainer>
    </Container>
  </ErrorBoundary>
)

export default enhance(Ap)
