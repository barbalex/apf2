import styles from './Radio.module.css'

export const Radio = ({ name, value, label, checked, onChange }) => (
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
