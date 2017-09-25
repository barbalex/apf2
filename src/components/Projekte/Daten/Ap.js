// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'

import AutoComplete from '../../shared/Autocomplete'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const LabelPopoverRow = styled.div`padding: 2px 5px 2px 5px;`
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
const LabelPopoverRowColumnLeft = styled.div`width: 110px;`
const LabelPopoverRowColumnRight = styled.div`padding-left: 5px;`

const getBearbName = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adressen } = store.dropdownList
  const { activeDataset } = tree
  let name = ''
  if (activeDataset.row.ApBearb && adressen.length > 0) {
    const adresse = adressen.find(a => a.AdrId === activeDataset.row.ApBearb)
    if (adresse && adresse.AdrName) return adresse.AdrName
  }
  return name
}

const enhance = compose(
  inject('store'),
  withProps(props => {
    const { store } = props
    const { updateProperty, updatePropertyInDb, table, tree } = store
    const { activeDataset, activeNodes } = tree
    const { adb_eigenschaften } = table
    let artwert = 'Diese Art hat keinen Artwert'
    let artname = ''
    if (activeNodes.ap && adb_eigenschaften.size > 0) {
      const ae = adb_eigenschaften.get(activeNodes.ap)
      if (ae && ae.Artwert) {
        artwert = ae.Artwert
      }
      if (ae && ae.Artname) {
        artname = ae.Artname
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
  <Container>
    <FormTitle tree={tree} title="Art" />
    <FieldsContainer>
      <AutoComplete
        key={activeDataset.row.ApArtId}
        tree={tree}
        label="Art"
        fieldName="ApArtId"
        valueText={artname}
        errorText={activeDataset.valid.ApArtId}
        dataSource={store.dropdownList.artListForAp}
        dataSourceConfig={{
          value: 'TaxonomieId',
          text: 'Artname',
        }}
        updatePropertyInDb={updatePropertyInDb}
      />
      <RadioButtonGroupWithInfo
        tree={tree}
        fieldName="ApStatus"
        value={activeDataset.row.ApStatus}
        dataSource={store.dropdownList.apStati}
        updatePropertyInDb={updatePropertyInDb}
        popover={
          <div>
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
          </div>
        }
        label="Aktionsplan"
      />
      <TextField
        tree={tree}
        label="Start im Jahr"
        fieldName="ApJahr"
        value={activeDataset.row.ApJahr}
        errorText={activeDataset.valid.ApJahr}
        type="number"
        updateProperty={updateProperty}
        updatePropertyInDb={updatePropertyInDb}
      />
      <FieldContainer>
        <RadioButtonGroupWithInfo
          tree={tree}
          fieldName="ApUmsetzung"
          value={activeDataset.row.ApUmsetzung}
          errorText={activeDataset.valid.ApUmsetzung}
          dataSource={store.dropdownList.apUmsetzungen}
          updatePropertyInDb={updatePropertyInDb}
          popover={
            <div>
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
            </div>
          }
          label="Stand Umsetzung"
        />
      </FieldContainer>
      <AutoComplete
        key={`${activeDataset.row.TPopKontrId}ApBearb`}
        tree={tree}
        label="Verantwortlich"
        fieldName="ApBearb"
        valueText={getBearbName({ store, tree })}
        errorText={activeDataset.valid.ApBearb}
        dataSource={store.dropdownList.adressen}
        dataSourceConfig={{
          value: 'AdrId',
          text: 'AdrName',
        }}
        updatePropertyInDb={store.updatePropertyInDb}
      />
      <FieldContainer>
        <TextField
          tree={tree}
          label="Artwert"
          fieldName="ApJahr"
          value={artwert}
          type="text"
          disabled
        />
      </FieldContainer>
    </FieldsContainer>
  </Container>
)

export default enhance(Ap)
