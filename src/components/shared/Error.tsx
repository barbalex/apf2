import { uniq } from 'es-toolkit'

import { logout } from '../../modules/logout.ts'
import { existsPermissionError } from '../../modules/existsPermissionError.ts'
import { store, userTokenAtom } from '../../store/index.ts'

import styles from './Error.module.css'

/*
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`*/

export const Error = ({ errors: errorsPassed, error }) => {
  // allow user to pass single error or multiple errors
  let errors = errorsPassed
  if (error && !errorsPassed) errors = [error]
  // PROBLEM
  // something passes in an object instead of an array
  // so need to check and extract the errors array from the object if necessary
  const errorsToUse = errors.map ? errors : errors.errors

  if (existsPermissionError(errorsToUse)) {
    console.log('Permission error exists, will log out', { errorsToUse })
    const token = store.get(userTokenAtom)
    if (!token) {
      // Avoid reload loop before login is possible
      return null
    }
    return logout()
    /*// if token is not accepted, ask user to logout
    return (
      <div className={container}>
        <div>Ihre Anmeldung ist nicht mehr gültig.</div>
        <div>Bitte melden Sie sich neu an.</div>
        <LogoutButton
          variant="outlined"
          onClick={() => {
            logout()
          }}
        >
          Neu anmelden
        </LogoutButton>
      </div>
    )*/
  }

  const errorMessages = errorsToUse.map((e) => e.message)
  const uniqueMessages = uniq(errorMessages)
  if (uniqueMessages.length === 1) {
    return (
      <div className={styles.container}>{`Fehler: ${uniqueMessages[0]}`}</div>
    )
  }

  // console.log('Error.jsx: errorsToUse:', errorsToUse)
  // console.log('Error.jsx: errorMessages:', errorMessages)

  return (
    <div className={styles.container}>
      <h5>Fehler:</h5>
      <ul>
        {uniqueMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  )
}
