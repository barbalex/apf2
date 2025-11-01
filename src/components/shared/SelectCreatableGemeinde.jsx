import { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { IoMdLocate } from 'react-icons/io'

import { exists } from '../../modules/exists.js'
import {
  addLocationIcon,
  container,
  labelClass,
  errorClass,
  field,
  select,
  iconButton,
} from './SelectCreatableGemeinde.module.css'

export const SelectCreatableGemeinde = ({
  label,
  value,
  name,
  error,
  options: optionsIn,
  loading,
  showLocate,
  onClickLocate,
  maxHeight = null,
  noCaret = false,
  saveToDb,
}) => {
  const [stateValue, setStateValue] = useState(null)

  const onMyChange = (option) => {
    const fakeEvent = {
      target: {
        name,
        value: option ? option.value : null,
      },
    }
    saveToDb(fakeEvent)
  }

  const onInputChange = (value) => setStateValue(value)

  const onMyBlur = () => {
    if (stateValue) {
      const fakeEvent = {
        target: {
          name,
          value: stateValue,
        },
      }
      saveToDb(fakeEvent)
    }
  }

  useEffect(() => {
    setStateValue(value)
  }, [value])

  // need to add value to options list if it is not yet included
  const valuesArray = optionsIn.map((o) => o.value)
  const options = [...optionsIn]
  if (value && !valuesArray.includes(value)) {
    options.push({ label: value, value })
  }

  // filter out historic options - if they are not the value set
  const realOptions = options.filter((o) => {
    const dontShowHistoric = !exists(value) || value !== o.value
    if (dontShowHistoric) return !o.historic
    return true
  })

  // show ... while options are loading
  const loadingOptions = [{ value, label: '...' }]
  const optionsToUse = loading && value ? loadingOptions : realOptions
  const selectValue = optionsToUse.find((o) => o.value === value)

  const styleMeantForSelect =
    maxHeight ? { '--react-select-menu-list-max-height': `${maxHeight}px` } : {}

  return (
    <div
      className={container}
      data-id={name}
      style={styleMeantForSelect}
    >
      {label && (
        <div
          className={labelClass}
          style={{ color: error ? '#f44336' : 'rgb(0, 0, 0, 0.54)' }}
        >
          {label}
        </div>
      )}
      <div className={field}>
        <CreatableSelect
          id={name}
          name={name}
          value={selectValue}
          options={realOptions}
          onChange={onMyChange}
          onBlur={onMyBlur}
          onInputChange={onInputChange}
          hideSelectedOptions
          placeholder=""
          isClearable
          isSearchable
          noOptionsMessage={() => '(keine)'}
          maxheight={maxHeight}
          classNamePrefix="react-select"
          nocaret={noCaret}
          className={`select-height-limited ${noCaret ? 'select-nocaret' : ''} ${select}`}
        />
        {showLocate && (
          <Tooltip title="Mit Hilfe der Koordinaten automatisch setzen">
            <IconButton
              aria-label="Mit Hilfe der Koordinaten automatisch setzen"
              onClick={onClickLocate}
              className={iconButton}
            >
              <IoMdLocate className={addLocationIcon} />
            </IconButton>
          </Tooltip>
        )}
      </div>
      {error && <div className={errorClass}>{error}</div>}
    </div>
  )
}
