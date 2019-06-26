import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import Select from '../../../../shared/SelectFormik'

const EinheitVal = styled.div`
  grid-area: einheitVal;
  > div {
    margin-top: -5px;
    padding-bottom: 0;
    @media print {
      margin-bottom: 0;
    }
  }
  @media print {
    input {
      font-size: 11px;
    }
  }
`
const Label = styled.div`
  font-weight: 700;
`
const EinheitLabel = styled(Label)`
  grid-area: einheitLabel;
  hyphens: auto;
  margin-top: 5px;
`

const Einheit = ({ nr, ...rest }) => {
  return (
    <>
      <EinheitLabel>{`Zähleinheit ${nr}`}</EinheitLabel>
      <EinheitVal>
        <Select {...rest} />
      </EinheitVal>
    </>
  )
}

export default observer(Einheit)
