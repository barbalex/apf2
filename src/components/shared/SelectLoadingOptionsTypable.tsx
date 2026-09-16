import { useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import { useApolloClient } from '@apollo/client/react'
import type { DocumentNode } from '@apollo/client'

import type { SaveToDbHandler } from './types.ts'

import styles from './SelectLoadingOptionsTypable.module.css'

interface TypableOption {
  value: string | null
  label: string | null
}

interface TypableNodes {
  nodes?: { value: string; label: string }[]
}

export interface SelectLoadingOptionsTypableProps {
  row?: object | null | undefined
  field?: string
  label?: string | undefined
  error?: string | null | undefined
  saveToDb: SaveToDbHandler
  query: DocumentNode
  queryNodesName: string
}

export const SelectLoadingOptionsTypable = ({
  row,
  field = '',
  label,
  error: saveToDbError,
  saveToDb,
  query,
  queryNodesName,
}: SelectLoadingOptionsTypableProps) => {
  const apolloClient = useApolloClient()
  const wirtspflanze = (row as { wirtspflanze?: string | null } | null | undefined)
    ?.wirtspflanze

  const [inputValue, setInputValue] = useState(wirtspflanze || '')

  useEffect(() => {
    setInputValue(wirtspflanze || '')
  }, [wirtspflanze])

  const loadOptions = async (inputValue: string) => {
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
    const options =
      (
        (data as Record<string, unknown> | undefined)?.[
          queryNodesName
        ] as TypableNodes | undefined
      )?.nodes ?? []
    return options
  }

  const onChange = (option: TypableOption | null) => {
    const value = option && option.value ? option.value : null
    const fakeEvent = {
      target: {
        name: 'wirtspflanze',
        value,
      },
    }
    void saveToDb(fakeEvent)
  }

  const onInputChange = (
    value: string,
    { action }: { action: string },
  ) => {
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
    value: wirtspflanze || '',
    label: wirtspflanze || '',
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
