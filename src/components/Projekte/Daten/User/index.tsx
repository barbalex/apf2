import { apiFetch } from '../../../../modules/api.ts'
import { userSelect } from '../../../../modules/selects.ts'
import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField2 } from '../../../shared/TextField2.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { Select } from '../../../shared/Select.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'
import { Password } from './Password.tsx'

import type { ComponentType } from 'react'
import { apiUpdateByVariables } from '../../../../modules/api.ts'

import type { UserId } from '../../../../models/apflora/User.ts'
import type { AdresseId } from '../../../../models/apflora/Adresse.ts'

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
    nodes: {
      value: AdresseId
      label: string
    }[]
  }
}

import styles from './index.module.css'

// shared RadioButtonGroup's props are inferred from an untyped signature
// (dataSource infers as never, value as null);
// declare the shape this form passes
const TypedRadioButtonGroup = RadioButtonGroup as unknown as ComponentType<{
  name: string
  label: string
  dataSource: { value: string; label: string }[]
  value?: string | null | undefined
  saveToDb: (event: {
    target: { name?: string; value: string | number | null }
  }) => void
  error?: string | undefined
}>

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

export const Component = () => {
  const { userId } = useParams()

  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const [rows, adresses] = await Promise.all([
        apiFetch<NonNullable<UserQueryResult['userById']>[]>(
          `/v_user?id=eq.${userId}&select=${userSelect}`,
        ),
        apiFetch<NonNullable<UserQueryResult['allAdresses']>['nodes']>(
          `/adresse?order=name.asc&select=value:id,label:name`,
        ),
      ])
      return {
        userById: rows?.[0] ?? null,
        allAdresses: { nodes: adresses ?? [] },
      }
    },
  })

  const row: Partial<NonNullable<UserQueryResult['userById']>> =
    data?.userById ?? {}

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrors({})
  }, [row.id])

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)
    try {
      await apiUpdateByVariables('user', {
        id: row.id,
        [field]: value,
      })
    } catch (error) {
      return setErrors({ [field]: (error as Error).message })
    }
    setErrors({})
    void tsQueryClient.invalidateQueries({
      queryKey: ['user', userId],
    })
    if (field === 'name') {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeUser`],
      })
    }
  }

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Benutzer"
          MenuBarComponent={Menu}
          menuBarProps={{
            row,
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
          <TypedRadioButtonGroup
            key={`${row.id}role`}
            name="role"
            value={row.role}
            dataSource={roleWerte}
            saveToDb={(event) => void saveToDb(event)}
            error={errors.role}
            label="Rolle (nur von Managern veränderbar)"
          />
          <Select
            key={`${row.id}adresseId`}
            name="adresseId"
            value={row.adresseId ?? null}
            field="adresseId"
            label="Zugehörige Adresse"
            options={data?.allAdresses?.nodes ?? []}
            saveToDb={(event) => void saveToDb(event)}
            error={errors.adresseId ?? ''}
          />
          <Password
            errors={errors}
            saveToDb={saveToDb}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
