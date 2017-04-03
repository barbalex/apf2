// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
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
    let artwert = `Diese Art hat keinen Artwert`
    let artname = ``
    if (store.tree.activeNodes.ap && adb_eigenschaften.size > 0) {
      const ae = adb_eigenschaften.get(store.tree.activeNodes.ap)
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
  activeDataset,
  updateProperty,
  updatePropertyInDb,
  artwert,
  artname,
}) =>
  <Container>
    <FormTitle title="Art" />
    <Scrollbars>
      <FieldsContainer>
        <AutoComplete
          label="Art"
          fieldName="ApArtId"
          valueText={artname}
          errorText={activeDataset.valid.ApArtId}
          dataSource={store.dropdownList.artListForAp}
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
            value={artwert}
            type="text"
            disabled
          />
        </FieldContainer>
      </FieldsContainer>
    </Scrollbars>
  </Container>

Ap.propTypes = {
  store: PropTypes.object.isRequired,
  activeDataset: PropTypes.object.isRequired,
  updateProperty: PropTypes.func.isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
}

export default enhance(Ap)
