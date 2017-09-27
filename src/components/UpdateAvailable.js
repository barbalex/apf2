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
import Snackbar from 'material-ui/Snackbar'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
//import styled from 'styled-components'

const enhance = compose(
  inject(`store`),
  withHandlers({
    onClickClose: props => () => props.store.setUpdateAvailable(false),
    onClickInstall: props => event => {
      event.preventDefault()
      window.location.reload(false)
    },
  }),
  observer
)

const UpdateAvailable = ({
  store,
  onClickClose,
  onClickInstall,
}: {
  store: Object,
  onClickClose: () => void,
  onClickInstall: () => void,
}) => (
  <Snackbar
    open={store.updateAvailable}
    message="Ein Update steht zur Verfügung"
    action="installieren"
    autoHideDuration={1000 * 30}
    onActionTouchTap={onClickInstall}
    onRequestClose={onClickClose}
    bodyStyle={{
      backgroundColor: 'rgb(35, 98, 38)',
    }}
  />
)

UpdateAvailable.displayName = 'UpdateAvailable'

export default enhance(UpdateAvailable)
