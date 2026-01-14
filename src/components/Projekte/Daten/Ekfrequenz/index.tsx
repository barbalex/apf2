import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.tsx'
import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { Kontrolljahre } from './Kontrolljahre.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { queryEkAbrechnungstypWertes } from './queryEkAbrechnungstypWertes.ts'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ekfrequenz } from '../../../shared/fragments.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Menu } from './Menu.tsx'

import type {
  Ekfrequenz,
  ApId,
  EkAbrechnungstypWerteCode,
} from '../../../../models/apflora/index.js'

import styles from './index.module.css'

interface EkfrequenzQueryResult {
  data?: {
    ekfrequenzById?: Ekfrequenz & {
      apByApId?: {
        id: ApId
        ekfrequenzsByApId?: {
          nodes: Ekfrequenz[]
        }
      }
    }
  }
}

interface EkAbrechnungstypWertesQueryResult {
  data?: {
    allEkAbrechnungstypWertes?: {
      nodes: Array<{
        value: EkAbrechnungstypWerteCode
        label: string | null
      }>
    }
  }
}

const fieldTypes = {
  apId: 'UUID',
  ektyp: 'EkType',
  anwendungsfall: 'String',
  code: 'String',
  kontrolljahre: '[Int]',
  kontrolljahreAb: 'EkKontrolljahreAb',
  bemerkungen: 'String',
  sort: 'Int',
  ekAbrechnungstyp: 'String',
}

const ektypeWertes = [
  { value: 'EK', label: 'EK' },
  { value: 'EKF', label: 'EKF' },
]
const kontrolljahreAbWertes = [
  { value: 'EK', label: 'Kontrolle' },
  { value: 'ANSIEDLUNG', label: 'Ansiedlung' },
]

export const Component = observer(() => {
  const { ekfrequenzId: id } = useParams()

  const store = useContext(MobxContext)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, loading, error, refetch } = useQuery<EkfrequenzQueryResult>(
    query,
    {
      variables: {
        id,
      },
    },
  )

  const {
    data: dataEkAbrechnungstypWertes,
    loading: loadingEkAbrechnungstypWertes,
    error: errorEkAbrechnungstypWertes,
  } = useQuery<EkAbrechnungstypWertesQueryResult>(queryEkAbrechnungstypWertes)

  const row = data?.ekfrequenzById ?? {}

  const saveToDb = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: store.user.name,
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
            mutation updateEkfrequenz(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateEkfrequenzById(
                input: {
                  id: $id
                  ekfrequenzPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekfrequenz {
                  ...EkfrequenzFields
                }
              }
            }
            ${ekfrequenz}
          `,
        variables,
      })
    } catch (error) {
      setFieldErrors({ [field]: (error as Error).message })
      return
    }
    setFieldErrors({})
    if (field === 'code') {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeEkfrequenz`],
      })
    }
    return
  }

  if (loading) return <Spinner />

  if (error) return <Error error={error} />
  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="EK-Frequenz"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <TextField
            name="code"
            label="Kürzel"
            type="text"
            value={row.code}
            saveToDb={saveToDb}
            error={fieldErrors.code}
          />
          <TextField
            name="anwendungsfall"
            label="Anwendungsfall"
            type="text"
            value={row.anwendungsfall}
            saveToDb={saveToDb}
            error={fieldErrors.anwendungsfall}
          />
          <RadioButtonGroup
            name="ektyp"
            dataSource={ektypeWertes}
            loading={false}
            label="EK-Typ"
            value={row.ektyp}
            saveToDb={saveToDb}
            error={fieldErrors.ektyp}
          />
          <div className={styles.kontrolljahrContainer}>
            <div className={styles.labelRow}>
              <div className={styles.styledLabel}>
                Kontrolljahre (= Anzahl Jahre nach Start bzw. Ansiedlung)
              </div>
            </div>
            <Kontrolljahre
              kontrolljahre={row?.kontrolljahre?.slice()}
              saveToDb={saveToDb}
              refetch={refetch}
              //kontrolljahreString={JSON.stringify(row.kontrolljahre)}
            />
          </div>
          <RadioButtonGroup
            name="kontrolljahreAb"
            dataSource={kontrolljahreAbWertes}
            loading={false}
            label="Kontrolljahre ab letzter"
            value={row.kontrolljahreAb}
            saveToDb={saveToDb}
            error={fieldErrors.kontrolljahreAb}
          />
          <div>
            {errorEkAbrechnungstypWertes ?
              errorEkAbrechnungstypWertes.message
            : <RadioButtonGroup
                name="ekAbrechnungstyp"
                dataSource={
                  dataEkAbrechnungstypWertes?.allEkAbrechnungstypWertes
                    ?.nodes ?? []
                }
                loading={loadingEkAbrechnungstypWertes}
                label="EK-Abrechnungstyp"
                value={row.ekAbrechnungstyp}
                saveToDb={saveToDb}
                error={fieldErrors.ekAbrechnungstyp}
              />
            }
          </div>
          <TextField
            name="bemerkungen"
            label="Bemerkungen"
            type="text"
            value={row.bemerkungen}
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
          <TextField
            name="sort"
            label="Sortierung"
            type="number"
            value={row.sort}
            saveToDb={saveToDb}
            error={fieldErrors.sort}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
})
