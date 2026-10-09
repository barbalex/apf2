import styles from './Label.module.css'

export const Label = ({
  label,
  color = 'rgba(0, 0, 0, 0.5)',
  htmlFor,
}: {
  label: React.ReactNode
  color?: string | undefined
  htmlFor?: string | undefined
}) => (
  <div
    style={{ color }}
    className={styles.labelClass}
    data-html-for={htmlFor}
  >
    {label}
  </div>
)
