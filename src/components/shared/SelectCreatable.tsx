// seems not in use
import { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'
import { observer } from 'mobx-react-lite'

import { exists } from '../../modules/exists.ts'
import styles from './Select.module.css'

export const SelectCreatable = observer(
  ({
    value,
    field = '',
    label,
    name,
    error,
    options: optionsIn,
    loading,
    maxHeight = null,
    noCaret = false,
    saveToDb,
  }) => {
    const [stateValue, setStateValue] = useState(null)

    const onChange = (option) => {
      const fakeEvent = {
        target: {
          name,
          value: option ? option.value : null,
        },
      }
      saveToDb(fakeEvent)
    }

    const onInputChange = (value) => setStateValue(value)

    const onBlur = () => {
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
      maxHeight ?
        { '--react-select-menu-list-max-height': `${maxHeight}px` }
      : {}

    return (
      <div
        className={styles.container}
        style={styleMeantForSelect}
      >
        {label && <div className={styles.labelClass}>{label}</div>}
        <CreatableSelect
          id={field}
          name={field}
          defaultValue={selectValue}
          options={realOptions}
          onChange={onChange}
          onBlur={onBlur}
          onInputChange={onInputChange}
          hideSelectedOptions
          placeholder=""
          isClearable
          isSearchable
          noOptionsMessage={() => '(keine)'}
          classNamePrefix="react-select"
          className={`select-height-limited ${noCaret ? 'select-nocaret' : ''} ${styles.select}`}
        />
        {error && <div className={styles.errorClass}>{error}</div>}
      </div>
    )
  },
)
