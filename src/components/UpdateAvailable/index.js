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
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
import setUpdateAvailable from './setUpdateAvailable.graphql'

const StyledSnackbar = styled(Snackbar)`
  > div {
    min-width: 350px !important;
  }
`

const UpdateAvailable = () => (
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      const updateAvailable = get(data, 'updateAvailable')

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
              <Button
                color="primary"
                size="small"
                onClick={event => {
                  event.preventDefault()
                  window.location.reload(false)
                }}
              >
                installieren
              </Button>
            }
            autoHideDuration={1000 * 60}
            onClose={() => {
              client.mutate({
                mutation: setUpdateAvailable,
                variables: { value: false }
              })
            }}
          />
        </ErrorBoundary>
      )
    }}
  </Query>
)

UpdateAvailable.displayName = 'UpdateAvailable'

export default UpdateAvailable
