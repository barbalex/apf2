import ReactSelect from 'react-select'
import type { CSSProperties } from 'react'

import { exists } from '../../modules/exists.ts'
import type { SaveToDbHandler } from './types.ts'
import styles from './Select.module.css'

export interface SelectOption {
  value: string | number
  label: string | null
  historic?: boolean
}

export interface SelectProps {
  value: string | number | null
  field?: string
  label?: string | undefined
  labelSize?: number | undefined
  name?: string
  error?: string | undefined
  options: SelectOption[]
  loading?: boolean
  maxHeight?: number | null
  noCaret?: boolean
  saveToDb: SaveToDbHandler
}

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
}: SelectProps) => {
  const onChange = (option: SelectOption | null | undefined) => {
    const fakeEvent = {
      target: {
        name,
        value: option ? option.value : null,
      },
    }
    void saveToDb(fakeEvent)
  }

  // filter out historic options - if they are not the value set
  const realOptions = options.filter((o) => {
    const dontShowHistoric = !exists(value) || value !== o.value
    if (dontShowHistoric) return !o.historic
    return true
  })

  // show ... while options are loading
  const loadingOptions: SelectOption[] = [{ value: value ?? '', label: '...' }]
  const optionsToUse = loading && value ? loadingOptions : realOptions
  const selectValue = optionsToUse.find((o) => o.value === value)
  const styleMeantForSelect =
    maxHeight ?
      {
        '--react-select-menu-list-max-height': `${maxHeight}px`,
      } as CSSProperties
    : {}

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
        className={`select-height-limited ${noCaret ? 'select-nocaret' : ''} ${styles.select}`}
      />
      {error && <div className={styles.errorClass}>{error}</div>}
    </div>
  )
}
