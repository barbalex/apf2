// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`

const enhance = compose(
  inject('store'),
  withState('name', 'changeName', ''),
  withState('password', 'changePassword', ''),
  withState('nameErrorText', 'changeNameErrorText', ''),
  withState('passwordErrorText', 'changePasswordErrorText', ''),
  withHandlers({
    fetchLogin: props => (namePassed, passwordPassed) => {
      const {
        changeNameErrorText,
        changePasswordErrorText,
        changeName,
        changePassword,
        store,
      } = props
      // when bluring fields need to pass event value
      // on the other hand when clicking on Anmelden button,
      // need to grab props
      const name = namePassed || props.name
      const password = passwordPassed || props.password
      if (!name) {
        return changeNameErrorText(
          'Geben Sie den Ihnen zugeteilten Benutzernamen ein'
        )
      }
      if (!password) {
        return changePasswordErrorText('Bitte Passwort eingeben')
      }
      store.fetchLogin(name, password)
      setTimeout(() => {
        if (store.user.name) {
          changeName('')
          changePassword('')
        }
      }, 2000)
    },
  }),
  withHandlers({
    onBlurName: props => e => {
      const { password, changeName, changeNameErrorText, fetchLogin } = props
      changeNameErrorText('')
      const name = e.target.value
      changeName(name)
      if (!name) {
        changeNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      } else if (password) {
        fetchLogin(name, password)
      }
    },
    onBlurPassword: props => e => {
      const {
        name,
        changePassword,
        changePasswordErrorText,
        fetchLogin,
      } = props
      changePasswordErrorText('')
      const password = e.target.value
      changePassword(password)
      if (!password) {
        changePasswordErrorText('Bitte Passwort eingeben')
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
}: {
  store: Object,
  name: string,
  changeName: () => void,
  password: string,
  changePassword: () => void,
  nameErrorText: string,
  changeNameErrorText: () => void,
  passwordErrorText: string,
  changePasswordErrorText: () => void,
  onBlurName: () => void,
  onBlurPassword: () => void,
  fetchLogin: () => void,
}) => {
  const actions = [
    <FlatButton label="anmelden" primary={true} onClick={fetchLogin} />,
  ]
  // TODO Authorization:
  // open depends on store.user.jwt
  return (
    <Dialog
      title="Anmeldung"
      open={!store.user.token}
      actions={actions}
      contentStyle={{
        maxWidth: '400px',
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
          onKeyPress={e => {
            if (e.key === 'Enter') {
              onBlurName(e)
            }
          }}
        />
        <TextField
          floatingLabelText="Passwort"
          type="password"
          defaultValue={password}
          onBlur={onBlurPassword}
          errorText={passwordErrorText}
          fullWidth
          onKeyPress={e => {
            if (e.key === 'Enter') {
              onBlurPassword(e)
            }
          }}
        />
      </StyledDiv>
    </Dialog>
  )
}

export default enhance(User)
