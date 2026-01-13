import { FormTitle } from '../../shared/FormTitle/index.jsx'
import { Ap } from './Ap/index.tsx'
import { Beobachtungen } from './Beobachtungen/index.tsx'
import { Kontrollen } from './Kontrollen/index.tsx'
import { Massnahmen } from './Massnahmen/index.tsx'
import { Populationen } from './Populationen/index.tsx'
import { Teilpopulationen } from './Teilpopulationen/index.tsx'
import { Tipps } from './Tipps/index.tsx'
import { Anwendung } from './Anwendung.tsx'
import { Optionen } from './Optionen.tsx'
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
