import ReactSelect from 'react-select'
import styled from '@emotion/styled'

import { exists } from '../../modules/exists.js'
import { container, labelClass, errorClass, select } from './Select.module.css'

export const Select = ({
  value,
  field = '',
  label,
  labelSize,
  name,
  error,
  options,
  loading,
  maxHeight = null,
  noCaret = false,
  saveToDb,
}) => {
  const onChange = (option) => {
    const fakeEvent = {
      target: {
        name,
        value: option ? option.value : null,
      },
    }
    saveToDb(fakeEvent)
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
      data-id={field}
      style={styleMeantForSelect}
    >
      {label && (
        <div
          className={labelClass}
          style={{ fontSize: labelSize ?? 12 }}
        >
          {label}
        </div>
      )}
      <ReactSelect
        id={field}
        name={field}
        value={selectValue}
        options={optionsToUse}
        onChange={onChange}
        onKeyDown={(e) => {
          // without stopping propagation, the event will bubble up to the parent
          // in the more menu typing a will shift focus to a menu starting with a
          e.stopPropagation()
        }}
        hideSelectedOptions
        placeholder=""
        isClearable
        isSearchable
        noOptionsMessage={() => '(keine)'}
        classNamePrefix="react-select"
        className={`select-height-limited ${noCaret ? 'select-nocaret' : ''} ${select}`}
      />
      {error && <div className={errorClass}>{error}</div>}
    </div>
  )
}
