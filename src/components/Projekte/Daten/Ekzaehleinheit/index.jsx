import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { Select } from '../../../shared/Select.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { queryLists } from './queryLists.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments.js'
import { Menu } from './Menu.jsx'

import { container, formContainer } from './index.module.css'

const fieldTypes = {
  bemerkungen: 'String',
  apId: 'UUID',
  zaehleinheitId: 'UUID',
  zielrelevant: 'Boolean',
  notMassnCountUnit: 'Boolean',
  sort: 'Int',
}

export const Component = observer(() => {
  const { zaehleinheitId: id } = useParams()

  const store = useContext(MobxContext)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const row = data?.ekzaehleinheitById ?? {}

  const ekzaehleinheitenOfAp = (
    row?.apByApId?.ekzaehleinheitsByApId?.nodes ?? []
  ).map((o) => o.zaehleinheitId)
  // re-add this ones id
  const notToShow = ekzaehleinheitenOfAp.filter((o) => o !== row.zaehleinheitId)
  const zaehleinheitWerteFilter =
    notToShow.length ? { id: { notIn: notToShow } } : { id: { isNull: false } }
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists, {
    variables: {
      filter: zaehleinheitWerteFilter,
    },
  })

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
            mutation updateEkzaehleinheit(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateEkzaehleinheitById(
                input: {
                  id: $id
                  ekzaehleinheitPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekzaehleinheit {
                  ...EkzaehleinheitFields
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    ...TpopkontrzaehlEinheitWerteFields
                  }
                }
              }
            }
            ${ekzaehleinheit}
            ${tpopkontrzaehlEinheitWerte}
          `,
        variables,
      })
    } catch (error) {
      if (
        field === 'zielrelevant' &&
        (error.message.includes('doppelter Schlüsselwert') ||
          error.message.includes('duplicate key value'))
      ) {
        return setFieldErrors({
          [field]: 'Pro Art darf nur eine Einheit zielrelevant sein',
        })
      }
      return setFieldErrors({ [field]: error.message })
    }
    setFieldErrors({})
    if (['zaehleinheitId', 'sort'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeEkzaehleinheit`],
      })
    }
  }

  // console.log('Ekzaehleinheit rendering, loading:', loading)

  if (loading) return <Spinner />

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <div className={container}>
        <FormTitle
          title="EK-Zähleinheit"
          MenuBarComponent={Menu}
        />
        <div className={formContainer}>
          <Select
            name="zaehleinheitId"
            label="Zähleinheit"
            options={dataLists?.allTpopkontrzaehlEinheitWertes?.nodes ?? []}
            loading={loadingLists}
            value={row.zaehleinheitId}
            saveToDb={saveToDb}
            error={fieldErrors.zaehleinheitId}
          />
          <Checkbox2States
            name="zielrelevant"
            label="zielrelevant"
            value={row.zielrelevant}
            saveToDb={saveToDb}
            error={fieldErrors.zielrelevant}
          />
          {row.zielrelevant && (
            <Checkbox2States
              name="notMassnCountUnit"
              label="Entspricht bewusst keiner Massnahmen-Zähleinheit ('Anzahl Pflanzen' oder 'Anzahl Triebe')"
              value={row.notMassnCountUnit}
              saveToDb={saveToDb}
              error={fieldErrors.notMassnCountUnit}
            />
          )}
          <TextField
            name="sort"
            label="Sortierung"
            type="number"
            value={row.sort}
            saveToDb={saveToDb}
            error={fieldErrors.sort}
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
      </div>
    </ErrorBoundary>
  )
})
