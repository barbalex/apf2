import styles from './Title.module.css'

export const Title = ({ row }) => {
  const year = row?.jahr ?? new Date().getFullYear()

  return (
    <div
      className={styles.container}
    >{`Erfolgskontrolle Artenschutz Flora ${year}`}</div>
  )
}
