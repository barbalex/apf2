import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import Headdata from './Headdata'
import Besttime from './Besttime'
import Date from './Date'
import Map from './Map'
import Cover from './Cover'
import More from './More'
import Danger from './Danger'
import Remarks from './Remarks'
import EkfRemarks from './EkfRemarks'
import Verification from './Verification'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const FormContainer = styled.div`
  padding: 10px;
  width: 100%;
`
const GridContainer = styled.div`
  display: grid;
  grid-template-areas: ${(props) => {
    const { width } = props
    if (width < 600) {
      return `
        'title'
        'image'
        'headdata'
        'besttime'
        'date'
        'map'
        'count1'
        'count2'
        'count3'
        'cover'
        'more'
        'danger'
        'remarks'
        'ekfRemarks'
        'files'
        'verification'
      `
    }
    if (width < 800) {
      return `
        'title title'
        'image image'
        'headdata headdata'
        'besttime besttime'
        'date map'
        'count1 count1'
        'count2 count2'
        'count3 count3'
        'cover cover'
        'more more'
        'danger danger'
        'remarks remarks'
        'ekfRemarks ekfRemarks'
        'files files'
        'verification verification'
      `
    }
    return `
      'title title title image image image'
      'headdata headdata headdata image image image'
      'besttime besttime besttime image image image'
      'date date map image image image'
      'count1 count1 count2 count2 count3 count3'
      'cover cover cover more more more'
      'danger danger danger danger danger danger'
      'remarks remarks remarks remarks remarks remarks'
      'ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks'
      'files files files files files files'
      'verification verification verification verification verification verification'
    `
  }};
  grid-template-columns: ${(props) => {
    const { width } = props
    if (width < 600) return '1fr'
    if (width < 800) return 'repeat(2, 1fr)'
    return 'repeat(6, 1fr)'
  }};
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
  box-sizing: border-box;
  border-collapse: collapse;
  @media print {
    grid-template-areas:
      'title title title image image image'
      'headdata headdata headdata image image image'
      'besttime besttime besttime image image image'
      'date date map image image image'
      'count1 count1 count2 count2 count3 count3'
      'cover cover cover more more more'
      'danger danger danger danger danger danger'
      'remarks remarks remarks remarks remarks remarks'
      'ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks ekfRemarks';
    grid-template-columns: repeat(6, 1fr);
  }
`

const TpopfreiwkontrForm = ({ treeName, row, activeTab }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store
  const { formWidth: width } = store[treeName]

  const pop = row?.tpopByTpopId?.popByPopId ?? {}
  const tpop = row?.tpopByTpopId ?? {}

  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        treeName,
        table: 'tpopfreiwkontr',
        key: event.target.name,
        value: ifIsNumericAsNumber(event.target.value),
        index: activeTab,
      }),
    [activeTab, dataFilterSetValue, treeName],
  )

  return (
    <FormContainer>
      <GridContainer width={width}>
        <Headdata pop={pop} tpop={tpop} row={row} treeName={treeName} />
        <Besttime row={row} />
        <Date saveToDb={saveToDb} row={row} />
        <Map saveToDb={saveToDb} row={row} />
        <Cover saveToDb={saveToDb} row={row} />
        <More saveToDb={saveToDb} row={row} />
        <Danger saveToDb={saveToDb} row={row} />
        <Remarks saveToDb={saveToDb} row={row} />
        <EkfRemarks saveToDb={saveToDb} row={row} />
        <Verification saveToDb={saveToDb} row={row} />
      </GridContainer>
      <div style={{ height: '64px' }} />
    </FormContainer>
  )
}

export default observer(TpopfreiwkontrForm)
