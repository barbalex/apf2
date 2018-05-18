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
import initiateDataFromUrl from '../../modules/initiateDataFromUrl'
import setUserGql from './setUser.graphql'

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
      store,
      name,
      password
    }) => async (client, refetch) => {
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
          setNameErrorText(message)
          return setPasswordErrorText(message)
        }
        return console.log(error)
      }
      const token = get(result, 'data.login.jwtToken')
      await client.mutate({
        mutation: setUserGql,
        variables: { name, token },
      })
      initiateDataFromUrl(store)
      // refresh currentUser in idb
      app.db.currentUser.clear()
      app.db.currentUser.put({ name, token })

      setTimeout(() => {
        if (name) {
          setName('')
          setPassword('')
        }
      }, 2000)
    },
  }),
  withHandlers({
    onBlurName: ({
      password,
      setName,
      setNameErrorText,
      fetchLogin
    }) => (e, client, refetch) => {
      setNameErrorText('')
      const name = e.target.value
      setName(name)
      if (!name) {
        setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      } else if (password) {
        setTimeout(() => fetchLogin(client, refetch))
      }
    },
    onBlurPassword: ({
      name,
      setPassword,
      setPasswordErrorText,
      fetchLogin
    }) => (e, client, refetch) => {
      setPasswordErrorText('')
      const password = e.target.value
      console.log('onBlurPassword:', {password,name})
      setPassword(password)
      if (!password) {
        setPasswordErrorText('Bitte Passwort eingeben')
      } else if (name) {
        setTimeout(() => fetchLogin(client, refetch))
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
  setShowPass,
  nameErrorText,
  passwordErrorText,
  setNameErrorText,
  setPasswordErrorText,
  onBlurName,
  onBlurPassword,
  fetchLogin,
}: {
  store: Object,
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
