/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input'
import Tooltip from '@mui/material/Tooltip'
import { MdClear } from 'react-icons/md'
import upperFirst from 'lodash/upperFirst'

import { MobxContext } from '../../../../storeContext.js'

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

export const TextFilter = ({ column, closeMenu }) => {
  const store = useContext(MobxContext)
  const { setFilterEmptyEkfrequenz, setFilterEmptyEkfrequenzStartjahr } =
    store.ekPlan
  const { name } = column

  const type =
    (
      [
        'popNr',
        'nr',
        'bekanntSeit',
        'lv95X',
        'lv95Y',
        'ekfrequenzStartjahr',
      ].includes(name)
    ) ?
      'number'
    : 'text'

  const storeValue = store.ekPlan?.[`filter${upperFirst(name)}`]
  const storeSetFunction = store.ekPlan?.[`setFilter${upperFirst(name)}`]

  const [localValue, setLocalValue] = useState('')
  useEffect(() => {
    setLocalValue(valForState(storeValue))
  }, [storeValue])

  const inputRef = useRef(null)

  const onChange = useCallback((event) => {
    setLocalValue(valForState(event.target.value))
  }, [])
  const onBlur = useCallback(
    (event) => {
      if (
        event.target.value != storeValue && // eslint-disable-line eqeqeq
        !(event.target.value === '' && storeValue === null)
      ) {
        storeSetFunction(valForStore(event.target.value))
        if (name === 'ekfrequenz') setFilterEmptyEkfrequenz(false)
        if (name === 'ekfrequenzStartjahr')
          setFilterEmptyEkfrequenzStartjahr(false)
        closeMenu()
      }
    },
    [storeValue, storeValue],
  )
  const onClickEmpty = useCallback(
    (event) => {
      // prevent blur event which would close menu
      event.stopPropagation()
      if (localValue) {
        setLocalValue('')
      }
      inputRef.current.focus()
    },
    [localValue],
  )
  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [inputRef.current])
  const onKeyDown = useCallback((event) => {
    // need to stop propagation
    // menu focuses next label if that's first character is pressed
    // this blurs the textfield, so the filter can't be entered
    // See: https://github.com/mui/material-ui/issues/36133
    // https://github.com/barbalex/apf2/issues/609
    event.stopPropagation()
    if (event.key === 'Enter') {
      onBlur(event)
    }
  }, [])

  return (
    <FormControl>
      <InputLabel
        htmlFor="EkPlanHeaderFilter"
        variant="standard"
      >
        Filter
      </InputLabel>
      <Input
        id="EkPlanHeaderFilter"
        inputRef={inputRef}
        type={type}
        value={localValue}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        endAdornment={
          <InputAdornment position="end">
            <Tooltip title="Filter leeren">
              <IconButton
                aria-label="Filter leeren"
                onClick={onClickEmpty}
                size="large"
              >
                <MdClear />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}
