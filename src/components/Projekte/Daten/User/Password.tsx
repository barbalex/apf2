import { useState, useEffect, type ChangeEvent, type FocusEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import Tooltip from '@mui/material/Tooltip'

import styles from './index.module.css'

interface PasswordProps {
  errors: Record<string, string>
  saveToDb: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
}

export const Password = ({ errors, saveToDb }: PasswordProps) => {
  const [editPassword, setEditPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [password2ErrorText, setPassword2ErrorText] = useState('')
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumbers: false,
    hasSpecialChars: false,
  })

  // Reset password fields when editPassword becomes false
  useEffect(() => {
    if (!editPassword) {
      setPassword('')
      setPassword2('')
      setShowPass(false)
      setShowPass2(false)
      setPasswordErrorText('')
      setPassword2ErrorText('')
    }
  }, [editPassword])

  const onBlurPassword = (event: FocusEvent<HTMLInputElement>) => {
    setPasswordErrorText('')
    const password = event.target.value
    setPassword(password)
    
    if (!password) {
      setPasswordErrorText('Bitte Passwort eingeben')
      setPasswordValidation({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumbers: false,
        hasSpecialChars: false,
      })
    } else {
      setPassword2('')
    }
  }

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value
    setPassword(password)
    
    // Validate password requirements in real-time
    setPasswordValidation({
      minLength: password.length >= 16,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
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
      setEditPassword(false)
    }
  }

  return (
    <>
      {!passwordMessage && (
        <Button
          variant="outlined"
          onClick={() => {
            setEditPassword(!editPassword)
            setPasswordMessage('')
          }}
          className={styles.button}
        >
          {editPassword ? 'Passwort ändern abbrechen' : 'Passwort ändern'}
        </Button>
      )}
      {!!passwordMessage && (
        <div className={styles.passwordMessage}>{passwordMessage}</div>
      )}
      {(editPassword || errors.pass) && (
        <>
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
              onChange={onChangePassword}
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
            <div className={styles.passwordRequirements}>
              <FormControlLabel
                control={<Checkbox checked={passwordValidation.minLength} disabled />}
                label="Mindestlänge 16"
              />
              <FormControlLabel
                control={<Checkbox checked={passwordValidation.hasLowercase} disabled />}
                label="Enthält Kleinbuchstaben"
              />
              <FormControlLabel
                control={<Checkbox checked={passwordValidation.hasUppercase} disabled />}
                label="Enthält Grossbuchstaben"
              />
              <FormControlLabel
                control={<Checkbox checked={passwordValidation.hasNumbers} disabled />}
                label="Enthält Nummern"
              />
              <FormControlLabel
                control={<Checkbox checked={passwordValidation.hasSpecialChars} disabled />}
                label="Enthält Sonderzeichen"
              />
            </div>
          )}
          {!!password && (
            <FormControl
              error={!!password2ErrorText}
              fullWidth
              aria-describedby="passwortHelper"
              variant="standard"
            >
              <InputLabel htmlFor="passwort">
                Neues Passwort wiederholen
              </InputLabel>
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
      )}
    </>
  )
}
