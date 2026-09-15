import type { ChangeEvent } from 'react'

import styles from './Radio.module.css'

interface RadioProps {
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const Radio = ({ name, value, label, checked, onChange }: RadioProps) => (
  <label className={styles.label}>
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className={styles.input}
    />
    {label}
  </label>
)
