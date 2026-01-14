import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { queryLists } from './queryLists.ts'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { erfkrit } from '../../../shared/fragments.ts'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Menu } from './Menu.tsx'

import type {
  Erfkrit,
  ApErfkritWerteCode,
} from '../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface ErfkritQueryResult {
  data?: {
    erfkritById?: Erfkrit
  }
}

interface ListsQueryResult {
  data?: {
    allApErfkritWertes?: {
      nodes: Array<{
        value: ApErfkritWerteCode
        label: string | null
      }>
    }
  }
}

const fieldTypes = {
  apId: 'UUID',
  erfolg: 'Int',
  kriterien: 'String',
}

export const Component = observer(() => {
  const { erfkritId: id } = useParams()

  const store = useContext(MobxContext)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, loading, error } = useQuery<ErfkritQueryResult>(query, {
    variables: {
      id,
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery<ListsQueryResult>(queryLists)

  const row = data?.erfkritById ?? {}

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
            mutation updateErfkrit(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateErfkritById(
                input: {
                  id: $id
                  erfkritPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                erfkrit {
                  ...ErfkritFields
                }
              }
            }
            ${erfkrit}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors({ [field]: (error as Error).message })
    }
    setFieldErrors({})
    tsQueryClient.invalidateQueries({
      queryKey: [`treeErfkrit`],
    })
  }

  if (loading) return <Spinner />

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Erfolgs-Kriterium"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <RadioButtonGroup
            name="erfolg"
            label="Beurteilung"
            dataSource={dataLists?.allApErfkritWertes?.nodes ?? []}
            loading={loadingLists}
            value={row.erfolg}
            saveToDb={saveToDb}
            error={fieldErrors.erfolg}
          />
          <TextField
            name="kriterien"
            label="Kriterien"
            type="text"
            multiLine
            value={row.kriterien}
            saveToDb={saveToDb}
            error={fieldErrors.kriterien}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
})
