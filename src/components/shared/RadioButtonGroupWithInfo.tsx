import type { ReactNode } from 'react'

import { RadioButtonGroup } from './RadioButtonGroup.tsx'
import type { RadioButtonGroupOption } from './RadioButtonGroup.tsx'
import { InfoWithPopover } from './InfoWithPopover.tsx'
import type { SaveToDbHandler } from './types.ts'

import styles from './RadioButtonGroupWithInfo.module.css'

export interface RadioButtonGroupWithInfoProps {
  label?: string | undefined
  name: string
  value?: string | number | boolean | null | undefined
  error?: string | null | undefined
  dataSource: RadioButtonGroupOption[]
  saveToDb: SaveToDbHandler
  popover?: ReactNode | undefined
}

export const RadioButtonGroupWithInfo = ({
  label,
  name,
  value = '',
  error,
  dataSource,
  saveToDb,
  popover,
}: RadioButtonGroupWithInfoProps) => (
  <div className={styles.container}>
    <RadioButtonGroup
      value={value}
      name={name}
      dataSource={dataSource}
      saveToDb={saveToDb}
      label={label}
      error={error}
    />
    <InfoWithPopover name={name}>{popover}</InfoWithPopover>
  </div>
)
