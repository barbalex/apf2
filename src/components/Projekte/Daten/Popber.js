import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  overflow-x: auto;
  height: 100%;
  padding-bottom: 95px;
`

const enhance = compose(
  inject(`store`),
  withProps((props) => {
    const { store } = props
    let popEntwicklungWerte = Array.from(store.table.pop_entwicklung_werte.values())
    popEntwicklungWerte = sortBy(popEntwicklungWerte, `EntwicklungOrd`)
    popEntwicklungWerte = popEntwicklungWerte.map(el => ({
      value: el.EntwicklungId,
      label: el.EntwicklungTxt,
    }))
    return { popEntwicklungWerte }
  }),
  observer
)

const Popber = ({
  store,
  popEntwicklungWerte,
}) => {
  const { activeDataset } = store
  return (
    <Container>
      <FormTitle title="Kontroll-Bericht Population" />
      <FieldsContainer>
        <TextField
          label="Jahr"
          fieldName="PopBerJahr"
          value={activeDataset.row.PopBerJahr}
          errorText={activeDataset.valid.PopBerJahr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <Label label="Entwicklung" />
        <RadioButtonGroup
          fieldName="PopBerEntwicklung"
          value={activeDataset.row.PopBerEntwicklung}
          errorText={activeDataset.valid.PopBerEntwicklung}
          dataSource={popEntwicklungWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Bemerkungen"
          fieldName="PopBerTxt"
          value={activeDataset.row.PopBerTxt}
          errorText={activeDataset.valid.PopBerTxt}
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

Popber.propTypes = {
  store: PropTypes.object.isRequired,
  popEntwicklungWerte: PropTypes.array.isRequired,
}

export default enhance(Popber)
