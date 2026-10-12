import { useEffect, useReducer, useRef, useState } from 'react'
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
import { graphql } from '../gql/index.ts'
import { useAtom } from 'jotai'

import { useApolloClient } from '@apollo/client/react'

import { ErrorBoundary } from './shared/ErrorBoundary.tsx'
import { userAtom } from '../store/index.ts'

import styles from './User.module.css'

interface TokenState {
  token: string | null
  fetchingToken: boolean
}

type TokenAction = { type: 'reset' } | { type: 'set'; payload: string | null }

function tokenStateReducer(
  _state: TokenState,
  action: TokenAction,
): TokenState {
  switch (action.type) {
    case 'reset':
      return { token: null, fetchingToken: true }
    case 'set':
      return { token: action.payload, fetchingToken: false }
    default:
      throw new Error()
  }
}

export const User = () => {
  const apolloClient = useApolloClient()
  const [user, setUser] = useAtom(userAtom)

  const [showPass, setShowPass] = useState(false)
  const [nameErrorText, setNameErrorText] = useState('')
  const [passwordErrorText, setPasswordErrorText] = useState('')

  const [tokenState, dispatchTokenState] = useReducer(tokenStateReducer, {
    token: user.token,
    fetchingToken: true,
  })

  const nameInput = useRef<HTMLInputElement | null>(null)
  const passwordInput = useRef<HTMLInputElement | null>(null)

  // Sync tokenState with user atom from Jotai
  useEffect(() => {
    dispatchTokenState({ type: 'set', payload: user.token })
  }, [user.token])

  // reads the live dom values: password helpers fill the fields
  // without focus or change events, so state would be stale (#823)
  const fetchLogin = async () => {
    const nameToUse = nameInput.current?.value ?? ''
    const passwordToUse = passwordInput.current?.value ?? ''
    let result
    try {
      result = await apolloClient.mutate({
        mutation: graphql(`
          mutation logIn($name: String, $password: String) {
            login(input: { username: $name, pass: $password }) {
              jwtToken
            }
          }
        `),
        variables: {
          name: nameToUse,
          password: passwordToUse,
        },
      })
    } catch (error) {
      const message = (error as Error).message
      const isNamePassError =
        message?.includes('invalid user or password') ||
        message?.includes('permission denied for relation user')
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
        query: graphql(`
          query userLoginQuery($name: String!) {
            userByName(name: $name) {
              id
            }
          }
        `),
        variables: {
          name: nameToUse,
        },
      })
    } catch (error) {
      console.log(error)
    }
    setUser({
      name: nameToUse,
      token: result?.data?.login?.jwtToken ?? null,
      id: userResult?.data?.userByName?.id ?? null,
    })
    // this is easiest way to make sure everything is correct
    // as client is rebuilt with new settings
    window.location.reload()
  }

  const onBlurName = (e: React.FocusEvent<HTMLInputElement>) => {
    setNameErrorText('')
    if (!e.currentTarget.value) {
      setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
    }
  }

  const onBlurPassword = (e: React.FocusEvent<HTMLInputElement>) => {
    setPasswordErrorText('')
    if (!e.currentTarget.value) {
      setPasswordErrorText('Bitte Passwort eingeben')
    }
  }

  // login happens on Enter and on the anmelden button, not on blur (#823)
  const onKeyPressName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    if (!e.currentTarget.value) {
      setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      return
    }
    if (!passwordInput.current?.value) {
      passwordInput.current?.focus()
      return
    }
    void fetchLogin()
  }
  const onKeyPressPassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    if (!e.currentTarget.value) {
      setPasswordErrorText('Bitte Passwort eingeben')
      return
    }
    void fetchLogin()
  }
  const onClickShowPass = () => setShowPass(!showPass)
  const onMouseDownShowPass = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault()

  const { token, fetchingToken } = tokenState

  return (
    <ErrorBoundary>
      <Dialog
        aria-labelledby="dialog-title"
        open={!token && !fetchingToken}
      >
        <DialogTitle id="dialog-title">Anmeldung</DialogTitle>
        <div className={styles.div}>
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
              onBlur={onBlurName}
              autoFocus
              onKeyPress={onKeyPressName}
              className={`user-name ${styles.input}`}
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
              type={showPass ? 'text' : 'password'}
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
              className={`user-passwort ${styles.input}`}
            />
            <FormHelperText id="passwortHelper">
              {passwordErrorText}
            </FormHelperText>
          </FormControl>
        </div>
        <DialogActions>
          <Button color="primary" onClick={() => void fetchLogin()}>
            anmelden
          </Button>
        </DialogActions>
      </Dialog>
    </ErrorBoundary>
  )
}
