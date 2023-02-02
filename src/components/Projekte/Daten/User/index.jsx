import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from '@emotion/styled'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams, useLocation, Link } from 'react-router-dom'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryEkfTpops from './queryEkfTpops'
import Select from '../../../shared/Select'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import {
  tpopkontr as tpopkontrFragment,
  user as userFragment,
} from '../../../shared/fragments'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const ScrollContainer = styled.div`
  overflow-y: auto;
`
const StyledForm = styled.div`
  padding: 10px;
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
    label: 'reader (sieht fast alle Daten)',
  },
  {
    value: 'apflora_freiwillig',
    label:
      'freiwillig (sieht und ändert eigene Kontrollen und was dafür nötig ist)',
  },
  {
    value: 'apflora_ap_writer',
    label: `ap_writer (sieht fast alle Daten, ändert freigegebene Arten)`,
  },
  {
    value: 'apflora_ap_reader',
    label: 'ap_reader (sieht freigegebene Arten)',
  },
  {
    value: 'apflora_manager',
    label: 'manager (sieht und ändert fast alle Daten)',
  },
]

const fieldTypes = {
  name: 'String',
  email: 'String',
  role: 'String',
  pass: 'String',
  adresseId: 'UUID',
}

const User = () => {
  const { userId } = useParams()
  const { search } = useLocation()

  const store = useContext(storeContext)

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

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: userId,
    },
  })

  const row = data?.userById ?? {}

  const thisYear = new Date().getFullYear()
  const { data: dataEkfTpops, refetch: refetchEkfTpops } = useQuery(
    queryEkfTpops,
    {
      variables: {
        id: row.adresseId || '9999999999999999999999999',
        jahr: thisYear,
        include: !!row.adresseId,
      },
    },
  )
  const ekfTpops = dataEkfTpops?.ekfTpops?.nodes ?? []
  const hasEkfTpops = !!ekfTpops.length
  const ekfTpopsWithoutEkfThisYear = ekfTpops
    .filter((e) => e?.ekfInJahr?.totalCount === 0)
    .map((e) => e.id)
  const hasEkfTpopsWithoutEkfThisYear = !!ekfTpopsWithoutEkfThisYear.length

  useEffect(() => {
    setErrors({})
  }, [row.id])

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: gql`
            mutation updateUserForUser(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
            ) {
              updateUserById(
                input: {
                  id: $id
                  userPatch: {
                    ${field}: $${field}
                  }
                }
              ) {
                user {
                  ...UserFields
                }
              }
            }
            ${userFragment}
          `,
          variables: {
            id: row.id,
            [field]: value,
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (field === 'name') {
        store.queryClient.invalidateQueries({
          queryKey: [`treeUser`],
        })
      }
    },
    [client, row.id, store.queryClient],
  )
  const onBlurPassword = useCallback((event) => {
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
    async (event) => {
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
  const onClickCreateEkfForms = useCallback(async () => {
    const errors = []
    for (const tpopId of ekfTpopsWithoutEkfThisYear) {
      try {
        await client.mutate({
          mutation: gql`
            mutation createTpopkontrFromUser(
              $typ: String
              $tpopId: UUID
              $bearbeiter: UUID
              $jahr: Int
            ) {
              createTpopkontr(
                input: {
                  tpopkontr: {
                    typ: $typ
                    tpopId: $tpopId
                    bearbeiter: $bearbeiter
                    jahr: $jahr
                  }
                }
              ) {
                tpopkontr {
                  ...TpopkontrFields
                }
              }
            }
            ${tpopkontrFragment}
          `,
          variables: {
            tpopId,
            typ: 'Freiwilligen-Erfolgskontrolle',
            bearbeiter: row.adresseId,
            jahr: thisYear,
          },
        })
      } catch (error) {
        errors.push(error)
      }
    }
    if (errors.length) {
      errors.forEach((error) =>
        store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        }),
      )
    } else {
      store.enqueNotification({
        message: `${ekfTpopsWithoutEkfThisYear.length} EKF-Formulare erzeugt`,
        options: {
          variant: 'info',
        },
      })
      refetchEkfTpops()
    }
  }, [
    client,
    ekfTpopsWithoutEkfThisYear,
    refetchEkfTpops,
    row.adresseId,
    store,
    thisYear,
  ])

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  if (!row) return null

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title="Benutzer"
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
                  onClick={onClickCreateEkfForms}
                  title={`Erzeugt in ${ekfTpops.length} Teil-Population${
                    ekfTpops.length > 1 ? 'en' : ''
                  }, in de${
                    ekfTpops.length > 1 ? 'nen' : 'r'
                  } dieser Benutzer als EKF-Kontrolleur erfasst ist, EKF-Formulare für das Jahr ${thisYear}`}
                >
                  {`(Fehlende) EKF-Formulare für ${thisYear} erzeugen`}
                </StyledButton>
              )}
              {hasEkfTpops && (
                <StyledButton
                  variant="outlined"
                  component={Link}
                  to={`/Daten/Benutzer/${row.id}/EKF/${thisYear}${search}`}
                >
                  {`EKF-Formulare für ${thisYear} öffnen`}
                </StyledButton>
              )}
            </>
          }
        />
        <ScrollContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <StyledForm>
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
                options={data?.allAdresses?.nodes ?? []}
                loading={loading}
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
                  variant="standard"
                >
                  <InputLabel htmlFor="passwort">Neues Passwort</InputLabel>
                  <StyledInput
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
                    {passwordErrorText || (errors && !!errors.pass)
                      ? errors.pass
                      : 'Passwort muss mindestens 6 Zeichen lang sein und darf keine Zahl sein'}
                  </FormHelperText>
                </FormControl>
              )}
              {(editPassword || errors.pass) && !!password && (
                <FormControl
                  error={!!password2ErrorText}
                  fullWidth
                  aria-describedby="passwortHelper"
                  variant="standard"
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
            </StyledForm>
          </SimpleBar>
        </ScrollContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(User)
