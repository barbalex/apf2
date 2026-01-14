import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouteError } from 'react-router'
import Button from '@mui/material/Button'

import { IdbContext } from '../../idbContext.js'
import { MobxContext as storeContext } from '../../mobxContext.js'
import { logout } from '../../modules/logout.ts'

import styles from './RouterErrorBoundary.module.css'

export const RouterErrorBoundary = observer(({ children }) => {
  const error = useRouteError()

  const idb = useContext(IdbContext)
  const store = useContext(storeContext)
  const onLogout = () => logout(idb)

  const onReload = () => window.location.reload(true)

  return (
    <div className={styles.container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={styles.preWrapping}>{error.message}</pre>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          variant="outlined"
          onClick={onReload}
          color="inherit"
        >
          neu starten
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          variant="outlined"
          onClick={onLogout}
          color="inherit"
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
})
