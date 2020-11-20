/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useContext, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
//import styled from 'styled-components'
import upperFirst from 'lodash/upperFirst'

import storeContext from '../../../../storeContext'

const valForStore = (valPassed) => {
  let val = valPassed
  if (!val && val !== 0) val = null
  return val
}
const valForState = (valPassed) => {
  let val = valPassed
  if (!val && val !== 0) val = ''
  return val
}

const CellHeaderFixedTextFilter = ({ column, closeMenu }) => {
  const store = useContext(storeContext)
  const { name } = column

  const storeValue = store.ekPlan?.[`filter${upperFirst(name)}`]
  const storeSetFunction = store.ekPlan?.[`setFilter${upperFirst(name)}`]

  const [localValue, setLocalValue] = useState('')
  useEffect(() => {
    setLocalValue(valForState(storeValue))
  }, [name])
  //console.log('CellHeaderFixedTextFilter', { name, store, ekPlan: store.ekPlan })

  const onChange = useCallback((event) => {
    setLocalValue(valForState(event.target.value))
  }, [])
  const onBlur = useCallback((event) => {
    storeSetFunction(valForStore(event.target.value))
    closeMenu()
  }, [])

  return (
    <TextField
      label="Filter"
      size="small"
      value={localValue}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}

export default CellHeaderFixedTextFilter
