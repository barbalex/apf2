import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import Button from '@mui/material/Button'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import idbContext from '../idbContext'
import storeContext from '../storeContext'
import getUserFromIdb from '../modules/getUserFromIdb'
import ErrorBoundary from './shared/ErrorBoundary'

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

function tokenStateReducer(state, action) {
  switch (action.type) {
    case 'reset':
      return { token: null, fetchingToken: true }
    case 'set':
      return { token: action.payload, fetchingToken: false }
    default:
      throw new Error()
  }
}

const User = () => {
  const client = useApolloClient()
  const { idb } = useContext(idbContext)
  const store = useContext(storeContext)
  const { user } = store

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [nameErrorText, setNameErrorText] = useState('')
  const [passwordErrorText, setPasswordErrorText] = useState('')

  const [tokenState, dispatchTokenState] = useReducer(tokenStateReducer, {
    token: user.token,
    fetchingToken: true,
  })

  const nameInput = useRef(null)
  const passwordInput = useRef(null)

  const fetchLogin = useCallback(
    // callbacks pass name or password
    // because state is not up to date yet
    async ({ name: namePassed, password: passwordPassed }) => {
      const nameToUse = namePassed || name || nameInput.current.value
      const passwordToUse =
        passwordPassed || password || passwordInput.current.value
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation logIn($name: String, $password: String) {
              login(input: { username: $name, pass: $password }) {
                jwtToken
              }
            }
          `,
          variables: {
            name: nameToUse,
            password: passwordToUse,
          },
          optimisticResponse: {
            login: {
              username: name,
              jwtToken: '',
              __typename: 'Login',
            },
            __typename: 'Mutation',
          },
        })
      } catch (error) {
        const messages = error.graphQLErrors.map((x) => x.message)
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
      // refresh currentUser in idb
      idb.currentUser.clear()
      await idb.currentUser.put({
        name,
        token: get(result, 'data.login.jwtToken'),
      })
      // this is easiest way to make sure everything is correct
      // as client is rebuilt with new settings
      typeof window !== 'undefined' && window.location.reload(true)
    },
    [client, idb.currentUser, name, password],
  )
  const onBlurName = useCallback(
    (e) => {
      setNameErrorText('')
      const name = e.target.value
      setName(name)
      if (!name) {
        setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      } else if (password) {
        setTimeout(() => fetchLogin({ name }))
      }
    },
    [fetchLogin, password],
  )
  const onBlurPassword = useCallback(
    (e) => {
      setPasswordErrorText('')
      const password = e.target.value
      setPassword(password)
      if (!password) {
        setPasswordErrorText('Bitte Passwort eingeben')
      } else if (name) {
        setTimeout(() => fetchLogin({ password }))
      }
    },
    [fetchLogin, name],
  )
  const onKeyPressName = useCallback(
    (e) => e.key === 'Enter' && onBlurName(e),
    [onBlurName],
  )
  const onKeyPressPassword = useCallback(
    (e) => e.key === 'Enter' && onBlurPassword(e),
    [onBlurPassword],
  )
  const onClickShowPass = useCallback(() => setShowPass(!showPass), [showPass])
  const onMouseDownShowPass = useCallback((e) => e.preventDefault(), [])

  useEffect(() => {
    getUserFromIdb({ idb }).then((user) => {
      dispatchTokenState({
        type: 'set',
        payload: user.token,
      })
      if (store.user.token !== user.token) {
        //console.log('User: setting store.user from idb.user')
        store.setUser({ name: user.name, token: user.token })
      }
    })
  }, [idb, store, store.user.token])

  const { token, fetchingToken } = tokenState

  return (
    <ErrorBoundary>
      <StyledDialog
        aria-labelledby="dialog-title"
        open={!token && !fetchingToken}
      >
        <DialogTitle id="dialog-title">Anmeldung</DialogTitle>
        <StyledDiv>
          <FormControl
            error={!!nameErrorText}
            fullWidth
            aria-describedby="nameHelper"
            variant="standard"
          >
            <InputLabel htmlFor="name">Name</InputLabel>
            <StyledInput
              id="name"
              inputRef={nameInput}
              className="user-name"
              defaultValue={name}
              onBlur={onBlurName}
              autoFocus
              onKeyPress={onKeyPressName}
            />
            <FormHelperText id="nameHelper">{nameErrorText}</FormHelperText>
          </FormControl>
          <FormControl
            error={!!passwordErrorText}
            fullWidth
            aria-describedby="passwortHelper"
            variant="standard"
          >
            <InputLabel htmlFor="passwort">Passwort</InputLabel>
            <StyledInput
              id="passwort"
              inputRef={passwordInput}
              className="user-passwort"
              type={showPass ? 'text' : 'password'}
              defaultValue={password}
              onBlur={onBlurPassword}
              onKeyPress={onKeyPressPassword}
              autoComplete="current-password"
              autoCorrect="off"
              spellCheck="false"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={onClickShowPass}
                    onMouseDown={onMouseDownShowPass}
                    title={showPass ? 'verstecken' : 'anzeigen'}
                    size="large"
                  >
                    {showPass ? <MdVisibilityOff /> : <MdVisibility />}
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

export default observer(User)
