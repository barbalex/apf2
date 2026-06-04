import { useState, Suspense } from 'react'
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
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { query } from './query.ts'
import { TextField } from '../../../shared/TextField.tsx'
import { Error } from '../../../shared/Error.tsx'
import { updateUserById as updateUserByIdGql } from './updateUserById.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { logout } from '../../../../modules/logout.ts'

import type {
  UserId,
  AdresseId,
} from '../../../../models/apflora/public/User.ts'

import styles from './index.module.css'

interface Row {
  id: UserId
  name: string | null
  email: string | null
  role: string | null
  pass: string | null
  adresseId: AdresseId | null
}

interface UserProps {
  username: string
  userOpen: boolean
  toggleUserOpen: () => void
}

export const User = ({ username, userOpen, toggleUserOpen }: UserProps) => {
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const { data, error } = useQuery({
    queryKey: ['userByNameForEkfBar', username],
    queryFn: async () =>
      apolloClient.query({
        query,
        variables: { name: username },
      }),
  })

  const row: Row = data?.data?.userByName ?? {}

  const [fieldErrors, setFieldErrors] = useState({})
  const userName = useAtomValue(userNameAtom)

  const [editPassword, setEditPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [password2ErrorText, setPassword2ErrorText] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const saveToDb = async (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate({
        mutation: updateUserByIdGql,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: error.message,
      }))
    }
    tsQueryClient.invalidateQueries({
      queryKey: ['userByNameForEkfBar'],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
  }

  const onBlurPassword = (e) => {
    setPasswordErrorText('')
    const password = e.target.value
    setPassword(password)
    if (!password) {
      setPasswordErrorText('Bitte Passwort eingeben')
    } else {
      setPassword2('')
    }
  }

  const onBlurPassword2 = async (event) => {
    let value = event.target.value
    if ([undefined, ''].includes(value)) value = null
    setPassword2ErrorText('')
    const password2 = event.target.value
    setPassword2(password2)
    if (!password2) {
      setPassword2ErrorText('Bitte Passwort eingeben')
    } else if (password !== password2) {
      setPassword2ErrorText('Die Passwörter stimmen nicht überein')
    } else {
      // edit password
      // then tell user if it worked
      try {
        await apolloClient.mutate({
          mutation: updateUserByIdGql,
          variables: {
            id: row?.id,
            pass: password2,
          },
        })
      } catch (error) {
        return setPasswordMessage(error.message)
      }
      setPasswordMessage(
        'Passwort gespeichert. Ihre aktuelle Anmeldung bleibt aktiv.',
      )
      setTimeout(() => {
        setPasswordMessage('')
      }, 5000)
      setPassword('')
      setPassword2('')
      setShowPass(false)
      setShowPass2(false)
      setEditPassword(false)
    }
  }

  return (
    <Suspense fallback={null}>
      <Dialog
        open={userOpen}
        onClose={toggleUserOpen}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">{`Benutzer: ${username}`}</DialogTitle>
        {error ?
          <Error error={error} />
        : <ErrorBoundary>
            <div className={styles.container}>
              <div className={styles.fieldsContainer}>
                <div className={styles.formContainer}>
                  <TextField
                    name="email"
                    label="Email"
                    type="text"
                    value={row.email}
                    saveToDb={saveToDb}
                    helperText="Bitte aktuell halten, damit wir Sie bei Bedarf kontaktieren können"
                    error={fieldErrors.email}
                  />
                  {!!passwordMessage && (
                    <div className={styles.passwordMessage}>
                      {passwordMessage}
                    </div>
                  )}
                  {!editPassword && !passwordMessage && (
                    <div>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setEditPassword(true)
                          setPasswordMessage('')
                        }}
                      >
                        Passwort ändern
                      </Button>
                    </div>
                  )}
                  <Button
                    className={styles.abmeldenButton}
                    variant="outlined"
                    color="primary"
                    onClick={logout}
                  >
                    Abmelden
                  </Button>
                  {editPassword && (
                    <FormControl
                      error={!!passwordErrorText}
                      fullWidth
                      aria-describedby="passwortHelper"
                      variant="standard"
                    >
                      <InputLabel htmlFor="passwort">Passwort</InputLabel>
                      <Input
                        className={styles.input}
                        id="passwort"
                        type={showPass ? 'text' : 'password'}
                        defaultValue={password}
                        onBlur={onBlurPassword}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            onBlurPassword(e)
                          }
                        }}
                        autoComplete="current-password"
                        autoCorrect="off"
                        spellCheck="false"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title={showPass ? 'verstecken' : 'anzeigen'}
                            >
                              <IconButton
                                onClick={() => setShowPass(!showPass)}
                                onMouseDown={(e) => e.preventDefault()}
                                size="large"
                              >
                                {showPass ?
                                  <MdVisibilityOff />
                                : <MdVisibility />}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText id="passwortHelper">
                        {passwordErrorText}
                      </FormHelperText>
                    </FormControl>
                  )}
                  {editPassword && !!password && (
                    <FormControl
                      error={!!password2ErrorText}
                      fullWidth
                      aria-describedby="passwortHelper"
                      variant="standard"
                    >
                      <InputLabel htmlFor="passwort">
                        Passwort wiederholen
                      </InputLabel>
                      <Input
                        className={styles.input}
                        id="passwort2"
                        type={showPass2 ? 'text' : 'password'}
                        defaultValue={password2}
                        onBlur={onBlurPassword2}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            onBlurPassword(e)
                          }
                        }}
                        autoCorrect="off"
                        spellCheck="false"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title={showPass2 ? 'verstecken' : 'anzeigen'}
                            >
                              <IconButton
                                onClick={() => setShowPass2(!showPass2)}
                                onMouseDown={(e) => e.preventDefault()}
                                size="large"
                              >
                                {showPass2 ?
                                  <MdVisibilityOff />
                                : <MdVisibility />}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText id="passwortHelper">
                        {password2ErrorText}
                      </FormHelperText>
                    </FormControl>
                  )}
                </div>
              </div>
            </div>
          </ErrorBoundary>
        }
        <DialogActions>
          <Button
            onClick={toggleUserOpen}
            color="inherit"
          >
            schliessen
          </Button>
        </DialogActions>
      </Dialog>
    </Suspense>
  )
}
