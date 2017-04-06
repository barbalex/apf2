// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Scrollbars } from 'react-custom-scrollbars'

import TextField from '../../shared/TextField'
import InfoWithPopover from '../../shared/InfoWithPopover'
import Status from '../../shared/Status'
import RadioButton from '../../shared/RadioButton'
import Label from '../../shared/Label'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 45px;
`
const PopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const PopoverContentRow = styled(PopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  &:first-child {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const FieldWithInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Pop = ({ store, tree }) => {
  const { activeDataset } = tree
  const apJahr = store.table.ap.get(activeDataset.row.ApArtId).ApJahr
  return (
    <Container>
      <FormTitle tree={tree} title="Population" />
      <Scrollbars>
        <FieldsContainer>
          <TextField
            tree={tree}
            label="Nr."
            fieldName="PopNr"
            value={activeDataset.row.PopNr}
            errorText={activeDataset.valid.PopNr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <FieldWithInfoContainer>
            <TextField
              tree={tree}
              label="Name"
              fieldName="PopName"
              value={activeDataset.row.PopName}
              errorText={activeDataset.valid.PopName}
              type="text"
              updateProperty={store.updateProperty}
              updatePropertyInDb={store.updatePropertyInDb}
            />
            <InfoWithPopover>
              <PopoverContentRow>
                Dieses Feld möglichst immer ausfüllen
              </PopoverContentRow>
            </InfoWithPopover>
          </FieldWithInfoContainer>
          <Status
            tree={tree}
            apJahr={apJahr}
            herkunftFieldName="PopHerkunft"
            herkunftValue={activeDataset.row.PopHerkunft}
            bekanntSeitFieldName="PopBekanntSeit"
            bekanntSeitValue={activeDataset.row.PopBekanntSeit}
            bekanntSeitValid={activeDataset.valid.PopBekanntSeit}
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Label label="Status unklar" />
          <RadioButton
            tree={tree}
            fieldName="PopHerkunftUnklar"
            value={activeDataset.row.PopHerkunftUnklar}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Begründung"
            fieldName="PopHerkunftUnklarBegruendung"
            value={activeDataset.row.PopHerkunftUnklarBegruendung}
            errorText={activeDataset.valid.PopHerkunftUnklarBegruendung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="X-Koordinaten"
            fieldName="PopXKoord"
            value={activeDataset.row.PopXKoord}
            errorText={activeDataset.valid.PopXKoord}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Y-Koordinaten"
            fieldName="PopYKoord"
            value={activeDataset.row.PopYKoord}
            errorText={activeDataset.valid.PopYKoord}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Scrollbars>
    </Container>
  )
}

Pop.propTypes = {
  store: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired,
}

export default enhance(Pop)
