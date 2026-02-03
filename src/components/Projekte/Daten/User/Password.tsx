import { useState, type ChangeEvent, type FocusEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import Tooltip from '@mui/material/Tooltip'

import styles from './index.module.css'

interface PasswordProps {
  editPassword: boolean
  errors: Record<string, string>
  passwordMessage: string
  setPasswordMessage: (message: string) => void
  saveToDb: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
}

export const Password = ({
  editPassword,
  errors,
  passwordMessage,
  setPasswordMessage,
  saveToDb,
}: PasswordProps) => {
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [password2ErrorText, setPassword2ErrorText] = useState('')

  const onBlurPassword = (event: FocusEvent<HTMLInputElement>) => {
    setPasswordErrorText('')
    const password = event.target.value
    setPassword(password)
    if (!password) {
      setPasswordErrorText('Bitte Passwort eingeben')
    } else {
      setPassword2('')
    }
  }

  const onBlurPassword2 = async (event: FocusEvent<HTMLInputElement>) => {
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
        const fakeEvent = { target: { name: 'pass', value: password2 } }
        await saveToDb(fakeEvent as ChangeEvent<HTMLInputElement>)
      } catch (error) {
        return setPasswordMessage((error as Error).message)
      }
      setPasswordMessage(
        'Passwort gespeichert. Ihre aktuelle Anmeldung bleibt aktiv.',
      )
      // can fire after component was unmounted...
      setTimeout(() => {
        setPasswordMessage('')
      }, 5000)
      setPassword('')
      setPassword2('')
      setShowPass(false)
      setShowPass2(false)
    }
  }

  if (!editPassword && !errors.pass) return null

  return (
    <>
      {!!passwordMessage && (
        <div className={styles.passwordMessage}>{passwordMessage}</div>
      )}
      <FormControl
        error={!!passwordErrorText}
        fullWidth
        aria-describedby="passwortHelper"
        variant="standard"
      >
        <InputLabel htmlFor="passwort">Neues Passwort</InputLabel>
        <Input
          id="passwort"
          name="pass"
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
          error={!!errors.pass}
          endAdornment={
            <InputAdornment position="end">
              <Tooltip title={showPass ? 'verstecken' : 'anzeigen'}>
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
          className={styles.input}
        />
        <FormHelperText id="passwortHelper">
          {passwordErrorText || (errors && !!errors.pass) ?
            errors.pass
          : 'Passwort muss mindestens 6 Zeichen lang sein und darf keine Zahl sein'
          }
        </FormHelperText>
      </FormControl>
      {!!password && (
        <FormControl
          error={!!password2ErrorText}
          fullWidth
          aria-describedby="passwortHelper"
          variant="standard"
        >
          <InputLabel htmlFor="passwort">Neues Passwort wiederholen</InputLabel>
          <Input
            id="passwort2"
            name="pass"
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
                <Tooltip title={showPass2 ? 'verstecken' : 'anzeigen'}>
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
            className={styles.input}
          />
          <FormHelperText id="passwortHelper">
            {password2ErrorText}
          </FormHelperText>
        </FormControl>
      )}
    </>
  )
}
