/**
 * This does not work as planned:
 * It loads 8 options at mount
 * BUT DOES NOT SHOW THEM WHEN USER ENTERS FIELD
 */

import AsyncSelect from 'react-select/async'
import { useApolloClient } from '@apollo/client/react'
import { get } from 'es-toolkit/compat'

import styles from './Select.module.css'

export const SelectLoadingOptions = ({
  row,
  valueLabelPath,
  valueLabel,
  field = '',
  label,
  labelSize,
  error: saveToDbError,
  saveToDb,
  query,
  filter,
  queryNodesName,
}) => {
  const apolloClient = useApolloClient()

  const loadOptions = async (inputValue, cb) => {
    const ownFilter =
      inputValue ?
        { artname: { includesInsensitive: inputValue } }
      : { artname: { isNull: false } }
    let result
    try {
      result = await apolloClient.query({
        query,
        variables: {
          filter: filter ? filter(inputValue) : ownFilter,
        },
      })
    } catch (error) {
      console.log({ error })
    }
    const { data } = result
    const options = data?.[queryNodesName]?.nodes ?? []
    cb(options)
  }

  const onChange = (option) => {
    const value = option && option.value ? option.value : null
    const fakeEvent = {
      target: {
        name: field,
        value,
      },
    }
    saveToDb(fakeEvent)
  }

  const value = {
    value: row[field] ?? '',
    label: valueLabel ? valueLabel : (get(row, valueLabelPath) ?? ''),
  }

  return (
    <div
      className={styles.container}
      data-id={field}
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
        defaultOptions
        name={field}
        onChange={onChange}
        value={value}
        hideSelectedOptions
        placeholder=""
        isClearable
        isSearchable
        // remove as can't select without typing
        nocaret
        // don't show a no options message if a value exists
        noOptionsMessage={() =>
          value.value ? null : '(Bitte Tippen für Vorschläge)'
        }
        // enable deleting typed values
        backspaceRemovesValue
        classNamePrefix="react-select"
        loadOptions={loadOptions}
        openMenuOnFocus
        className={`select-height-limited select-nocaret ${styles.select}`}
      />
      {saveToDbError && (
        <div className={styles.errorClass}>{saveToDbError}</div>
      )}
    </div>
  )
}
