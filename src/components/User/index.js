// @flow
import React from 'react'
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
import get from 'lodash/get'
import gql from 'graphql-tag'
import app from 'ampersand-app'

import ErrorBoundary from '../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import setUserGql from './setUser'

const StyledDialog = styled(Dialog)``
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
  withLocalData,
  withState('name', 'setName', ''),
  withState('password', 'setPassword', ''),
  withState('showPass', 'setShowPass', false),
  withState('nameErrorText', 'setNameErrorText', ''),
  withState('passwordErrorText', 'setPasswordErrorText', ''),
  withHandlers({
    fetchLogin: ({
      setNameErrorText,
      setPasswordErrorText,
      setName,
      setPassword,
      name,
      password,
    }) => async () => {
      let result
      try {
        result = await app.client.mutate({
          mutation: gql`
            mutation logIn($name: String, $password: String) {
              login(input: { username: $name, pass: $password }) {
                jwtToken
              }
            }
          `,
          variables: {
            name,
            password,
          },
          /*optimisticResponse: {
            login: {
              username: name,
              jwtToken: '',
              __typename: 'Login',
            },
            __typename: 'Mutation',
          },*/
        })
      } catch (error) {
        const messages = error.graphQLErrors.map(x => x.message)
        const isNamePassError =
          messages.includes('invalid user or password') ||
          messages.includes('permission denied for relation user')
        if (isNamePassError) {
          const message = 'Name oder Passwort nicht bekannt'
          setNameErrorText(message)
          return setPasswordErrorText(message)
        }
        return console.log(error)
      }
      const token = get(result, 'data.login.jwtToken')
      // refresh currentUser in idb
      app.db.currentUser.clear()
      await app.db.currentUser.put({ name, token })
      await app.client.mutate({
        mutation: setUserGql,
        variables: { name, token },
        /*optimisticResponse: {
          setUser: {
            name,
            token,
            __typename: 'User',
          },
          __typename: 'Mutation',
        },*/
      })
      // this is easiest way to make sure everything is correct
      // as client is rebuilt with new settings
      window.location.reload(true)

      setTimeout(() => {
        if (name) {
          setName('')
          setPassword('')
        }
      }, 2000)
    },
  }),
  withHandlers({
    onBlurName: ({ password, setName, setNameErrorText, fetchLogin }) => e => {
      setNameErrorText('')
      const name = e.target.value
      setName(name)
      if (!name) {
        setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      } else if (password) {
        setTimeout(() => fetchLogin())
      }
    },
    onBlurPassword: ({
      name,
      setPassword,
      setPasswordErrorText,
      fetchLogin,
    }) => e => {
      setPasswordErrorText('')
      const password = e.target.value
      setPassword(password)
      if (!password) {
        setPasswordErrorText('Bitte Passwort eingeben')
      } else if (name) {
        setTimeout(() => fetchLogin())
      }
    },
  }),
)

const User = ({
  name,
  password,
  showPass,
  setShowPass,
  nameErrorText,
  passwordErrorText,
  setNameErrorText,
  setPasswordErrorText,
  onBlurName,
  onBlurPassword,
  fetchLogin,
  localData,
}: {
  name: string,
  showPass: Boolean,
  setName: () => void,
  password: string,
  setShowPass: () => void,
  setPassword: () => void,
  nameErrorText: string,
  setNameErrorText: () => void,
  passwordErrorText: string,
  setPasswordErrorText: () => void,
  onBlurName: () => void,
  onBlurPassword: () => void,
  fetchLogin: () => void,
  localData: Object,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`

  const user = get(localData, 'user', {})

  return (
    <ErrorBoundary>
      <StyledDialog aria-labelledby="dialog-title" open={!user.token}>
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
                    onClick={() => setShowPass(!showPass)}
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
