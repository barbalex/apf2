import React, { useContext } from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import uniqBy from 'lodash/uniqBy'

//import storeContext from '../../storeContext'
import logout from '../../modules/logout'
import idbContext from '../../idbContext'
import existsPermissionError from '../../modules/existsPermissionError'

const ErrorContainer = styled.div`
  padding: 15px;
`
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`

const Error = errors => {
  //const store = useContext(storeContext)
  const { idb } = useContext(idbContext)
  //const { token } = store.user

  if (existsPermissionError(errors)) {
    // during login don't show permission error
    //if (!token) return null
    // if token is not accepted, ask user to logout
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
    )
  } else {
    const uniqueMessages = uniqBy(errors, 'message').map(e => e.message)
    if (uniqueMessages.length === 1) {
      return <ErrorContainer>{`Fehler: ${uniqueMessages[0]}`}</ErrorContainer>
    } else {
      return (
        <ErrorContainer>
          <div>Fehler:</div>
          <ul>
            {uniqueMessages.map(message => (
              <li>{message}</li>
            ))}
          </ul>
        </ErrorContainer>
      )
    }
  }
}

export default observer(Error)
