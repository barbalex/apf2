// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
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

import dataGql from './data.graphql'
import TextField from '../../shared/TextField'
import ErrorBoundary from '../../shared/ErrorBoundary'
import updateUserByIdGql from './updateUserById.graphql'

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

const enhance = compose(
  withState('errors', 'setErrors', {}),
  withState('editPassword', 'setEditPassword', false),
  withState('password', 'setPassword', ''),
  withState('password2', 'setPassword2', ''),
  withState('showPass', 'setShowPass', false),
  withState('showPass2', 'setShowPass2', false),
  withState('passwordErrorText', 'setPasswordErrorText', ''),
  withState('password2ErrorText', 'setPassword2ErrorText', ''),
  withState('passwordMessage', 'setPasswordMessage', ''),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({
      row,
      field,
      value,
      updateUser,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateUser({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateUserById: {
              user: {
                id: row.id,
                name: field === 'name' ? value : row.name,
                email: field === 'email' ? value : row.email,
                role: field === 'role' ? value : row.role,
                pass: field === 'pass' ? value : row.pass,
                adresseId: field === 'adresseId' ? value : row.adresseId,
                __typename: 'User',
              },
              __typename: 'User',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['name', 'role'].includes(field)) refetchTree('users')
    },
  }),
  withHandlers({
    onBlurPassword: ({
      setPassword,
      setPasswordErrorText,
      setShowPass2,
      setPassword2,
    }) => e => {
      setPasswordErrorText('')
      const password = e.target.value
      setPassword(password)
      if (!password) {
        setPasswordErrorText('Bitte Passwort eingeben')
      } else {
        setPassword2('')
      }
    },
    onBlurPassword2: ({
      password,
      setPassword,
      setPassword2,
      setPassword2ErrorText,
      setShowPass,
      setShowPass2,
      setEditPassword,
      saveToDb,
      setPasswordMessage,
    }) => async (e, row, updateUser) => {
      setPassword2ErrorText('')
      const password2 = e.target.value
      setPassword2(password2)
      if (!password2) {
        setPassword2ErrorText('Bitte Passwort eingeben')
      } else if (password !== password2) {
        setPassword2ErrorText('Die Passwörter stimmen nicht überein')
      } else {
        // edit password
        // then tell user if it worked
        try {
          await updateUser({
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
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  }),
)

const User = ({
  username,
  userOpen,
  toggleUserOpen,
  saveToDb,
  errors,
  editPassword,
  setEditPassword,
  showPass,
  setShowPass,
  showPass2,
  setShowPass2,
  password,
  password2,
  passwordErrorText,
  password2ErrorText,
  onBlurPassword,
  onBlurPassword2,
  passwordMessage,
  setPasswordMessage,
}: {
  username: string,
  userOpen: boolean,
  toggleUserOpen: () => void,
  saveToDb: () => void,
  errors: Object,
  editPassword: Boolean,
  setEditPassword: () => void,
  showPass: Boolean,
  setShowPass: () => void,
  showPass2: Boolean,
  setShowPass2: () => void,
  password: String,
  password2: String,
  passwordErrorText: String,
  password2ErrorText: String,
  onBlurPassword: () => void,
  onBlurPassword2: () => void,
  passwordMessage: String,
  setPasswordMessage: () => void,
}) => (
  <Dialog
    open={userOpen}
    onClose={toggleUserOpen}
    aria-labelledby="simple-dialog-title"
  >
    <DialogTitle id="simple-dialog-title">{`Benutzer: ${username}`}</DialogTitle>
    <Query query={dataGql} variables={{ name: username }}>
      {({ loading, error, data, client }) => {
        if (loading)
          return (
            <Container>
              <FieldsContainer>Lade...</FieldsContainer>
            </Container>
          )
        if (error) return `Fehler: ${error.message}`

        const row = get(data, 'userByName')

        return (
          <ErrorBoundary>
            <Container>
              <Mutation mutation={updateUserByIdGql}>
                {(updateUser, { data }) => (
                  <FieldsContainer>
                    <TextField
                      key={`${row.id}email`}
                      label="Email"
                      value={row.email}
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'email',
                          value,
                          updateUser,
                        })
                      }
                      error={errors.email}
                      helperText="Bitte aktuell halten, damit wir Sie bei Bedarf kontaktieren können"
                    />
                    {!!passwordMessage && (
                      <PasswordMessage>{passwordMessage}</PasswordMessage>
                    )}
                    {!editPassword &&
                      !passwordMessage && (
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
                          onBlur={e => onBlurPassword(e, client)}
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              onBlurPassword(e, client)
                            }
                          }}
                          autoComplete="current-password"
                          autoCorrect="off"
                          spellCheck="false"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPass(!showPass)}
                                onMouseDown={e => e.preventDefault()}
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
                    {editPassword &&
                      !!password && (
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
                            onBlur={e => onBlurPassword2(e, row, updateUser)}
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                onBlurPassword(e, client)
                              }
                            }}
                            autoCorrect="off"
                            spellCheck="false"
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPass2(!showPass2)}
                                  onMouseDown={e => e.preventDefault()}
                                  title={showPass2 ? 'verstecken' : 'anzeigen'}
                                >
                                  {showPass2 ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                          <FormHelperText id="passwortHelper">
                            {password2ErrorText}
                          </FormHelperText>
                        </FormControl>
                      )}
                  </FieldsContainer>
                )}
              </Mutation>
            </Container>
          </ErrorBoundary>
        )
      }}
    </Query>
    <DialogActions>
      <Button onClick={toggleUserOpen}>schliessen</Button>
    </DialogActions>
  </Dialog>
)

export default enhance(User)
