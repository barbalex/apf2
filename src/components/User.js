// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import Dialog from 'material-ui/Dialog'
import TextField  from 'material-ui/TextField'
import FlatButton  from 'material-ui/FlatButton'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`

const enhance = compose(
  inject(`store`),
  withState(`name`, `changeName`, ``),
  withState(`password`, `changePassword`, ``),
  withState(`nameErrorText`, `changeNameErrorText`, ``),
  withState(`passwordErrorText`, `changePasswordErrorText`, ``),
  withHandlers({
    fetchLogin: props => (namePassed, passwordPassed) => {
      const { changeNameErrorText, changePasswordErrorText, store } = props
      // when bluring fields need to pass event value
      // on the other hand when clicking on Anmelden button,
      // need to grab props
      const name = namePassed || props.name
      const password = passwordPassed || props.password
      if (!name) {
        return changeNameErrorText(`Bitte Namen erfassen`)
      }
      if (!password) {
        return changePasswordErrorText(`Bitte Passwort erfassen`)
      }
      store.fetchLogin(name, password)
    },
  }),
  withHandlers({
    onBlurName: props => (e) => {
      const { password, changeName, changeNameErrorText, fetchLogin } = props
      changeNameErrorText(``)
      const name = e.target.value
      changeName(name)
      if (!name) {
        changeNameErrorText(`Bitte Namen erfassen`)
      } else if (password) {
        fetchLogin(name, password)
      }
    },
    onBlurPassword: props => (e) => {
      const { name, changePassword, changePasswordErrorText, fetchLogin } = props
      changePasswordErrorText(``)
      const password = e.target.value
      changePassword(password)
      if (!password) {
        changePasswordErrorText(`Bitte Passwort erfassen`)
      } else if (name) {
        fetchLogin(name, password)
      }
    },
  }),
  observer
)

const User = ({
  store,
  name,
  password,
  nameErrorText,
  passwordErrorText,
  changeNameErrorText,
  changePasswordErrorText,
  onBlurName,
  onBlurPassword,
  fetchLogin,
}) => {
  const actions = [
    <FlatButton
        label="anmelden"
        primary={true}
        onTouchTap={fetchLogin}
      />
  ]
  return (
    <Dialog
      title="Anmeldung"
      open={!store.user.name}
      actions={actions}
      contentStyle={{
        maxWidth: `400px`,
      }}
    >
      <StyledDiv>
        <TextField
          floatingLabelText="Name"
          defaultValue={name}
          onBlur={onBlurName}
          errorText={nameErrorText}
          fullWidth
          autoFocus
        />
        <TextField
          floatingLabelText="Passwort"
          type="password"
          defaultValue={password}
          onBlur={onBlurPassword}
          errorText={passwordErrorText}
          fullWidth
        />
    </StyledDiv>
    </Dialog>
  )
}

User.propTypes = {
  store: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  changeName: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  changePassword: PropTypes.func.isRequired,
  nameErrorText: PropTypes.string.isRequired,
  changeNameErrorText: PropTypes.func.isRequired,
  passwordErrorText: PropTypes.string.isRequired,
  changePasswordErrorText: PropTypes.func.isRequired,
  onBlurName: PropTypes.func.isRequired,
  onBlurPassword: PropTypes.func.isRequired,
  fetchLogin: PropTypes.func.isRequired,
}

export default enhance(User)
