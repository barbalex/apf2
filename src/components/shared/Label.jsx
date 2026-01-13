import styles from './Label.module.css'

export const Label = ({ label, color = 'rgba(0, 0, 0, 0.5)' }) => (
  <div
    style={{ color }}
    className={styles.labelClass}
  >
    {label}
  </div>
)
