// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import updateUserByIdGql from './updateUserById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState('errors', 'setErrors', ({})),
  withState('editPassword', 'setEditPassword', false),
  withState('password', 'setPassword', ''),
  withState('password2', 'setPassword2', ''),
  withState('showPass', 'setShowPass', false),
  withState('showPass2', 'setShowPass2', false),
  withState('passwordErrorText', 'setPasswordErrorText', ''),
  withState('password2ErrorText', 'setPassword2ErrorText', ''),
  withHandlers({
    saveToDb: ({
      refetchTree,
      setErrors,
      errors
    }) => async ({
      row,
      field,
      value,
      updateUser
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
                __typename: 'User',
              },
              __typename: 'User',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors(({}))
      if (['artId'].includes(field)) refetchTree()
    },
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
      setPassword2,
      setPassword2ErrorText,
      setShowPass,
      setShowPass2,
      setEditPassword,
    }) => (e, client, refetch) => {
      setPassword2ErrorText('')
      const password2 = e.target.value
      setPassword2(password2)
      if (!password2) {
        setPassword2ErrorText('Bitte Passwort eingeben')
      } else if (password !== password2) {
        setPassword2ErrorText('Die Passwörter stimmen nicht überein')
      } else {
        // TODO: edit password
        // then tell user if it worked
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
        props.setErrors(({}))
      }
    },
  }),
)

const User = ({
  treeName,
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
}: {
  treeName: String,
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
}) => (
  <Query query={data1Gql}>
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`
      const id = get(data, `${treeName}.activeNodeArray[1]`)

      return (
        <Query query={data2Gql} variables={{ id }}>
          {({ loading, error, data, client }) => {
            if (loading)
              return (
                <Container>
                  <FieldsContainer>Lade...</FieldsContainer>
                </Container>
              )
            if (error) return `Fehler: ${error.message}`

            const row = get(data, 'userById')
            let roleWerte = sortBy(
              [
                {
                  value: 'apflora_reader',
                  label: 'reader',
                  sort: 1,
                },
                {
                  value: 'apflora_freiwillig',
                  label: 'freiwillig',
                  sort: 2,
                },
                {
                  value: 'apflora_artverantwortlich',
                  label: 'artverantwortlich',
                  sort: 3,
                },
                {
                  value: 'apflora_manager',
                  label: 'manager',
                  sort: 4,
                },
              ],
              'sort'
            )
            console.log('User rendering, showPass2:', showPass2)

            return (
              <ErrorBoundary>
                <Container>
                  <FormTitle apId={id} title="Aktionsplan" />
                  <Mutation mutation={updateUserByIdGql}>
                    {(updateUser, { data }) => (
                      <FieldsContainer>
                        <TextField
                          key={`${row.id}name`}
                          label="Name"
                          value={row.name}
                          saveToDb={value =>
                            saveToDb({ row, field: 'name', value, updateUser })
                          }
                          error={errors.name}
                          helperText="Nur von Managern veränderbar"
                        />
                        <TextField
                          key={`${row.id}email`}
                          label="Email"
                          value={row.email}
                          saveToDb={value =>
                            saveToDb({ row, field: 'email', value, updateUser })
                          }
                          error={errors.email}
                          helperText="Bitte aktuell halten, damit wir Sie bei Bedarf kontaktieren können"
                        />
                        <RadioButtonGroup
                          key={`${row.id}role`}
                          value={row.role}
                          dataSource={roleWerte}
                          saveToDb={value =>
                            saveToDb({ row, field: 'role', value, updateUser })
                          }
                          error={errors.role}
                          label="Rolle"
                          helperText="Nur von Managern veränderbar"
                        />
                        {
                          !editPassword &&
                          <div>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => setEditPassword(true)}
                            >
                              Passwort ändern
                            </Button>
                          </div>
                        }
                        {
                          editPassword &&
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
  
                        }
                        {
                          editPassword && !!password &&
                          <FormControl
                            error={!!password2ErrorText}
                            fullWidth
                            aria-describedby="passwortHelper"
                          >
                            <InputLabel htmlFor="passwort">Passwort wiederholen</InputLabel>
                            <StyledInput
                              id="passwort2"
                              type={showPass2 ? 'text' : 'password'}
                              defaultValue={password2}
                              onBlur={e => onBlurPassword2(e, client)}
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
                                    {showPass2 ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                            <FormHelperText id="passwortHelper">
                              {password2ErrorText}
                            </FormHelperText>
                          </FormControl>
  
                        }
                      </FieldsContainer>
                    )}
                  </Mutation>
                </Container>
              </ErrorBoundary>
            )
          }}
        </Query>
      )
    }}
  </Query>
)

export default enhance(User)
