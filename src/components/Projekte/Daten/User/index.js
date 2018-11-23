// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import { withApollo } from 'react-apollo'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateUserByIdGql from './updateUserById'
import Select from '../../../shared/Select'
import withAllAdresses from './withAllAdresses'
import mobxStoreContext from '../../../../mobxStoreContext'

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
  withApollo,
  withProps(() => ({ mobxStore: useContext(mobxStoreContext) })),
  withData,
  withAllAdresses,
)

const User = ({
  treeName,
  dataAllAdresses,
  data,
  client,
  refetchTree,
}: {
  treeName: String,
  dataAllAdresses: Object,
  data: Object,
  client: Object,
  refetchTree: () => void,
}) => {
  const mobxStore = useContext(mobxStoreContext)

  const [errors, setErrors] = useState({})
  const [editPassword, setEditPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [password2ErrorText, setPassword2ErrorText] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const id = get(
    mobxStore,
    `${treeName}.activeNodeArray[1]`,
    '99999999-9999-9999-9999-999999999999',
  )

  useEffect(() => setErrors({}), [id])

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

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = event.target.value
      if (value === undefined) value = null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
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
    [id],
  )
  const onBlurPassword = useCallback(event => {
    setPasswordErrorText('')
    const password = event.target.value
    setPassword(password)
    if (!password) {
      setPasswordErrorText('Bitte Passwort eingeben')
    } else {
      setPassword2('')
    }
  })
  const onBlurPassword2 = useCallback(
    async event => {
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
    [password],
  )

  if (data.loading || dataAllAdresses.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) return `Fehler: ${data.error.message}`
  if (dataAllAdresses.error) return `Fehler: ${dataAllAdresses.error.message}`
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
