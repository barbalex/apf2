import { uniq } from 'es-toolkit'

import { logout } from '../../modules/logout.ts'
import { existsPermissionError } from '../../modules/existsPermissionError.ts'
import { store, userTokenAtom } from '../../store/index.ts'

import styles from './Error.module.css'

/*
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`*/

interface ErrorProps {
  // a single error or an array; also tolerates an object wrapping an errors array
  errors?: unknown
  error?: unknown
}

export const Error = ({ errors: errorsPassed, error }: ErrorProps) => {
  // allow user to pass single error or multiple errors
  // PROBLEM
  // something passes in an object instead of an array
  // so need to check and extract the errors array from the object if necessary
  let errorsToUse: { message?: string }[] | undefined
  if (error && !errorsPassed) {
    errorsToUse = [error] as { message?: string }[]
  } else if (Array.isArray(errorsPassed)) {
    errorsToUse = errorsPassed as { message?: string }[]
  } else {
    errorsToUse = (
      (errorsPassed as { errors?: unknown[] } | undefined)?.errors
    ) as { message?: string }[] | undefined
  }

  if (existsPermissionError(errorsToUse)) {
    console.log('Permission error exists, will log out', { errorsToUse })
    const token = store.get(userTokenAtom)
    if (!token) {
      // Avoid reload loop before login is possible
      return null
    }
    void logout()
    return null
  }

  const errorMessages = (errorsToUse ?? []).map((e) => e.message)
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
