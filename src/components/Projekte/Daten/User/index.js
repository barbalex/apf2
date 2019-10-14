import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import ErrorBoundary from 'react-error-boundary'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryAdresses from './queryAdresses'
import queryEkfTpops from './queryEkfTpops'
import updateUserByIdGql from './updateUserById'
import Select from '../../../shared/Select'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: calc(100vh - 64px);
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
const StyledButton = styled(Button)`
  text-transform: none !important;
  margin-right: 10px !important;
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  &:hover {
    background-color: rgba(28, 74, 30, 0.2) !important;
  }
`

const roleWerte = [
  {
    value: 'apflora_reader',
    label: 'reader',
  },
  {
    value: 'apflora_freiwillig',
    label: 'freiwillig',
  },
  {
    value: 'apflora_artverantwortlich',
    label: 'artverantwortlich',
  },
  {
    value: 'apflora_manager',
    label: 'manager',
  },
]

const User = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
  const { activeNodeArray } = store[treeName]
  const client = useApolloClient()

  const [errors, setErrors] = useState({})
  const [editPassword, setEditPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [password2ErrorText, setPassword2ErrorText] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const id =
    activeNodeArray.length > 1
      ? activeNodeArray[1]
      : '99999999-9999-9999-9999-999999999999'
  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const {
    data: dataAdresses,
    loading: loadingAdresses,
    error: errorAdresses,
  } = useQuery(queryAdresses, { variables: { id } })

  const row = get(data, 'userById', {})

  const thisYear = new Date().getFullYear()
  const { data: dataEkfTpops } = useQuery(queryEkfTpops, {
    variables: {
      id: row.adresseId || 9999999999999999999999999,
      jahr: thisYear,
      include: !!row.adresseId,
    },
  })
  const ekfTpops = get(dataEkfTpops, 'ekfTpops.nodes') || []
  const hasEkfTpops = !!ekfTpops.length
  const ekfTpopsWithoutEkfThisYear = ekfTpops
    .filter(e => get(e, 'ekfInJahr.totalCount', 0) > 0)
    .map(e => e.id)
  const hasEkfTpopsWithoutEkfThisYear = !!ekfTpopsWithoutEkfThisYear.length
  console.log('User:', {
    row,
    thisYear,
    dataEkfTpops,
    ekfTpopsWithoutEkfThisYear,
    hasEkfTpopsWithoutEkfThisYear,
  })

  useEffect(() => {
    setErrors({})
  }, [row.id])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updateUserByIdGql,
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
      if (['name', 'role'].includes(field)) refetch.users()
    },
    [
      client,
      refetch,
      row.adresseId,
      row.email,
      row.id,
      row.name,
      row.pass,
      row.role,
    ],
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
  }, [])
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
          const fakeEvent = { target: { name: 'pass', value: password2 } }
          await saveToDb(fakeEvent)
        } catch (error) {
          setErrors({ pass: error.message })
          return setPasswordMessage(error.message)
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
    },
    [password, saveToDb],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (!row) return null
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.id}
          title="Benutzer"
          treeName={treeName}
          table="user"
          buttons={
            <>
              {!editPassword && !passwordMessage && (
                <StyledButton
                  variant="outlined"
                  onClick={() => {
                    setEditPassword(true)
                    setPasswordMessage('')
                  }}
                >
                  Passwort ändern
                </StyledButton>
              )}
              {hasEkfTpopsWithoutEkfThisYear && (
                <StyledButton
                  variant="outlined"
                  onClick={() => {
                    console.log('TODO')
                  }}
                  title={`Erzeugt in ${ekfTpops.length} Teil-Population${
                    ekfTpops.length > 1 ? 'en' : ''
                  }, in de${
                    ekfTpops.length > 1 ? 'nen' : 'r'
                  } dieser Benutzer als EKF-Kontrolleur erfasst ist, EKF-Formulare für das Jahr ${thisYear}`}
                >
                  {`EKF-Formulare für ${thisYear} erzeugen`}
                </StyledButton>
              )}
              {hasEkfTpops && !hasEkfTpopsWithoutEkfThisYear && (
                <StyledButton
                  variant="outlined"
                  onClick={() => {
                    console.log('TODO')
                  }}
                  title={`Druckt alle ${ekfTpops.length} EKF-Formulare für ${thisYear}`}
                >
                  {`EKF-Formulare für ${thisYear} drucken`}
                </StyledButton>
              )}
            </>
          }
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}name`}
            name="name"
            label="Name (nur von Managern veränderbar)"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField
            key={`${row.id}email`}
            name="email"
            label="Email"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
            helperText="Bitte email aktuell halten, damit wir Sie bei Bedarf kontaktieren können"
          />
          <RadioButtonGroup
            key={`${row.id}role`}
            name="role"
            value={row.role}
            dataSource={roleWerte}
            saveToDb={saveToDb}
            error={errors.role}
            label="Rolle (nur von Managern veränderbar)"
          />
          <Select
            key={`${row.id}adresseId`}
            name="adresseId"
            value={row.adresseId}
            field="adresseId"
            label="Zugehörige Adresse"
            options={get(dataAdresses, 'allAdresses.nodes', [])}
            loading={loadingAdresses}
            saveToDb={saveToDb}
            error={errors.adresseId}
          />
          {!!passwordMessage && (
            <PasswordMessage>{passwordMessage}</PasswordMessage>
          )}
          {(editPassword || errors.pass) && (
            <FormControl
              error={!!passwordErrorText}
              fullWidth
              aria-describedby="passwortHelper"
            >
              <InputLabel htmlFor="passwort">Neues Passwort</InputLabel>
              <StyledInput
                id="passwort"
                name="pass"
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
                error={!!errors.pass}
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
                {passwordErrorText || (errors && !!errors.pass)
                  ? errors.pass
                  : ''}
              </FormHelperText>
            </FormControl>
          )}
          {(editPassword || errors.pass) && !!password && (
            <FormControl
              error={!!password2ErrorText}
              fullWidth
              aria-describedby="passwortHelper"
            >
              <InputLabel htmlFor="passwort">
                Neues Passwort wiederholen
              </InputLabel>
              <StyledInput
                id="passwort2"
                name="pass"
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

export default observer(User)
