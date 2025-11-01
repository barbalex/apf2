import { container, article, titel, a } from './Unterhalt.module.css'

export const Unterhalt = () => (
  <div className={container}>
    <article className={article}>
      <h1 className={titel}>Wir sind bald zurück!</h1>
      <div>
        <p>apflora erhält gerade eine neue Datenbank</p>
        <p>
          Wenn nötig sind wir per{' '}
          <a
            className={a}
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
