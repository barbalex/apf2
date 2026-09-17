import type { ChangeEvent } from 'react'

import styles from './Checkbox.module.css'

interface CheckboxProps {
  value: string | boolean
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void | Promise<void>
}

export const Checkbox = ({ value, label, checked, onChange }: CheckboxProps) => (
  <div className={styles.container}>
    <label className={styles.label}>
      <input
        type="checkbox"
        // value can be a boolean (ShowForMultipleAps)
        // and is passed through unchanged at runtime
        value={value as string | undefined}
        checked={checked}
        onChange={(event) => void onChange(event)}
        className={styles.input}
      />
      {label}
    </label>
  </div>
)
