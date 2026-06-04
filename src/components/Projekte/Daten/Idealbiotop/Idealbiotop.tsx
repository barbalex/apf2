import { useState, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { Form, useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { DateField } from '../../../shared/Date.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { idealbiotop } from '../../../shared/fragments.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { Idealbiotop } from '../../../../models/apflora/index.tsx'

import styles from './Idealbiotop.module.css'

interface IdealbiotopQueryResult {
  allIdealbiotops?: {
    nodes: Idealbiotop[]
  }
}

const fieldTypes = {
  apId: 'UUID',
  erstelldatum: 'Date',
  hoehenlage: 'String',
  region: 'String',
  exposition: 'String',
  besonnung: 'String',
  hangneigung: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  wasserhaushalt: 'String',
  konkurrenz: 'String',
  moosschicht: 'String',
  krautschicht: 'String',
  strauchschicht: 'String',
  baumschicht: 'String',
  bemerkungen: 'String',
}

export const Component = () => {
  const { apId } = useParams()

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery({
    queryKey: ['idealbiotop', apId],
    queryFn: async () => {
      const result = await apolloClient.query<IdealbiotopQueryResult>({
        query,
        variables: { id: apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const row = data?.allIdealbiotops?.nodes?.[0] ?? {}

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }

    try {
      await apolloClient.mutate({
        mutation: gql`
            mutation updateIdealbiotop(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateIdealbiotopById(
                input: {
                  id: $id
                  idealbiotopPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                idealbiotop {
                  ...IdealbiotopFields
                }
              }
            }
            ${idealbiotop}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    // Invalidate query to refetch data
    tsQueryClient.invalidateQueries({
      queryKey: ['idealbiotop', apId],
    })
  }

  return (
    <ErrorBoundary>
      <FormTitle title="Idealbiotop" />
      <div className={styles.formContainer}>
        <DateField
          name="erstelldatum"
          label="Erstelldatum"
          value={row.erstelldatum}
          saveToDb={saveToDb}
          error={fieldErrors.erstelldatum}
        />
        <div className={styles.section}>Lage</div>
        <TextField
          name="hoehenlage"
          label="Höhe"
          type="text"
          multiLine
          value={row.hoehenlage}
          saveToDb={saveToDb}
          error={fieldErrors.hoehenlage}
        />
        <TextField
          name="region"
          label="Region"
          type="text"
          multiLine
          value={row.region}
          saveToDb={saveToDb}
          error={fieldErrors.region}
        />
        <TextField
          name="exposition"
          label="Exposition"
          type="text"
          multiLine
          value={row.exposition}
          saveToDb={saveToDb}
          error={fieldErrors.exposition}
        />
        <TextField
          name="besonnung"
          label="Besonnung"
          type="text"
          multiLine
          value={row.besonnung}
          saveToDb={saveToDb}
          error={fieldErrors.besonnung}
        />
        <TextField
          name="hangneigung"
          label="Hangneigung"
          type="text"
          multiLine
          value={row.hangneigung}
          saveToDb={saveToDb}
          error={fieldErrors.hangneigung}
        />
        <div className={styles.section}>Boden</div>
        <TextField
          name="bodenTyp"
          label="Typ"
          type="text"
          multiLine
          value={row.bodenTyp}
          saveToDb={saveToDb}
          error={fieldErrors.bodenTyp}
        />
        <TextField
          name="bodenKalkgehalt"
          label="Kalkgehalt"
          type="text"
          multiLine
          value={row.bodenKalkgehalt}
          saveToDb={saveToDb}
          error={fieldErrors.bodenKalkgehalt}
        />
        <TextField
          name="bodenDurchlaessigkeit"
          label="Durchlässigkeit"
          type="text"
          multiLine
          value={row.bodenDurchlaessigkeit}
          saveToDb={saveToDb}
          error={fieldErrors.bodenDurchlaessigkeit}
        />
        <TextField
          name="bodenHumus"
          label="Humus"
          type="text"
          multiLine
          value={row.bodenHumus}
          saveToDb={saveToDb}
          error={fieldErrors.bodenHumus}
        />
        <TextField
          name="bodenNaehrstoffgehalt"
          label="Nährstoffgehalt"
          type="text"
          multiLine
          value={row.bodenNaehrstoffgehalt}
          saveToDb={saveToDb}
          error={fieldErrors.bodenNaehrstoffgehalt}
        />
        <TextField
          name="wasserhaushalt"
          label="Wasserhaushalt"
          type="text"
          multiLine
          value={row.wasserhaushalt}
          saveToDb={saveToDb}
          error={fieldErrors.wasserhaushalt}
        />
        <div className={styles.section}>Vegetation</div>
        <TextField
          name="konkurrenz"
          label="Konkurrenz"
          type="text"
          multiLine
          value={row.konkurrenz}
          saveToDb={saveToDb}
          error={fieldErrors.konkurrenz}
        />
        <TextField
          name="moosschicht"
          label="Moosschicht"
          type="text"
          multiLine
          value={row.moosschicht}
          saveToDb={saveToDb}
          error={fieldErrors.moosschicht}
        />
        <TextField
          name="krautschicht"
          label="Krautschicht"
          type="text"
          multiLine
          value={row.krautschicht}
          saveToDb={saveToDb}
          error={fieldErrors.krautschicht}
        />
        <TextField
          name="strauchschicht"
          label="Strauchschicht"
          type="text"
          multiLine
          value={row.strauchschicht}
          saveToDb={saveToDb}
          error={fieldErrors.strauchschicht}
        />
        <TextField
          name="baumschicht"
          label="Baumschicht"
          type="text"
          multiLine
          value={row.baumschicht}
          saveToDb={saveToDb}
          error={fieldErrors.baumschicht}
        />
        <TextField
          name="bemerkungen"
          label="Bemerkungen"
          type="text"
          multiLine
          value={row.bemerkungen}
          saveToDb={saveToDb}
          error={fieldErrors.bemerkungen}
        />
      </div>
    </ErrorBoundary>
  )
}
