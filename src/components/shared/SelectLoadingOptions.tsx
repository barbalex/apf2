/**
 * This does not work as planned:
 * It loads 8 options at mount
 * BUT DOES NOT SHOW THEM WHEN USER ENTERS FIELD
 */

import AsyncSelect from 'react-select/async'
import { useApolloClient } from '@apollo/client/react'
import type { DocumentNode } from '@apollo/client'
import { get } from 'es-toolkit/compat'

import type { SaveToDbHandler } from './types.ts'

import styles from './Select.module.css'

interface SelectLoadingOption {
  value: string
  label: string
}

interface SelectLoadingNodes {
  nodes?: SelectLoadingOption[]
}

export interface SelectLoadingOptionsProps {
  row?: object | null | undefined
  valueLabelPath?: string | undefined
  valueLabel?: string | undefined
  field?: string
  label?: string | undefined
  labelSize?: number | undefined
  error?: string | null | undefined
  saveToDb: SaveToDbHandler
  query: DocumentNode
  filter?: (inputValue: string) => Record<string, unknown>
  queryNodesName: string
}

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
}: SelectLoadingOptionsProps) => {
  const apolloClient = useApolloClient()
  const rowRecord = row as Record<string, unknown> | null | undefined

  const loadOptions = async (inputValue: string) => {
    const ownFilter =
      inputValue ?
        { artname: { includesInsensitive: inputValue } }
      : { artname: { isNull: false } }
    let result: { data?: unknown } | undefined
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
    const data = result?.data as Record<string, unknown> | undefined
    const options =
      (data?.[queryNodesName] as SelectLoadingNodes | undefined)?.nodes ?? []
    return options
  }

  const onChange = (option: SelectLoadingOption | null) => {
    const value = option && option.value ? option.value : null
    const fakeEvent = {
      target: {
        name: field,
        value,
      },
    }
    void saveToDb(fakeEvent)
  }

  const value = {
    value: (rowRecord?.[field] as string | undefined) ?? '',
    label:
      valueLabel ?
        valueLabel
      : ((get(rowRecord ?? {}, valueLabelPath ?? '') as string | null) ?? ''),
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
