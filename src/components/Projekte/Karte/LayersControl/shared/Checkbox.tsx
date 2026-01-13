import styles from './Checkbox.module.css'

export const Checkbox = ({ value, label, checked, onChange }) => (
  <div className={styles.container}>
    <label className={styles.label}>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.input}
      />
      {label}
    </label>
  </div>
)
