import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.ts'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import {
  pop,
  popmassnber,
  tpopmassnErfbeurtWerte,
} from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type {
  PopmassnberId,
  PopId,
  ApId,
  TpopmassnErfbeurtWerteCode,
} from '../../../../models/apflora/index.js'

import styles from './index.module.css'

interface PopmassnberQueryResult {
  popmassnberById?: {
    id: PopmassnberId
    popId: PopId
    jahr: number | null
    beurteilung: TpopmassnErfbeurtWerteCode | null
    bemerkungen: string | null
    tpopmassnErfbeurtWerteByBeurteilung?: {
      code: TpopmassnErfbeurtWerteCode
      text: string | null
      sort: number | null
    }
    popByPopId?: {
      id: PopId
      apId: ApId
    }
  }
  allTpopmassnErfbeurtWertes?: {
    nodes: Array<{
      value: TpopmassnErfbeurtWerteCode
      label: string | null
    }>
  }
}

const fieldTypes = {
  popId: 'UUID',
  jahr: 'Int',
  beurteilung: 'Int',
  bemerkungen: 'String',
}

export const Component = observer(() => {
  const { popmassnberId: id } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, loading, error } = useQuery<PopmassnberQueryResult>(query, {
    variables: {
      id,
    },
  })

  const row = data?.popmassnberById ?? {}

  const saveToDb = async (event) => {
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
            mutation updatePopmassnber(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updatePopmassnberById(
                input: {
                  id: $id
                  popmassnberPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                popmassnber {
                  ...PopmassnberFields
                  tpopmassnErfbeurtWerteByBeurteilung {
                    ...TpopmassnErfbeurtWerteFields
                  }
                  popByPopId {
                    ...PopFields
                  }
                }
              }
            }
            ${pop}
            ${popmassnber}
            ${tpopmassnErfbeurtWerte}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors({ [field]: (error as Error).message })
    }
    setFieldErrors({})
    if (['jahr', 'beurteilung'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treePopmassnber`],
      })
    }
  }

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Massnahmen-Bericht Population"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <TextField
            name="jahr"
            label="Jahr"
            type="number"
            value={row.jahr}
            saveToDb={saveToDb}
            error={fieldErrors.jahr}
          />
          <RadioButtonGroup
            name="beurteilung"
            label="Entwicklung"
            dataSource={data?.allTpopmassnErfbeurtWertes?.nodes ?? []}
            loading={loading}
            value={row.beurteilung}
            saveToDb={saveToDb}
            error={fieldErrors.beurteilung}
          />
          <TextField
            name="bemerkungen"
            label="Interpretation"
            type="text"
            multiLine
            value={row.bemerkungen}
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
})
