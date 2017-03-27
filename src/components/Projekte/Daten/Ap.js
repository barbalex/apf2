// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { Scrollbars } from 'react-custom-scrollbars'

import AutoComplete from '../../shared/Autocomplete'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import SelectField from '../../shared/SelectField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 45px;
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

const enhance = compose(
  inject(`store`),
  withProps((props) => {
    const { store } = props
    const {
      activeDataset,
      updateProperty,
      updatePropertyInDb,
    } = store
    const { adb_eigenschaften } = store.table
    const alreadyUsedApIds = Array.from(store.table.ap.keys()).map(a => Number(a))
    // let user choose this ApArtId
    const apArtIdsNotToShow = alreadyUsedApIds
      .filter(r => r !== store.activeUrlElements.ap)
    let artList = filter(
      Array.from(adb_eigenschaften.values()),
      r => !apArtIdsNotToShow.includes(r.TaxonomieId)
    )
    artList = sortBy(artList, `Artname`)
    let artwert = `Diese Art hat keinen Artwert`
    let artname = ``
    if (store.activeUrlElements.ap && adb_eigenschaften.size > 0) {
      const ae = adb_eigenschaften.get(store.activeUrlElements.ap)
      if (ae && ae.Artwert) {
        artwert = ae.Artwert
      }
      if (ae && ae.Artname) {
        artname = ae.Artname
      }
    }
    const artValues = { artwert, artname }
    return {
      artList,
      artValues,
      activeDataset,
      updateProperty,
      updatePropertyInDb,
    }
  }),
  observer
)

const Ap = ({
  store,
  activeDataset,
  updateProperty,
  updatePropertyInDb,
  artList,
  artValues,
}) =>
  <Container>
    <FormTitle title="Art" />
    <Scrollbars>
      <FieldsContainer>
        <AutoComplete
          label="Art"
          fieldName="ApArtId"
          valueText={artValues.artname}
          errorText={activeDataset.valid.ApArtId}
          dataSource={artList}
          dataSourceConfig={{
            value: `TaxonomieId`,
            text: `Artname`,
          }}
          updatePropertyInDb={updatePropertyInDb}
        />
        <FieldContainer>
          <Label label="Aktionsplan" />
          <RadioButtonGroupWithInfo
            fieldName="ApStatus"
            value={activeDataset.row.ApStatus}
            dataSource={store.dropdownList.apStati}
            updatePropertyInDb={updatePropertyInDb}
            popover={
              <div>
                <LabelPopoverTitleRow>
                  Legende
                </LabelPopoverTitleRow>
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
              </div>
            }
          />
        </FieldContainer>
        <TextField
          label="Start im Jahr"
          fieldName="ApJahr"
          value={activeDataset.row.ApJahr}
          errorText={activeDataset.valid.ApJahr}
          type="number"
          updateProperty={updateProperty}
          updatePropertyInDb={updatePropertyInDb}
        />
        <FieldContainer>
          <Label label="Stand Umsetzung" />
          <RadioButtonGroupWithInfo
            fieldName="ApUmsetzung"
            value={activeDataset.row.ApUmsetzung}
            errorText={activeDataset.valid.ApUmsetzung}
            dataSource={store.dropdownList.apUmsetzungen}
            updatePropertyInDb={updatePropertyInDb}
            popover={
              <div>
                <LabelPopoverTitleRow>
                  Legende
                </LabelPopoverTitleRow>
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
                    bereits Massnahmen ausgeführt (auch wenn AP noch nicht erstellt)
                  </LabelPopoverRowColumnRight>
                </LabelPopoverContentRow>
              </div>
            }
          />
        </FieldContainer>
        <SelectField
          label="Verantwortlich"
          fieldName="ApBearb"
          value={activeDataset.row.ApBearb}
          errorText={activeDataset.valid.ApBearb}
          dataSource={store.dropdownList.adressen}
          valueProp="AdrId"
          labelProp="AdrName"
          updatePropertyInDb={updatePropertyInDb}
        />
        <FieldContainer>
          <TextField
            label="Artwert"
            fieldName="ApJahr"
            value={artValues.artwert}
            type="text"
            disabled
          />
        </FieldContainer>
      </FieldsContainer>
    </Scrollbars>
  </Container>

Ap.propTypes = {
  store: PropTypes.object.isRequired,
  artList: PropTypes.array.isRequired,
  artValues: PropTypes.object.isRequired,
  activeDataset: PropTypes.object.isRequired,
  updateProperty: PropTypes.func.isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
}

export default enhance(Ap)
