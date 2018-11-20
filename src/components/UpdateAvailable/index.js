// @flow
/*
 * receives an object with two keys: title, msg
 * displays it while the object is present
 *
 * if a view wants to inform of an error it
 * calls action showError and passes the object
 * the errorStore triggers, passing the error
 * ...then triggers again some time later, passing an empty error object
 */

import React, { useCallback } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import { withApollo } from 'react-apollo'

import ErrorBoundary from '../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import setUpdateAvailable from './setUpdateAvailable'

const StyledSnackbar = styled(Snackbar)`
  > div {
    min-width: 350px !important;
  }
`

const enhance = compose(
  withApollo,
  withLocalData,
)

const UpdateAvailable = ({
  localData,
  client,
}: {
  localData: Object,
  client: Object,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`
  const updateAvailable = get(localData, 'updateAvailable')

  const onClose = useCallback(() =>
    client.mutate({
      mutation: setUpdateAvailable,
      variables: { value: false },
    }),
  )
  const onClickIntall = useCallback(event => {
    event.preventDefault()
    window.location.reload(false)
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

export default enhance(UpdateAvailable)
