import { useState } from 'react'
import AsyncSelect from 'react-select/async'

import type { SaveToDbHandler } from './types.ts'

import { apiFetch } from '../../modules/api.ts'
import styles from './SelectLoadingOptionsTypable.module.css'

interface TypableOption {
  value: string | null
  label: string | null
}

export interface SelectLoadingOptionsTypableProps {
  row?: object | null | undefined
  field?: string
  label?: string | undefined
  error?: string | null | undefined
  saveToDb: SaveToDbHandler
}

export const SelectLoadingOptionsTypable = ({
  row,
  field = '',
  label,
  error: saveToDbError,
  saveToDb,
}: SelectLoadingOptionsTypableProps) => {
  const wirtspflanze = (
    row as { wirtspflanze?: string | null } | null | undefined
  )?.wirtspflanze

  const [inputValue, setInputValue] = useState(wirtspflanze || '')

  const [prevWirtspflanze, setPrevWirtspflanze] = useState(wirtspflanze)
  // adjust state when the value changes from outside
  if (prevWirtspflanze !== wirtspflanze) {
    setPrevWirtspflanze(wirtspflanze)
    setInputValue(wirtspflanze || '')
  }

  // queries aeTaxonomies (the only table this component has been used with)
  const loadOptions = async (inputValue: string) => {
    const params =
      inputValue ?
        `artname=ilike.*${encodeURIComponent(inputValue)}*`
      : 'artname=not.is.null'
    const options =
      (await apiFetch<TypableOption[]>(
        `/ae_taxonomies?${params}&select=value:id,label:artname&order=artname.asc&limit=8`,
      )) ?? []
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

  const onInputChange = (value: string, { action }: { action: string }) => {
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
        loadOptions={loadOptions as never}
      />
      {saveToDbError && (
        <div className={styles.errorClass}>{saveToDbError}</div>
      )}
    </div>
  )
}
