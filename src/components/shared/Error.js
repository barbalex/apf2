import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import uniq from 'lodash/uniq'

import logout from '../../modules/logout'
import idbContext from '../../idbContext'
import existsPermissionError from '../../modules/existsPermissionError'

const ErrorContainer = styled.div`
  padding: 15px;
`
/*
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`*/

const Error = ({ errors: errorsPassed, error }) => {
  // allow user to pass single error or multiple errors
  let errors = errorsPassed
  if (error && !errorsPassed) errors = [error]
  // PROBLEM
  // something passes in an object instead of an array
  // so need to check and extract the errors array from the object if necessary
  const errorsToUse = errors.map ? errors : errors.errors
  const { idb } = useContext(idbContext)
  //console.log('Error, errors:', errors)
  //console.log('Error, errorsToUse:', errorsToUse)

  if (existsPermissionError(errorsToUse)) {
    console.log('Error will log out')
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
  //console.log('Error will list messages')
  const errorMessages = errorsToUse.map((e) => e.message)
  //console.log('Error errorMessages:', errorMessages)
  const uniqueMessages = uniq(errorMessages)
  //console.log('Error uniqueMessages:', uniqueMessages)
  if (uniqueMessages.length === 1) {
    return <ErrorContainer>{`Fehler: ${uniqueMessages[0]}`}</ErrorContainer>
  }
  //console.log('Error returning all uniqueMessages')
  return (
    <ErrorContainer>
      <h5>Fehler:</h5>
      <ul>
        {uniqueMessages.map((message) => (
          <li>{message}</li>
        ))}
      </ul>
    </ErrorContainer>
  )
}

export default observer(Error)
