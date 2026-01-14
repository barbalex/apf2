import styles from './Unterhalt.module.css'

export const Unterhalt = () => (
  <div className={styles.container}>
    <article className={styles.article}>
      <h1 className={styles.titel}>Wir sind bald zurück!</h1>
      <div>
        <p>apflora erhält gerade eine neue Datenbank</p>
        <p>
          Wenn nötig sind wir per{' '}
          <a
            className={styles.a}
            href="mailto:alex@gabriel-software.ch"
          >
            email
          </a>{' '}
          erreichbar,
          <br />
          ansonsten sind wir bald wieder online
        </p>
      </div>
    </article>
  </div>
)
