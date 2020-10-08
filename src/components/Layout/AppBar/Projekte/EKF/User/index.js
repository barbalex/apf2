import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import { useApolloClient, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'

import query from './data'
import TextField from '../../../../../shared/TextFieldFormik'
import Error from '../../../../../shared/Error'
import updateUserByIdGql from './updateUserById'
import objectsFindChangedKey from '../../../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../../../shared/ErrorBoundary'

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

const User = ({ username, userOpen, toggleUserOpen }) => {
  const { data, error, loading } = useQuery(query, {
    variables: { name: username },
  })
  const client = useApolloClient()
  const row = get(data, 'userByName') || {}

  const [editPassword, setEditPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [password2ErrorText, setPassword2ErrorText] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const variables = objectsEmptyValuesToNull(values)
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
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
    },
    [client, row],
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
              id: row.id,
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

  console.log('User rendering')

  if (loading) return null
  if (error) {
    const errors = [error]
    //console.log('AppBar Projekte Ekf User, error:', error.message)
    return <Error errors={errors} />
  }

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
            <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
              {({ handleSubmit, dirty }) => (
                <Form onBlur={() => dirty && handleSubmit()}>
                  <TextField
                    name="email"
                    label="Email"
                    helperText="Bitte aktuell halten, damit wir Sie bei Bedarf kontaktieren können"
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
                            >
                              {showPass ? <VisibilityOff /> : <Visibility />}
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
                            >
                              {showPass2 ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText id="passwortHelper">
                        {password2ErrorText}
                      </FormHelperText>
                    </FormControl>
                  )}
                </Form>
              )}
            </Formik>
          </FieldsContainer>
        </Container>
      </ErrorBoundary>
      <DialogActions>
        <Button onClick={toggleUserOpen}>schliessen</Button>
      </DialogActions>
    </Dialog>
  )
}

export default User
