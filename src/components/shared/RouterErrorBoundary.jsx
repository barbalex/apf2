import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouteError } from 'react-router'
import Button from '@mui/material/Button'

import { IdbContext } from '../../idbContext.js'
import { MobxContext as storeContext } from '../../mobxContext.js'
import { logout } from '../../modules/logout.js'

import {
  container,
  buttonContainer,
  button,
  preWrapping,
} from './RouterErrorBoundary.module.css'

export const RouterErrorBoundary = observer(({ children }) => {
  const error = useRouteError()

  const idb = useContext(IdbContext)
  const store = useContext(storeContext)
  const onLogout = () => logout(idb)

  const onReload = () => window.location.reload(true)

  return (
    <div className={container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={preWrapping}>{error.message}</pre>
      <div className={buttonContainer}>
        <Button
          className={button}
          variant="outlined"
          onClick={onReload}
          color="inherit"
        >
          neu starten
        </Button>
      </div>
      <div className={buttonContainer}>
        <Button
          className={button}
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
