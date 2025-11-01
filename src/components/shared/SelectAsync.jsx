// seems not in use
import AsyncSelect from 'react-select/async'

import { container, labelClass, errorClass, select } from './Select.module.css'

export const SelectAsync = ({
  value,
  field = '',
  label,
  labelSize,
  name,
  error,
  loadOptions,
  setInputValue,
  maxHeight = null,
  noCaret = false,
  saveToDb,
}) => {
  const onInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '')
    setInputValue(inputValue)
    loadOptions(inputValue)

    return inputValue
  }

  const onChange = (option) => {
    const fakeEvent = {
      target: {
        name,
        value: option ? option.value : null,
      },
    }
    saveToDb(fakeEvent)
  }

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
      <AsyncSelect
        id={field}
        name={field}
        onChange={onChange}
        hideSelectedOptions
        placeholder=""
        isClearable
        isSearchable
        noOptionsMessage={() => '(keine)'}
        classNamePrefix="react-select"
        onInputChange={onInputChange}
        className={`select-height-limited ${noCaret ? 'select-nocaret' : ''} ${select}`}
      />
      {error && <div className={errorClass}>{error}</div>}
    </div>
  )
}
