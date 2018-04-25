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

import React from 'react'
import Snackbar from 'material-ui-next/Snackbar'
import Button from 'material-ui-next/Button'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import ErrorBoundary from './shared/ErrorBoundary'

const StyledSnackbar = styled(Snackbar)`
  > div {
    min-width: 350px !important;
  }
`

const enhance = compose(
  inject(`store`),
  withHandlers({
    onClose: ({ store }) => () => store.setUpdateAvailable(false),
    onClickInstall: () => event => {
      event.preventDefault()
      window.location.reload(false)
    },
  }),
  observer
)

const UpdateAvailable = ({
  store,
  onClose,
  onClickInstall,
}: {
  store: Object,
  onClose: () => void,
  onClickInstall: () => void,
}) => (
  <ErrorBoundary>
    <StyledSnackbar
      open={store.updateAvailable}
      message={<span id="message-id">Ein Update steht zur Verfügung</span>}
      SnackbarContentProps={{
        'aria-describedby': 'message-id',
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      action={
        <Button color="primary" size="small" onClick={onClickInstall}>
          installieren
        </Button>
      }
      autoHideDuration={1000 * 60}
      onClose={onClose}
    />
  </ErrorBoundary>
)

UpdateAvailable.displayName = 'UpdateAvailable'

export default enhance(UpdateAvailable)
