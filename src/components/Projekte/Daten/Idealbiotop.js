// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'

import TextField from '../../shared/TextField'
import DateFieldWithPicker from '../../shared/DateFieldWithPicker'
import FormTitle from '../../shared/FormTitle'
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
const Section = styled.div`
  padding-top: 20px;
  margin-bottom: -7px;
  color: rgba(255, 255, 255, 0.298039);
  font-weight: bold;
  &:after {
    content: ":";
  }
`

const enhance = compose(
  inject('store'),
  withState('width', 'changeWidth', 0),
  observer
)

class Idealbiotop extends Component {
  props: {
    store: Object,
    tree: Object,
    width: number,
    changeWidth: () => {},
  }

  updateWidth = () => {
    if (this.container && this.container.offsetWidth) {
      this.props.changeWidth(this.container.offsetWidth)
    }
  }

  componentDidMount() {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
  }

  componentDidUpdate() {
    // not sure if this is necessary
    this.updateWidth()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth)
  }

  render() {
    const { store, tree, width } = this.props
    const { activeDataset } = tree

    return (
      <Container
        // $FlowIssue
        innerRef={c => (this.container = c)}
      >
        <FormTitle tree={tree} title="Idealbiotop" />
        <FieldsContainer data-width={width}>
          <DateFieldWithPicker
            tree={tree}
            label="Erstelldatum"
            fieldName="IbErstelldatum"
            value={activeDataset.row.IbErstelldatum}
            errorText={activeDataset.valid.IbErstelldatum}
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Section>Lage</Section>
          <TextField
            tree={tree}
            label="Höhe"
            fieldName="IbHoehenlage"
            value={activeDataset.row.IbHoehenlage}
            errorText={activeDataset.valid.IbHoehenlage}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Region"
            fieldName="IbRegion"
            value={activeDataset.row.IbRegion}
            errorText={activeDataset.valid.IbRegion}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Exposition"
            fieldName="IbExposition"
            value={activeDataset.row.IbExposition}
            errorText={activeDataset.valid.IbExposition}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Besonnung"
            fieldName="IbBesonnung"
            value={activeDataset.row.IbBesonnung}
            errorText={activeDataset.valid.IbBesonnung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Hangneigung"
            fieldName="IbHangneigung"
            value={activeDataset.row.IbHangneigung}
            errorText={activeDataset.valid.IbHangneigung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Section>Boden</Section>
          <TextField
            tree={tree}
            label="Typ"
            fieldName="IbBodenTyp"
            value={activeDataset.row.IbBodenTyp}
            errorText={activeDataset.valid.IbBodenTyp}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Kalkgehalt"
            fieldName="IbBodenKalkgehalt"
            value={activeDataset.row.IbBodenKalkgehalt}
            errorText={activeDataset.valid.IbBodenKalkgehalt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Durchlässigkeit"
            fieldName="IbBodenDurchlaessigkeit"
            value={activeDataset.row.IbBodenDurchlaessigkeit}
            errorText={activeDataset.valid.IbBodenDurchlaessigkeit}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Humus"
            fieldName="IbBodenHumus"
            value={activeDataset.row.IbBodenHumus}
            errorText={activeDataset.valid.IbBodenHumus}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Nährstoffgehalt"
            fieldName="IbBodenNaehrstoffgehalt"
            value={activeDataset.row.IbBodenNaehrstoffgehalt}
            errorText={activeDataset.valid.IbBodenNaehrstoffgehalt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Wasserhaushalt"
            fieldName="IbWasserhaushalt"
            value={activeDataset.row.IbWasserhaushalt}
            errorText={activeDataset.valid.IbWasserhaushalt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Section>Vegetation</Section>
          <TextField
            tree={tree}
            label="Konkurrenz"
            fieldName="IbKonkurrenz"
            value={activeDataset.row.IbKonkurrenz}
            errorText={activeDataset.valid.IbKonkurrenz}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Moosschicht"
            fieldName="IbMoosschicht"
            value={activeDataset.row.IbMoosschicht}
            errorText={activeDataset.valid.IbMoosschicht}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Krautschicht"
            fieldName="IbKrautschicht"
            value={activeDataset.row.IbKrautschicht}
            errorText={activeDataset.valid.IbKrautschicht}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Strauchschicht"
            fieldName="IbStrauchschicht"
            value={activeDataset.row.IbStrauchschicht}
            errorText={activeDataset.valid.IbStrauchschicht}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Baumschicht"
            fieldName="IbBaumschicht"
            value={activeDataset.row.IbBaumschicht}
            errorText={activeDataset.valid.IbBaumschicht}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Bemerkungen"
            fieldName="IbBemerkungen"
            value={activeDataset.row.IbBemerkungen}
            errorText={activeDataset.valid.IbBemerkungen}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    )
  }
}

export default enhance(Idealbiotop)
