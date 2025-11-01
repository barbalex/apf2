import { useContext, useEffect, useReducer, useRef, useState } from 'react'
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
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { IdbContext } from '../idbContext.js'
import { MobxContext } from '../mobxContext.js'
import { getUserFromIdb } from '../modules/getUserFromIdb.js'
import { ErrorBoundary } from './shared/ErrorBoundary.jsx'

import { div, input } from './User.module.css'

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

export const User = observer(() => {
  const apolloClient = useApolloClient()
  const { idb } = useContext(IdbContext)
  const store = useContext(MobxContext)
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

  // callbacks pass name or password
  // because state is not up to date yet
  const fetchLogin = async ({ name: namePassed, password: passwordPassed }) => {
    const nameToUse = namePassed || name || nameInput.current.value
    const passwordToUse =
      passwordPassed || password || passwordInput.current.value
    let result
    try {
      result = await apolloClient.mutate({
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
    // Need userId to navigate freiwillige to the correct path
    let userResult
    try {
      userResult = await apolloClient.query({
        query: gql`
          query userLoginQuery($name: String!) {
            userByName(name: $name) {
              id
            }
          }
        `,
        variables: {
          name: nameToUse,
        },
      })
    } catch (error) {
      console.log(error)
    }
    // refresh currentUser in idb
    idb.currentUser.clear()
    await idb.currentUser.put({
      name,
      token: result?.data?.login?.jwtToken,
      id: userResult?.data?.userByName?.id,
    })
    // this is easiest way to make sure everything is correct
    // as client is rebuilt with new settings
    window.location.reload(true)
  }

  const onBlurName = (e) => {
    setNameErrorText('')
    const name = e.target.value
    setName(name)
    if (!name) {
      setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
    } else if (password) {
      setTimeout(() => fetchLogin({ name }))
    }
  }

  const onBlurPassword = (e) => {
    setPasswordErrorText('')
    const password = e.target.value
    setPassword(password)
    if (!password) {
      setPasswordErrorText('Bitte Passwort eingeben')
    } else if (name) {
      setTimeout(() => fetchLogin({ password }))
    }
  }

  const onKeyPressName = (e) => e.key === 'Enter' && onBlurName(e)
  const onKeyPressPassword = (e) => e.key === 'Enter' && onBlurPassword(e)
  const onClickShowPass = () => setShowPass(!showPass)
  const onMouseDownShowPass = (e) => e.preventDefault()

  useEffect(() => {
    let isActive = true
    getUserFromIdb({ idb }).then((user) => {
      if (!isActive) return

      dispatchTokenState({
        type: 'set',
        payload: user.token,
      })
      if (store.user.token !== user.token) {
        //console.log('User: setting store.user from idb.user')
        store.setUser({ name: user.name, token: user.token, id: user.id })
      }
    })

    return () => {
      isActive = false
    }
  }, [idb, store, store.user.token])

  const { token, fetchingToken } = tokenState

  return (
    <ErrorBoundary>
      <Dialog
        aria-labelledby="dialog-title"
        open={!token && !fetchingToken}
      >
        <DialogTitle id="dialog-title">Anmeldung</DialogTitle>
        <div className={div}>
          <FormControl
            error={!!nameErrorText}
            fullWidth
            aria-describedby="nameHelper"
            variant="standard"
          >
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              inputRef={nameInput}
              className="user-name"
              defaultValue={name}
              onBlur={onBlurName}
              autoFocus
              onKeyPress={onKeyPressName}
              className={input}
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
            <Input
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
                  <Tooltip title={showPass ? 'verstecken' : 'anzeigen'}>
                    <IconButton
                      onClick={onClickShowPass}
                      onMouseDown={onMouseDownShowPass}
                      size="large"
                    >
                      {showPass ?
                        <MdVisibilityOff />
                      : <MdVisibility />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              }
              className={input}
            />
            <FormHelperText id="passwortHelper">
              {passwordErrorText}
            </FormHelperText>
          </FormControl>
        </div>
        <DialogActions>
          <Button
            color="primary"
            onClick={fetchLogin}
          >
            anmelden
          </Button>
        </DialogActions>
      </Dialog>
    </ErrorBoundary>
  )
})
