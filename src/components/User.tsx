import { rpc } from '../modules/api.ts'
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

// return type of the apflora.login function (auth.jwt_token)
interface LoginResult {
  role: string
  username: string
  token: string
}

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
  const [showPass, setShowPass] = useState(false)
  const [nameErrorText, setNameErrorText] = useState('')
  const [passwordErrorText, setPasswordErrorText] = useState('')
  // the account must set a new password before logging in
  // (require_new_password_on_next_login)
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false)
  // anon cannot read whether the account has a password - and nearly
  // every flagged account has one. So the field is always shown; the
  // server ignores the old password for accounts without one
  const [oldPasswordRequired, setOldPasswordRequired] = useState(true)

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

  // runs as anon: anon may read id, name and
  // require_new_password_on_next_login, but never pass
  const checkUserPassword = async (nameToCheck: string) => {
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
        variables: { name: nameToCheck },
      })
      return userResult?.data?.userByName
    } catch (error) {
      // never block the login attempt on a failed precheck
      console.log(error)
      return null
    }
  }

  // reads the live dom values: password helpers fill the fields
  // without focus or change events, so state would be stale (#823)
  // credentialsPassed is used after a password setup: the login
  // fields are unmounted then, so their refs are empty
  const fetchLogin = async (credentialsPassed?: {
    name?: string
    password?: string
  }) => {
    const nameToUse = credentialsPassed?.name ?? nameInput.current?.value ?? ''
    const passwordToUse =
      credentialsPassed?.password ?? passwordInput.current?.value ?? ''
    // a forced password change must not be bypassable by logging in
    // with the old password
    const userData = nameToUse ? await checkUserPassword(nameToUse) : null
    if (userData?.requireNewPasswordOnNextLogin) {
      setName(nameToUse)
      setNeedsPasswordSetup(true)
      return
    }
    let result
    try {
      // PostgREST rpc to apflora.login, which signs the JWT in the
      // database. The returned token works on both apis during the
      // PostgREST migration (dual-stack).
      result = await rpc<LoginResult>('login', {
        username: nameToUse,
        pass: passwordToUse,
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
      token: result?.token ?? null,
      id: userResult?.data?.userByName?.id ?? null,
    })
    // this is easiest way to make sure everything is correct
    // as client is rebuilt with new settings
    window.location.reload()
  }

  const onBlurName = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNameErrorText('')
    const nameToCheck = e.currentTarget.value
    setName(nameToCheck)
    if (!nameToCheck) {
      setNameErrorText('Geben Sie den Ihnen zugeteilten Benutzernamen ein')
      return
    }
    // switch to the setup dialog before the password is entered
    // (the fetchLogin guard catches what blur misses, e.g. fields
    // filled by password helpers without events)
    const userData = await checkUserPassword(nameToCheck)
    if (userData?.requireNewPasswordOnNextLogin) {
      setNeedsPasswordSetup(true)
    }
  }

  const onBlurPassword = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPasswordErrorText('')
    if (!e.currentTarget.value) {
      setPasswordErrorText('Bitte Passwort eingeben')
    }
  }

  // login happens on Enter and on the anmelden button, not on blur (#823)
  // BEWARE: onKeyDown, not onKeyPress - browsers no longer fire
  // keypress for Enter, so the handler never ran (#823)
  const onKeyDownName = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  const onKeyDownPassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    if (!e.currentTarget.value) {
      setPasswordErrorText('Bitte Passwort eingeben')
      return
    }
    void fetchLogin()
  }

  const savePassword = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const oldPass = oldPasswordInput.current?.value

    try {
      await rpc('set_password', {
        p_username: name,
        p_new_pass: value,
        p_old_pass: oldPasswordRequired ? oldPass : null,
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
    void fetchLogin({ name, password: value })
  }

  const onClickShowPass = () => setShowPass(!showPass)
  const onMouseDownShowPass = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault()

  const { token, fetchingToken } = tokenState

  if (needsPasswordSetup) {
    return (
      <ErrorBoundary>
        <Dialog
          aria-labelledby="dialog-title"
          open={true}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="dialog-title">Passwort für {name}</DialogTitle>
          <div className={styles.setupDiv}>
            <p className={styles.setupMessage}>
              Sie müssen ein neues Passwort setzen. Bestätigen Sie es mit dem
              aktuellen (falls vorhanden).
            </p>
            {oldPasswordRequired && (
              <FormControl
                fullWidth
                variant="standard"
                className={styles.oldPasswordField}
              >
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
            <Password
              errors={{}}
              saveToDb={savePassword}
              showChangePasswordButton={false}
            />
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
        fullWidth
        maxWidth="xs"
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
              onBlur={(e) => void onBlurName(e)}
              autoFocus
              onKeyDown={onKeyDownName}
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
              onKeyDown={onKeyDownPassword}
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
          <Button
            color="primary"
            onClick={() => void fetchLogin()}
          >
            anmelden
          </Button>
        </DialogActions>
      </Dialog>
    </ErrorBoundary>
  )
}
