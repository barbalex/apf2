// seems not in use
import AsyncSelect from 'react-select/async'

import styles from './Select.module.css'

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
      className={styles.container}
      data-id={field}
      style={styleMeantForSelect}
    >
      {label && (
        <div
          className={styles.labelClass}
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
        className={`select-height-limited ${noCaret ? 'select-nocaret' : ''} ${styles.select}`}
      />
      {error && <div className={styles.errorClass}>{error}</div>}
    </div>
  )
}
