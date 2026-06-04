import { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import { useApolloClient } from '@apollo/client/react'

import styles from './SelectLoadingOptionsTypable.module.css'

export const SelectLoadingOptionsTypable = ({
  row,
  field = '',
  label,
  error: saveToDbError,
  saveToDb,
  query,
  queryNodesName,
}) => {
  const apolloClient = useApolloClient()

  const [inputValue, setInputValue] = useState(row?.wirtspflanze || '')

  useEffect(() => {
    setInputValue(row?.wirtspflanze || '')
  }, [row?.wirtspflanze])

  const loadOptions = async (inputValue, cb) => {
    const filter =
      inputValue ?
        { artname: { includesInsensitive: inputValue } }
      : { artname: { isNull: false } }
    const { data } = await apolloClient.query({
      query,
      variables: {
        filter,
      },
    })
    const options = data?.[queryNodesName]?.nodes ?? []
    cb(options)
  }

  const onChange = (option) => {
    const value = option && option.value ? option.value : null
    const fakeEvent = {
      target: {
        name: 'wirtspflanze',
        value,
      },
    }
    saveToDb(fakeEvent)
  }

  const onInputChange = (value, { action }) => {
    // update inputValue when typing in the input
    if (!['input-blur', 'menu-close'].includes(action)) {
      if (!value) {
        // if inputValue was one character long, user must be deleting it
        // THIS IS A BAD HACK BUT NECCESSARY BECAUSE AFTER CHOOSING AN OPTION
        // onInputChange GETS A VALUE OF '', NOT THE OPTION CHOOSEN
        if (inputValue.length === 1) {
          onChange({ value: null, label: null })
        }
      }
      setInputValue(value)
    }
  }

  const onBlur = () => {
    if (inputValue) {
      onChange({ value: inputValue, label: inputValue })
    }
  }

  const value = {
    value: row?.wirtspflanze || '',
    label: row?.wirtspflanze || '',
  }

  return (
    <div
      className={styles.container}
      data-id={field}
    >
      {label && <div className={styles.labelClass}>{label}</div>}
      <AsyncSelect
        id={field}
        defaultOptions
        name={field}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        inputValue={inputValue || ''}
        hideSelectedOptions
        placeholder="(Für Vorschläge tippen)"
        isClearable
        // remove as can't select without typing
        nocaret
        // don't show a no options message
        noOptionsMessage={() => null}
        tabSelectsValue={false}
        // enable deleting typed values
        backspaceRemovesValue
        classNamePrefix="react-select"
        onInputChange={onInputChange}
        loadOptions={loadOptions}
      />
      {saveToDbError && (
        <div className={styles.errorClass}>{saveToDbError}</div>
      )}
    </div>
  )
}
