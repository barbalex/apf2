/**
 * This does not work as planned:
 * It loads 8 options at mount
 * BUT DOES NOT SHOW THEM WHEN USER ENTERS FIELD
 */

import AsyncSelect from 'react-select/async'
import { get } from 'es-toolkit/compat'

import { apiFetch } from '../../modules/api.ts'
import type { SaveToDbHandler } from './types.ts'

import styles from './Select.module.css'

interface SelectLoadingOption {
  value: string
  label: string
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
  filter?: (inputValue: string) => Record<string, unknown>
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
  filter,
}: SelectLoadingOptionsProps) => {
  const rowRecord = row as Record<string, unknown> | null | undefined

  // every consumer queries aeTaxonomies; the former GraphQL filter
  // (artname includesInsensitive / isNull false, id notIn, taxArtName
  // includesInsensitive) translates to PostgREST URL params
  const filterToParams = (f: Record<string, unknown>): string => {
    const params: string[] = []
    for (const [key, value] of Object.entries(f)) {
      const ops = value as Record<string, unknown>
      if (ops.includesInsensitive != null)
        params.push(
          `${key === 'taxArtName' ? 'tax_art_name' : key}=ilike.*${encodeURIComponent(String(ops.includesInsensitive))}*`,
        )
      if (ops.isNull === false) params.push(`${key}=not.is.null`)
      if (Array.isArray(ops.notIn))
        params.push(`id=not.in.(${(ops.notIn as string[]).join(',')})`)
    }
    return params.join('&')
  }

  const loadOptions = async (inputValue: string) => {
    const ownFilter =
      inputValue ?
        { artname: { includesInsensitive: inputValue } }
      : { artname: { isNull: false } }
    try {
      const params = filterToParams(
        (filter ? filter(inputValue) : ownFilter) as Record<string, unknown>,
      )
      const options =
        (await apiFetch<SelectLoadingOption[]>(
          `/ae_taxonomies?${params}&select=value:id,label:artname&order=artname.asc&limit=8`,
        )) ?? []
      return options
    } catch (error) {
      console.log({ error })
      return []
    }
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
      valueLabel ? valueLabel : (
        ((get(rowRecord ?? {}, valueLabelPath ?? '') as string | null) ?? '')
      ),
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
