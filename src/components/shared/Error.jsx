import { useContext, memo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import uniq from 'lodash/uniq'

import { logout } from '../../modules/logout.js'
import { IdbContext } from '../../idbContext.js'
import { existsPermissionError } from '../../modules/existsPermissionError.js'

const ErrorContainer = styled.div`
  padding: 15px;
`
/*
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`*/

export const Error = memo(
  observer(({ errors: errorsPassed, error }) => {
    const { idb } = useContext(IdbContext)
    // allow user to pass single error or multiple errors
    let errors = errorsPassed
    if (error && !errorsPassed) errors = [error]
    // PROBLEM
    // something passes in an object instead of an array
    // so need to check and extract the errors array from the object if necessary
    const errorsToUse = errors.map ? errors : errors.errors

    if (existsPermissionError(errorsToUse)) {
      console.log('Permission error exists, will log out', { errorsToUse })
      // during login don't show permission error
      return logout(idb)
      /*// if token is not accepted, ask user to logout
    return (
      <ErrorContainer>
        <div>Ihre Anmeldung ist nicht mehr gültig.</div>
        <div>Bitte melden Sie sich neu an.</div>
        <LogoutButton
          variant="outlined"
          onClick={() => {
            logout(idb)
          }}
        >
          Neu anmelden
        </LogoutButton>
      </ErrorContainer>
    )*/
    }

    const errorMessages = errorsToUse.map((e) => e.message)
    const uniqueMessages = uniq(errorMessages)
    if (uniqueMessages.length === 1) {
      return <ErrorContainer>{`Fehler: ${uniqueMessages[0]}`}</ErrorContainer>
    }

    // console.log('Error.jsx: errorsToUse:', errorsToUse)
    // console.log('Error.jsx: errorMessages:', errorMessages)

    return (
      <ErrorContainer>
        <h5>Fehler:</h5>
        <ul>
          {uniqueMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </ErrorContainer>
    )
  }),
)
