import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { Select } from '../../../shared/Select.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { tpopkontrzaehl } from '../../../shared/fragments.js'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Menu } from './Menu.tsx'

import type { TpopkontrzaehlId } from '../../../../models/apflora/TpopkontrzaehlId.ts'
import type { TpopkontrId } from '../../../../models/apflora/TpopkontrId.ts'
import type { TpopkontrzaehlEinheitWerteCode } from '../../../../models/apflora/TpopkontrzaehlEinheitWerteCode.ts'
import type { TpopkontrzaehlMethodeWerteCode } from '../../../../models/apflora/TpopkontrzaehlMethodeWerteCode.ts'

interface TpopkontrzaehlQueryResult {
  tpopkontrzaehlById: {
    id: TpopkontrzaehlId
    einheit: TpopkontrzaehlEinheitWerteCode | null
    anzahl: number | null
    methode: TpopkontrzaehlMethodeWerteCode | null
  } | null
  allTpopkontrzaehlEinheitWertes: {
    nodes: Array<{
      id: string
      value: TpopkontrzaehlEinheitWerteCode
      label: string
    }>
  }
  allTpopkontrzaehlMethodeWertes: {
    nodes: Array<{
      id: string
      value: TpopkontrzaehlMethodeWerteCode
      label: string
    }>
  }
  otherZaehlOfEk: {
    nodes: Array<{
      id: TpopkontrzaehlId
      einheit: TpopkontrzaehlEinheitWerteCode | null
    }>
  }
}

import styles from './index.module.css'

const fieldTypes = {
  anzahl: 'Float',
  einheit: 'Int',
  methode: 'Int',
}

export const Component = observer(() => {
  const { tpopkontrzaehlId, tpopkontrId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, loading, error } = useQuery<TpopkontrzaehlQueryResult>(query, {
    variables: {
      id: tpopkontrzaehlId,
      tpopkontrId,
    },
  })

  const zaehlEinheitCodesAlreadyUsed = (data?.otherZaehlOfEk?.nodes ?? [])
    .map((n) => n.einheit)
    // prevent null values which cause error in query
    .filter((e) => !!e)

  // filter out already used in other zaehlung of same kontr
  const zaehlEinheitOptions = (
    data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
  ).filter((o) => !zaehlEinheitCodesAlreadyUsed.includes(o.value))

  const row = data?.tpopkontrzaehlById ?? {}

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
            mutation updateAnzahlForEkZaehl(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopkontrzaehlById(
                input: {
                  id: $id
                  tpopkontrzaehlPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopkontrzaehl {
                  ...TpopkontrzaehlFields
                }
              }
            }
            ${tpopkontrzaehl}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors({ [field]: (error as Error).message })
    }
    setFieldErrors({})
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehl`],
    })
  }

  // console.log('Tpopkontrzaehl rendering')

  if (loading) return <Spinner />

  if (error) return <Error errors={[error]} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Zählung"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <Select
            key={`${row?.id}einheit`}
            name="einheit"
            label="Einheit"
            options={zaehlEinheitOptions}
            loading={loading}
            value={row.einheit}
            saveToDb={saveToDb}
            error={fieldErrors.einheit}
          />
          <TextField
            name="anzahl"
            label="Anzahl"
            type="number"
            value={row.anzahl}
            saveToDb={saveToDb}
            error={fieldErrors.anzahl}
          />
          <RadioButtonGroup
            name="methode"
            label="Methode"
            dataSource={data?.allTpopkontrzaehlMethodeWertes?.nodes ?? []}
            value={row.methode}
            saveToDb={saveToDb}
            error={fieldErrors.methode}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
})
