// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import ErrorBoundary from './shared/ErrorBoundary'

const StyledDialog = styled(Dialog)`
  > div {
  }
`
const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 24px;
`
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  inject('store'),
  withState('name', 'changeName', ''),
  withState('password', 'changePassword', ''),
  withState('showPass', 'changeShowPass', false),
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
  showPass,
  changeShowPass,
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
  showPass: Boolean,
  changeName: () => void,
  password: string,
  changeShowPass: () => void,
  changePassword: () => void,
  nameErrorText: string,
  changeNameErrorText: () => void,
  passwordErrorText: string,
  changePasswordErrorText: () => void,
  onBlurName: () => void,
  onBlurPassword: () => void,
  fetchLogin: () => void,
}) => {
  // TODO Authorization:
  // open depends on store.user.jwt
  return (
    <ErrorBoundary>
      <StyledDialog
        aria-labelledby="dialog-title"
        open={!store.user.token}
      >
        <DialogTitle id="dialog-title">Anmeldung</DialogTitle>
        <StyledDiv>
          <FormControl
            error={!!nameErrorText}
            fullWidth
            aria-describedby="nameHelper"
          >
            <InputLabel htmlFor="name">Name</InputLabel>
            <StyledInput
              id="name"
              defaultValue={name}
              onBlur={onBlurName}
              autoFocus
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  onBlurName(e)
                }
              }}
            />
            <FormHelperText id="nameHelper">{nameErrorText}</FormHelperText>
          </FormControl>
          <FormControl
            error={!!passwordErrorText}
            fullWidth
            aria-describedby="passwortHelper"
          >
            <InputLabel htmlFor="passwort">Passwort</InputLabel>
            <StyledInput
              id="passwort"
              type={showPass ? 'text' : 'password'}
              defaultValue={password}
              onBlur={onBlurPassword}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  onBlurPassword(e)
                }
              }}
              autoComplete="current-password"
              autoCorrect="off"
              spellCheck="false"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => changeShowPass(!showPass)}
                    onMouseDown={e => e.preventDefault()}
                    title={showPass ? 'verstecken' : 'anzeigen'}
                  >
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="passwortHelper">
              {passwordErrorText}
            </FormHelperText>
          </FormControl>
        </StyledDiv>
        <DialogActions>
          <Button color="primary" onClick={fetchLogin}>
            anmelden
          </Button>
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default enhance(User)
