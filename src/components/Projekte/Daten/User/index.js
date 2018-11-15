// @flow
import React from 'react'
import styled from 'styled-components'
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
import app from 'ampersand-app'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import withData from './withData'
import updateUserByIdGql from './updateUserById'
import Select from '../../../shared/Select'
import withAllAdresses from './withAllAdresses'

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
const PasswordMessage = styled.div`
  padding-bottom: 10px;
`

const enhance = compose(
  withLocalData,
  withData,
  withAllAdresses,
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
    saveToDb: ({ refetchTree, setErrors, errors, data }) => async event => {
      const field = event.target.name
      let value = event.target.value
      if (value === undefined) value = null
      const row = get(data, 'userById', {})
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await app.client.mutate({
          mutation: updateUserByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
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
          },*/
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
    }) => event => {
      setPasswordErrorText('')
      const password = event.target.value
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
    }) => async event => {
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
          const fakeEvent = { target: { name: 'password', value: password2 } }
          await saveToDb(fakeEvent)
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
  passwordMessage,
  setPasswordMessage,
  dataAllAdresses,
  localData,
  data,
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
  passwordMessage: String,
  setPasswordMessage: () => void,
  dataAllAdresses: Object,
  localData: Object,
  data: Object,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`
  const id = get(
    localData,
    `${treeName}.activeNodeArray[1]`,
    '99999999-9999-9999-9999-999999999999',
  )

  if (data.loading || dataAllAdresses.loading)
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (data.error) return `Fehler: ${data.error.message}`
  if (dataAllAdresses.error) return `Fehler: ${dataAllAdresses.error.message}`

  const row = get(data, 'userById', {})
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
    'sort',
  )
  let adresses = sortBy(get(dataAllAdresses, 'allAdresses.nodes', []), 'name')
  adresses = adresses.map(el => ({
    value: el.id,
    label: el.name,
  }))

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={id}
          title="Benutzer"
          treeName={treeName}
          table="user"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}name`}
            name="name"
            label="Name"
            value={row.name}
            saveToDb={saveToDb}
            error={errors.name}
            helperText="Nur von Managern veränderbar"
          />
          <TextField
            key={`${row.id}email`}
            name="email"
            label="Email"
            value={row.email}
            saveToDb={saveToDb}
            error={errors.email}
            helperText="Bitte aktuell halten, damit wir Sie bei Bedarf kontaktieren können"
          />
          <RadioButtonGroup
            key={`${row.id}role`}
            name="role"
            value={row.role}
            dataSource={roleWerte}
            saveToDb={saveToDb}
            error={errors.role}
            label="Rolle"
            helperText="Nur von Managern veränderbar"
          />
          <Select
            key={`${row.id}adresseId`}
            name="adresseId"
            value={row.adresseId}
            field="adresseId"
            label="Zugehörige Adresse"
            options={adresses}
            saveToDb={saveToDb}
            error={errors.adresseId}
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
                onKeyPress={e => {
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
          {editPassword && !!password && (
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
                onBlur={onBlurPassword2}
                onKeyPress={e => {
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
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(User)
