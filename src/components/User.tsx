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
import { gql as dynamicGql } from '../apolloGql.ts'
import { useAtom } from 'jotai'

import { useApolloClient } from '@apollo/client/react'

import { ErrorBoundary } from './shared/ErrorBoundary.tsx'
import { Password } from './Projekte/Daten/User/Password.tsx'
import { userAtom } from '../store/index.ts'

import styles from './User.module.css'

interface TokenState {
  token: string | null
  fetchingToken: boolean
}

interface CheckUserPasswordResult {
  userByName: {
    id: string
    requireNewPasswordOnNextLogin: boolean
  } | null
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

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [nameErrorText, setNameErrorText] = useState('')
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false)
  // set by the server when a password exists already: it must be
  // proved before a new one is accepted
  const [oldPasswordRequired, setOldPasswordRequired] = useState(false)

  const [tokenState, dispatchTokenState] = useReducer(tokenStateReducer, {
    token: user.token,
    fetchingToken: true,
  })

  const nameInput = useRef<HTMLInputElement | null>(null)
  const passwordInput = useRef<HTMLInputElement | null>(null)
  const oldPasswordInput = useRef<HTMLInputElement | null>(null)

  // Sync tokenState with user atom from Jotai
  useEffect(() => {
    dispatchTokenState({ type: 'set', payload: user.token })
  }, [user.token])

  // Focus password input when it becomes visible
  useEffect(() => {
    if (name && !needsPasswordSetup && passwordInput.current) {
      passwordInput.current.focus()
    }
  }, [name, needsPasswordSetup])

  // callbacks pass name or password
  // because state is not up to date yet
  // also used directly as the anmelden button's onClick handler,
  // where the click event destructures to no name/password
  const fetchLogin = async ({
    name: namePassed,
    password: passwordPassed,
  }: {
    name?: string
    password?: string
  }) => {
    const nameToUse = namePassed || name || nameInput.current?.value || ''
    const passwordToUse =
      passwordPassed || password || passwordInput.current?.value || ''
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

  const onBlurName = async (
    e:
      | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNameErrorText('')
    const name = e.currentTarget.value
    setName(name)
    if (!name) {
      setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      return
    }

    // Check if user exists and needs to set a password
    // pass is never read: anon must not see password hashes.
    // Users without a password always have
    // requireNewPasswordOnNextLogin = true (migration 02 default)
    try {
      const userResult = await apolloClient.query<CheckUserPasswordResult>({
        query: dynamicGql`
          query checkUserPassword($name: String!) {
            userByName(name: $name) {
              id
              requireNewPasswordOnNextLogin
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

      if (userData.requireNewPasswordOnNextLogin) {
        // User needs to set a new password
        setOldPasswordRequired(false)
        setNeedsPasswordSetup(true)
        return
      }

      // User has password - proceed with normal login
      if (password) {
        setTimeout(() => void fetchLogin({ name }))
      }
    } catch (error) {
      setNameErrorText('Fehler beim Überprüfen des Benutzers')
      console.log(error)
    }
  }

  const onBlurPassword = (
    e:
      | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPasswordErrorText('')
    const password = e.currentTarget.value
    setPassword(password)
    if (!password) {
      setPasswordErrorText('Bitte Passwort eingeben')
    } else if (name) {
      setTimeout(() => void fetchLogin({ password }))
    }
  }

  const onKeyPressName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') void onBlurName(e)
  }
  const onKeyPressPassword = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key === 'Enter' && onBlurPassword(e)
  const onClickShowPass = () => setShowPass(!showPass)
  const onMouseDownShowPass = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault()

  const savePassword = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const oldPass = oldPasswordInput.current?.value

    try {
      await apolloClient.mutate({
        mutation: dynamicGql`
          mutation setPassword($pUsername: String!, $pNewPass: String!, $pOldPass: String) {
            setPassword(input: { pUsername: $pUsername, pNewPass: $pNewPass, pOldPass: $pOldPass }) {
              uuid
            }
          }
        `,
        variables: {
          pUsername: name,
          pNewPass: value,
          pOldPass: oldPasswordRequired ? oldPass : null,
        },
      })
    } catch (error) {
      // Apollo Client 4 rejects with CombinedGraphQLErrors:
      // the server message is on the error itself
      const message = (error as Error).message ?? ''
      if (message.includes('altes Passwort erforderlich')) {
        // the account has a password already: ask for it, then retry
        setOldPasswordRequired(true)
      }
      // Password displays the error message
      throw error
    }

    // Password set successfully, proceed with login
    setNeedsPasswordSetup(false)
    setTimeout(() => void fetchLogin({ name, password: value }))
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
              {oldPasswordRequired ?
                'Sie müssen ein neues Passwort setzen. Bestätigen Sie es mit dem aktuellen Passwort.'
              : 'Ihr Konto hat noch kein Passwort. Bitte richten Sie ein sicheres Passwort ein.'}
            </p>
            {oldPasswordRequired && (
              <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="altes-passwort">
                  Aktuelles Passwort
                </InputLabel>
                <Input
                  id="altes-passwort"
                  inputRef={oldPasswordInput}
                  type="password"
                  autoComplete="current-password"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`user-altes-passwort ${styles.input}`}
                />
              </FormControl>
            )}
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
              onBlur={(e) => void onBlurName(e)}
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
              onClick={() => void fetchLogin({})}
            >
              anmelden
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </ErrorBoundary>
  )
}
