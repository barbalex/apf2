import { useState, useEffect } from 'react'
import Input from '@mui/material/Input'
import Tooltip from '@mui/material/Tooltip'
import { useParams, useNavigate, useLocation } from 'react-router'

import { input, container, jahr } from './EkfYear.module.css'

const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfRefYear = new Date(ekfRefDate).getFullYear()

export const EkfYear = () => {
  const { search } = useLocation()
  const { ekfYear, userId } = useParams()
  const navigate = useNavigate()

  const [stateValue, setStateValue] = useState(ekfYear ?? '')

  useEffect(() => setStateValue(ekfYear), [ekfYear])

  const onBlur = (event) => {
    const newValue = event.target.value ? +event.target.value : ekfRefYear
    navigate(`/Daten/Benutzer/${userId}/EKF/${newValue}${search}`)
  }

  const onChange = (event) => {
    setStateValue(event.target.value ? +event.target.value : '')
    if (event.target.value.length === 4) onBlur(event)
  }

  return (
    <Tooltip title="Zu kontrollierendes Jahr wählen">
      <div className={container}>
        <p className={jahr}>Jahr:</p>
        <Input
          value={stateValue}
          type="number"
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Jahr"
          className={input}
        />
      </div>
    </Tooltip>
  )
}
