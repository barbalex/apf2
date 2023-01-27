import React, { useState, useCallback, useEffect } from 'react'
import Input from '@mui/material/Input'
import styled from '@emotion/styled'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

const StyledInput = styled(Input)`
  width: 60px;
  color: white !important;
  padding-left: 5px;
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
  const { search } = useLocation()
  const { ekfYear, userId } = useParams()
  const navigate = useNavigate()

  const [stateValue, setStateValue] = useState(ekfYear ?? '')

  useEffect(() => setStateValue(ekfYear), [ekfYear])

  const onChange = useCallback(
    (event) => setStateValue(event.target.value ? +event.target.value : ''),
    [],
  )
  const onBlur = useCallback(
    (event) => {
      const newValue = event.target.value ? +event.target.value : ekfRefYear
      navigate(`/Daten/Benutzer/${userId}/EKF/${newValue}${search}`)
    },
    [navigate, search, userId],
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

export default EkfYear
