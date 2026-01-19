import { useState, useEffect, type ChangeEvent, type FocusEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField2 } from '../../../shared/TextField2.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { Select } from '../../../shared/Select.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { user as userFragment } from '../../../shared/fragments.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Menu } from './Menu.tsx'

import type { UserId } from '../../../../models/apflora/UserId.ts'
import type { AdresseId } from '../../../../models/apflora/AdresseId.ts'

interface UserQueryResult {
  userById: {
    id: UserId
    name: string | null
    email: string | null
    role: string | null
    pass: string | null
    adresseId: AdresseId | null
  } | null
  allAdresses: {
    nodes: Array<{
      value: AdresseId
      label: string
    }>
  }
}

import styles from './index.module.css'

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

export const Component = () => {
  const { userId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editPassword, setEditPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [passwordErrorText, setPasswordErrorText] = useState('')
  const [password2ErrorText, setPassword2ErrorText] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  const { data, loading, error } = useQuery<UserQueryResult>(query, {
    variables: { id: userId },
  })

  const row = data?.userById ?? {}

  useEffect(() => {
    setErrors({})
  }, [row.id])

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)
    try {
      await apolloClient.mutate({
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
      return setErrors({ [field]: (error as Error).message })
    }
    setErrors({})
    if (field === 'name') {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeUser`],
      })
    }
  }

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
        setErrors({ pass: (error as Error).message })
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

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Benutzer"
          MenuBarComponent={Menu}
          menuBarProps={{
            row,
            editPassword,
            setEditPassword,
            passwordMessage,
            setPasswordMessage,
          }}
        />

        <div className={styles.scrollContainer}>
          <TextField2
            key={`${row.id}name`}
            name="name"
            label="Name (nur von Managern veränderbar)"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField2
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
            <div className={styles.passwordMessage}>{passwordMessage}</div>
          )}
          {(editPassword || errors.pass) && (
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
        </div>
      </div>
    </ErrorBoundary>
  )
}
