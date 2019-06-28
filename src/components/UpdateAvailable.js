/*
 * receives an object with two keys: title, msg
 * displays it while the object is present
 *
 * if a view wants to inform of an error it
 * calls action showError and passes the object
 * the errorStore triggers, passing the error
 * ...then triggers again some time later, passing an empty error object
 */

import React, { useCallback, useContext } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../storeContext'

const StyledSnackbar = styled(Snackbar)`
  > div {
    min-width: 350px !important;
  }
`

const UpdateAvailable = () => {
  const { updateAvailable, setUpdateAvailable } = useContext(storeContext)

  const onClose = useCallback(() => setUpdateAvailable(false))
  const onClickIntall = useCallback(event => {
    event.preventDefault()
    typeof window !== 'undefined' && window.location.reload(false)
  })

  return (
    <ErrorBoundary>
      <StyledSnackbar
        open={updateAvailable}
        message={<span id="message-id">Ein Update steht zur Verfügung</span>}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <Button color="primary" size="small" onClick={onClickIntall}>
            installieren
          </Button>
        }
        autoHideDuration={1000 * 60}
        onClose={onClose}
      />
    </ErrorBoundary>
  )
}

UpdateAvailable.displayName = 'UpdateAvailable'

export default UpdateAvailable
