import React, { useState, useCallback, useMemo, useContext } from 'react'
import styled from '@emotion/styled'
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
import { useApolloClient, useQuery } from '@apollo/client'

import query from './data'
import TextField from '../../../../../shared/TextField'
import Error from '../../../../../shared/Error'
import updateUserByIdGql from './updateUserById'
import ifIsNumericAsNumber from '../../../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../../../shared/ErrorBoundary'
import storeContext from '../../../../../../storeContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 24px;
  padding-top: 0;
  overflow: auto !important;
  height: 100%;
`
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const PasswordMessage = styled.div`
  padding-bottom: 10px;
`
const FormContainer = styled.div`
  padding: 10px;
`

const User = ({ username, userOpen, toggleUserOpen }) => {
  const store = useContext(storeContext)

  const { data, error, loading } = useQuery(query, {
    variables: { name: username },
  })
  const client = useApolloClient()
  const row = useMemo(() => data?.userByName ?? {}, [data?.userByName])

  const [fieldErrors, setFieldErrors] = useState({})

  const [editPassword, setEditPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [password2ErrorText, setPassword2ErrorText] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: updateUserByIdGql,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateUserById: {
              user: {
                ...variables,
                __typename: 'User',
              },
              __typename: 'User',
            },
          },
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
    },
    [client, row.id, store.user.name],
  )

  const onBlurPassword = useCallback((e) => {
    setPasswordErrorText('')
    const password = e.target.value
    setPassword(password)
    if (!password) {
      setPasswordErrorText('Bitte Passwort eingeben')
    } else {
      setPassword2('')
    }
  }, [])

  const onBlurPassword2 = useCallback(
    async (event) => {
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
          await client.mutate({
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
    },
    [client, password, row.id],
  )

  if (loading) return null
  if (error) return <Error error={error} />

  return (
    <Dialog
      open={userOpen}
      onClose={toggleUserOpen}
      aria-labelledby="simple-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">{`Benutzer: ${username}`}</DialogTitle>
      <ErrorBoundary>
        <Container>
          <FieldsContainer>
            <FormContainer>
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
                <PasswordMessage>{passwordMessage}</PasswordMessage>
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
              {editPassword && (
                <FormControl
                  error={!!passwordErrorText}
                  fullWidth
                  aria-describedby="passwortHelper"
                  variant="standard"
                >
                  <InputLabel htmlFor="passwort">Passwort</InputLabel>
                  <StyledInput
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
                        <IconButton
                          onClick={() => setShowPass(!showPass)}
                          onMouseDown={(e) => e.preventDefault()}
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
                  <StyledInput
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
                        <IconButton
                          onClick={() => setShowPass2(!showPass2)}
                          onMouseDown={(e) => e.preventDefault()}
                          title={showPass2 ? 'verstecken' : 'anzeigen'}
                          size="large"
                        >
                          {showPass2 ? <MdVisibilityOff /> : <MdVisibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="passwortHelper">
                    {password2ErrorText}
                  </FormHelperText>
                </FormControl>
              )}
            </FormContainer>
          </FieldsContainer>
        </Container>
      </ErrorBoundary>
      <DialogActions>
        <Button onClick={toggleUserOpen} color="inherit">
          schliessen
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default User
