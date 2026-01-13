import { FormTitle } from '../../shared/FormTitle/index.jsx'
import { Ap } from './Ap/index.tsx'
import { Beobachtungen } from './Beobachtungen/index.jsx'
import { Kontrollen } from './Kontrollen/index.jsx'
import { Massnahmen } from './Massnahmen/index.jsx'
import { Populationen } from './Populationen/index.jsx'
import { Teilpopulationen } from './Teilpopulationen/index.jsx'
import { Tipps } from './Tipps/index.jsx'
import { Anwendung } from './Anwendung.jsx'
import { Optionen } from './Optionen.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import styles from './index.module.css'

export const Exporte = () => (
  <div
    className={styles.exporteContainer}
    data-id="exporte-container"
  >
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Exporte"
          noTestDataMessage={true}
        />
        <div className={styles.scrollContainer}>
          <div className={styles.innerContainer}>
            <Optionen />
            <Tipps />
            <Ap />
            <Populationen />
            <Teilpopulationen />
            <Kontrollen />
            <Massnahmen />
            <Beobachtungen />
            <Anwendung />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  </div>
)
