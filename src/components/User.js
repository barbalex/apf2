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

const fetchLogin = ({ name, password, changeNameErrorText, changePasswordErrorText, store }) => {
  if (!name) {
    return changeNameErrorText(`Bitte Namen erfassen`)
  }
  if (!password) {
    return changePasswordErrorText(`Bitte Passwort erfassen`)
  }
  store.fetchLogin(name, password)
}

const enhance = compose(
  inject(`store`),
  withState(`name`, `changeName`, ``),
  withState(`password`, `changePassword`, ``),
  withState(`nameErrorText`, `changeNameErrorText`, ``),
  withState(`passwordErrorText`, `changePasswordErrorText`, ``),
  withHandlers({
    onChangeName: props => (e) => {
      props.changeNameErrorText(``)
      props.changeName(e.target.value)
    },
    onChangePassword: props => (e) => {
      props.changePasswordErrorText(``)
      props.changePassword(e.target.value)
    },
    onBlurName: props => () => {
      const { name, password, changeNameErrorText, changePasswordErrorText, store } = props
      if (password) {
        fetchLogin({ name, password, changeNameErrorText, changePasswordErrorText, store })
      } else {
        changeNameErrorText(`Bitte Namen erfassen`)
      }
    },
    onBlurPassword: props => () => {
      const { name, password, changeNameErrorText, changePasswordErrorText, store } = props
      if (name) {
        fetchLogin({ name, password, changeNameErrorText, changePasswordErrorText, store })
      } else {
        changePasswordErrorText(`Bitte Passwort erfassen`)
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
  onChangeName,
  onBlurName,
  onChangePassword,
  onBlurPassword,
}) => {
  const actions = [
    <FlatButton
        label="anmelden"
        primary={true}
        onTouchTap={fetchLogin({ name, password, changeNameErrorText, changePasswordErrorText, store })}
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
          value={name}
          onChange={onChangeName}
          onBlur={onBlurName}
          autoFocus
          errorText={nameErrorText}
          fullWidth
        />
        <TextField
          floatingLabelText="Passwort"
          type="password"
          value={password}
          onChange={onChangePassword}
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
  onChangeName: PropTypes.func.isRequired,
  onBlurName: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired,
  onBlurPassword: PropTypes.func.isRequired,
}

export default enhance(User)
