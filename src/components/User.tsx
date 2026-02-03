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
import { gql } from '@apollo/client'
import { useAtom } from 'jotai'

import { useApolloClient } from '@apollo/client/react'

import { ErrorBoundary } from './shared/ErrorBoundary.tsx'
import { Password } from './Projekte/Daten/User/Password.tsx'
import { userAtom } from '../store/index.ts'

import styles from './User.module.css'

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

export const User = () => {
  const apolloClient = useApolloClient()
  const [user, setUser] = useAtom(userAtom)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [nameErrorText, setNameErrorText] = useState('')
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false)
  const [userId, setUserId] = useState(null)

  const [tokenState, dispatchTokenState] = useReducer(tokenStateReducer, {
    token: user.token,
    fetchingToken: true,
  })

  const nameInput = useRef(null)
  const passwordInput = useRef(null)

  // Sync tokenState with user atom from Jotai
  useEffect(() => {
    dispatchTokenState({ type: 'set', payload: user.token })
  }, [user.token])

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
      })
    } catch (error) {
      const isNamePassError =
        error?.message?.includes('invalid user or password') ||
        error?.message?.includes('permission denied for relation user')
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
    setUser({
      name: nameToUse,
      token: result?.data?.login?.jwtToken,
      id: userResult?.data?.userByName?.id,
    })
    // this is easiest way to make sure everything is correct
    // as client is rebuilt with new settings
    window.location.reload(true)
  }

  const onBlurName = async (e) => {
    setNameErrorText('')
    const name = e.target.value
    setName(name)
    if (!name) {
      setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      return
    }
    
    // Check if user exists and has a password
    try {
      const userResult = await apolloClient.query({
        query: gql`
          query checkUserPassword($name: String!) {
            userByName(name: $name) {
              id
              pass
            }
          }
        `,
        variables: { name },
      })
      
      const userData = userResult?.data?.userByName
      if (!userData) {
        setNameErrorText('Benutzer nicht gefunden')
        return
      }
      
      if (!userData.pass) {
        // User has no password - show password setup
        setUserId(userData.id)
        setNeedsPasswordSetup(true)
        return
      }
      
      // User has password - proceed with normal login
      if (password) {
        setTimeout(() => fetchLogin({ name }))
      }
    } catch (error) {
      setNameErrorText('Fehler beim Überprüfen des Benutzers')
      console.log(error)
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

  const savePassword = async (event) => {
    const field = event.target.name
    const value = event.target.value
    
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation updateUserPassword($id: UUID!, $pass: String) {
            updateUserById(input: { id: $id, userPatch: { pass: $pass } }) {
              user {
                id
                name
                pass
              }
            }
          }
        `,
        variables: {
          id: userId,
          pass: value,
        },
      })
      
      // Password set successfully, proceed with login
      setNeedsPasswordSetup(false)
      setTimeout(() => fetchLogin({ name, password: value }))
    } catch (error) {
      throw error
    }
  }

  const { token, fetchingToken } = tokenState

  if (needsPasswordSetup) {
    return (
      <ErrorBoundary>
        <Dialog
          aria-labelledby="dialog-title"
          open={true}
          maxWidth="sm"
          fullWidth
          scroll="body"
        >
          <DialogTitle id="dialog-title">
            Passwort einrichten für {name}
          </DialogTitle>
          <div className={styles.setupDiv}>
            <p className={styles.setupMessage}>
              Ihr Konto hat noch kein Passwort. Bitte richten Sie ein sicheres
              Passwort ein.
            </p>
            <Password errors={{}} saveToDb={savePassword} showChangePasswordButton={false} />
          </div>
        </Dialog>
      </ErrorBoundary>
    )
  }

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
              defaultValue={name}
              onBlur={onBlurName}
              autoFocus
              onKeyPress={onKeyPressName}
              className={`user-name ${styles.input}`}
            />
            <FormHelperText id="nameHelper">{nameErrorText}</FormHelperText>
          </FormControl>
          {name && !needsPasswordSetup && (
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
                className={`user-passwort ${styles.input}`}
              />
              <FormHelperText id="passwortHelper">
                {passwordErrorText}
              </FormHelperText>
            </FormControl>
          )}
        </div>
        {name && !needsPasswordSetup && (
          <DialogActions>
            <Button
              color="primary"
              onClick={fetchLogin}
            >
              anmelden
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </ErrorBoundary>
  )
}
