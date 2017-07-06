// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import SelectField from '../../shared/SelectField'
import RadioButton from '../../shared/RadioButton'
import StringToCopy from '../../shared/StringToCopy'
import FormTitle from '../../shared/FormTitle'
import YearDatePair from '../../shared/YearDatePair'
import constants from '../../../modules/constants'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(
  inject('store'),
  withState('width', 'changeWidth', 0),
  withHandlers({
    onNewRequestWirtspflanze: props => val =>
      props.store.updatePropertyInDb(
        props.tree,
        'TPopMassnAnsiedWirtspfl',
        val
      ),
    onBlurWirtspflanze: props => e =>
      props.store.updatePropertyInDb(
        props.tree,
        'TPopMassnAnsiedWirtspfl',
        e.target.value
      ),
  }),
  observer
)

class Tpopmassn extends Component {
  props: {
    store: Object,
    tree: Object,
    onNewRequestWirtspflanze: () => void,
    onBlurWirtspflanze: () => void,
    width: number,
    changeWidth: () => {},
  }

  updateWidth = () => {
    console.log('updateWidth')
    if (this.container && this.container.offsetWidth) {
      this.props.changeWidth(this.container.offsetWidth)
    }
  }

  componentDidMount() {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth)
  }

  render() {
    const {
      store,
      tree,
      onNewRequestWirtspflanze,
      onBlurWirtspflanze,
      width,
    } = this.props
    const { activeDataset } = tree

    return (
      <Container
        innerRef={c => {
          // $FlowIssue
          this.container = c
        }}
      >
        <FormTitle tree={tree} title="Massnahme" />
        <FieldsContainer data-width={width}>
          <YearDatePair
            tree={tree}
            yearLabel="Jahr"
            yearFieldName="TPopMassnJahr"
            yearValue={activeDataset.row.TPopMassnJahr}
            yearErrorText={activeDataset.valid.TPopMassnJahr}
            dateLabel="Datum"
            dateFieldName="TPopMassnDatum"
            dateValue={activeDataset.row.TPopMassnDatum}
            dateErrorText={activeDataset.valid.TPopMassnDatum}
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="TPopMassnTyp"
            label="Typ"
            value={activeDataset.row.TPopMassnTyp}
            errorText={activeDataset.valid.TPopMassnTyp}
            dataSource={store.dropdownList.tpopMassnTypWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Massnahme"
            fieldName="TPopMassnTxt"
            value={activeDataset.row.TPopMassnTxt}
            errorText={activeDataset.valid.TPopMassnTxt}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <SelectField
            tree={tree}
            label="BearbeiterIn"
            fieldName="TPopMassnBearb"
            value={activeDataset.row.TPopMassnBearb}
            errorText={activeDataset.valid.TPopMassnBearb}
            dataSource={store.dropdownList.adressen}
            valueProp="AdrId"
            labelProp="AdrName"
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Bemerkungen"
            fieldName="TPopMassnBemTxt"
            value={activeDataset.row.TPopMassnBemTxt}
            errorText={activeDataset.valid.TPopMassnBemTxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButton
            tree={tree}
            fieldName="TPopMassnPlan"
            label="Plan vorhanden"
            value={activeDataset.row.TPopMassnPlan}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Plan Bezeichnung"
            fieldName="TPopMassnPlanBez"
            value={activeDataset.row.TPopMassnPlanBez}
            errorText={activeDataset.valid.TPopMassnPlanBez}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Fläche (m2)"
            fieldName="TPopMassnFlaeche"
            value={activeDataset.row.TPopMassnFlaeche}
            errorText={activeDataset.valid.TPopMassnFlaeche}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Form der Ansiedlung"
            fieldName="TPopMassnAnsiedForm"
            value={activeDataset.row.TPopMassnAnsiedForm}
            errorText={activeDataset.valid.TPopMassnAnsiedForm}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Pflanzanordnung"
            fieldName="TPopMassnAnsiedPflanzanordnung"
            value={activeDataset.row.TPopMassnAnsiedPflanzanordnung}
            errorText={activeDataset.valid.TPopMassnAnsiedPflanzanordnung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Markierung"
            fieldName="TPopMassnMarkierung"
            value={activeDataset.row.TPopMassnMarkierung}
            errorText={activeDataset.valid.TPopMassnMarkierung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Anzahl Triebe"
            fieldName="TPopMassnAnsiedAnzTriebe"
            value={activeDataset.row.TPopMassnAnsiedAnzTriebe}
            errorText={activeDataset.valid.TPopMassnAnsiedAnzTriebe}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Anzahl Pflanzen"
            fieldName="TPopMassnAnsiedAnzPfl"
            value={activeDataset.row.TPopMassnAnsiedAnzPfl}
            errorText={activeDataset.valid.TPopMassnAnsiedAnzPfl}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Anzahl Pflanzstellen"
            fieldName="TPopMassnAnzPflanzstellen"
            value={activeDataset.row.TPopMassnAnzPflanzstellen}
            errorText={activeDataset.valid.TPopMassnAnzPflanzstellen}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <AutoComplete
            floatingLabelText="Wirtspflanze"
            fullWidth
            value={activeDataset.row.TPopMassnAnsiedWirtspfl || ''}
            searchText={activeDataset.row.TPopMassnAnsiedWirtspfl || ''}
            errorText={activeDataset.valid.TPopMassnAnsiedWirtspfl}
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={store.dropdownList.artnamen}
            maxSearchResults={20}
            onNewRequest={onNewRequestWirtspflanze}
            onBlur={onBlurWirtspflanze}
          />
          <TextField
            tree={tree}
            label="Herkunftspopulation"
            fieldName="TPopMassnAnsiedHerkunftPop"
            value={activeDataset.row.TPopMassnAnsiedHerkunftPop}
            errorText={activeDataset.valid.TPopMassnAnsiedHerkunftPop}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Sammeldatum"
            fieldName="TPopMassnAnsiedDatSamm"
            value={activeDataset.row.TPopMassnAnsiedDatSamm}
            errorText={activeDataset.valid.TPopMassnAnsiedDatSamm}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <StringToCopy text={activeDataset.row.TPopMassnGuid} label="GUID" />
        </FieldsContainer>
      </Container>
    )
  }
}

export default enhance(Tpopmassn)
