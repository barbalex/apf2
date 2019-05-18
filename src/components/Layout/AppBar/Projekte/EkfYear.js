import React, { useContext, useState, useCallback, useEffect } from 'react'
import Input from '@material-ui/core/Input'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import initiateDataFromUrl from '../../../../modules/initiateDataFromUrl'
import storeContext from '../../../../storeContext'

const StyledInput = styled(Input)`
  width: 60px;
  color: white !important;
  padding-left: 5px;
  > input {
    padding-top: 9px;
  }
  &:before {
    border: none !important;
  }
`
const Container = styled.div`
  display: flex;
  padding-left: 20px;
`
const Jahr = styled.p`
  margin-top: auto;
  margin-bottom: auto;
`

const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfRefYear = new Date(ekfRefDate).getFullYear()

const EkfYear = () => {
  const store = useContext(storeContext)
  const { ekfYear, setEkfYear } = store

  const [stateValue, setStateValue] = useState(
    ekfYear || ekfYear === 0 ? ekfYear : '',
  )

  useEffect(() => setStateValue(ekfYear), [ekfYear])

  const onChange = useCallback(event =>
    setStateValue(event.target.value ? +event.target.value : ''),
  )
  const onBlur = useCallback(
    event => {
      const newValue = event.target.value ? +event.target.value : ekfRefYear
      setEkfYear(newValue)
      if (ekfYear !== stateValue) {
        initiateDataFromUrl({
          activeNodeArray: ['Projekte'],
          store,
        })
      }
    },
    [ekfYear],
  )

  return (
    <Container>
      <Jahr>Jahr:</Jahr>
      <StyledInput
        value={stateValue}
        type="number"
        onChange={onChange}
        onBlur={onBlur}
        placeholder="Jahr"
      />
    </Container>
  )
}

export default observer(EkfYear)
