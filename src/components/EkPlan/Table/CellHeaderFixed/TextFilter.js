/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useContext, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import { MdClear } from 'react-icons'
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
  const onClickEmpty = useCallback((event) => {
    storeSetFunction(null)
  }, [])

  return (
    <FormControl>
      <InputLabel htmlFor="EkPlanHeaderFilter">Filter</InputLabel>
      <Input
        id="EkPlanHeaderFilter"
        value={localValue}
        onChange={onChange}
        onBlur={onBlur}
        endAdornment={
          !!localValue ? (
            <InputAdornment position="end">
              <IconButton aria-label="Filter leeren" onClick={onClickEmpty}>
                <MdClear />
              </IconButton>
            </InputAdornment>
          ) : (
            <InputAdornment position="end">
              <div />
            </InputAdornment>
          )
        }
      />
    </FormControl>
  )
}

export default CellHeaderFixedTextFilter
