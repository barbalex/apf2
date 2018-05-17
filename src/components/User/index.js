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
import { Query } from 'react-apollo'
import get from 'lodash/get'
import gql from 'graphql-tag'
import app from 'ampersand-app'

import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
import processLogin from '../../modules/processLogin'

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
    fetchLogin: ({
      changeNameErrorText,
      changePasswordErrorText,
      changeName,
      changePassword,
      store,
      name,
      password
    }) => async (client) => {
      // when bluring fields need to pass event value
      // on the other hand when clicking on Anmelden button,
      // need to grab props
      if (!name) {
        return changeNameErrorText(
          'Geben Sie den Ihnen zugeteilten Benutzernamen ein'
        )
      }
      if (!password) {
        return changePasswordErrorText('Bitte Passwort eingeben')
      }

      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation logIn($name: String, $password: String) {
              login(input: { username: $name, pass: $password }) {
                clientMutationId
                jwtToken
              }
            }
          `,
          variables: {
            name,
            password,
          },
        })
      } catch (error) {
        const messages = error.graphQLErrors.map(x => x.message)
        const isNamePassError =
          messages.includes('invalid user or password') ||
          messages.includes('permission denied for relation user')
        if (isNamePassError) {
          const message = 'Name oder Passwort nicht bekannt'
          changeNameErrorText(message)
          return changePasswordErrorText(message)
        }
        return console.log(error)
      }
      const token = get(result, 'data.login.jwtToken')
      processLogin({ store, name, token, client })
      // refresh currentUser in idb
      app.db.currentUser.clear()
      app.db.currentUser.put({ name, token })

      setTimeout(() => {
        if (name) {
          changeName('')
          changePassword('')
        }
      }, 2000)
    },
  }),
  withHandlers({
    onBlurName: ({
      password,
      changeName,
      changeNameErrorText,
      fetchLogin
    }) => (e, client) => {
      changeNameErrorText('')
      const name = e.target.value
      changeName(name)
      if (!name) {
        changeNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      } else if (password) {
        fetchLogin(client)
      }
    },
    onBlurPassword: ({
      name,
      changePassword,
      changePasswordErrorText,
      fetchLogin
    }) => (e, client) => {
      changePasswordErrorText('')
      const password = e.target.value
      changePassword(password)
      if (!password) {
        changePasswordErrorText('Bitte Passwort eingeben')
      } else if (name) {
        fetchLogin(client)
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
}) => 
  <Query query={dataGql}>
    {({ error, data, client }) => {
      if (error) return `Fehler: ${error.message}`

      const user = get(data, 'user', {})

      return (
        <ErrorBoundary>
          <StyledDialog
            aria-labelledby="dialog-title"
            open={!user.token}
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
                  onBlur={e => onBlurName(e, client)}
                  autoFocus
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      onBlurName(e, client)
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
                  onBlur={e => onBlurPassword(e, client)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      onBlurPassword(e, client)
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
              <Button
                color="primary"
                onClick={() => fetchLogin(client)}
              >
                anmelden
              </Button>
            </DialogActions>
          </StyledDialog>
        </ErrorBoundary>
      )
    }}
  </Query>

export default enhance(User)
