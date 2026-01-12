import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { queryAeTaxonomies } from './queryAeTaxonomies.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { assozart } from '../../../shared/fragments.js'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Menu } from './Menu.jsx'

import styles from './index.module.css'

const fieldTypes = {
  bemerkungen: 'String',
  aeId: 'UUID',
  apId: 'UUID',
}

export const Component = observer(() => {
  const { assozartId: id } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const row = data?.assozartById ?? {}

  // do not include already choosen assozarten
  const assozartenOfAp = (row?.apByApId?.assozartsByApId?.nodes ?? [])
    .map((o) => o.aeId)
    // but do include the art included in the row
    .filter((o) => o !== row.aeId)
  const aeTaxonomiesfilter = (inputValue) =>
    inputValue ?
      assozartenOfAp.length ?
        {
          taxArtName: { includesInsensitive: inputValue },
          id: { notIn: assozartenOfAp },
        }
      : { taxArtName: { includesInsensitive: inputValue } }
    : { taxArtName: { isNull: false } }

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
                mutation updateAssozart(
                  $id: UUID!
                  $${field}: ${fieldTypes[field]}
                  $changedBy: String
                ) {
                  updateAssozartById(
                    input: {
                      id: $id
                      assozartPatch: {
                        ${field}: $${field}
                        changedBy: $changedBy
                      }
                    }
                  ) {
                    assozart {
                      ...AssozartFields
                      aeTaxonomyByAeId {
                        id
                        artname
                      }
                      apByApId {
                        artId
                        assozartsByApId {
                          nodes {
                            ...AssozartFields
                          }
                        }
                      }
                    }
                  }
                }
                ${assozart}
              `,
        variables,
      })
    } catch (error) {
      return setFieldErrors({ [field]: error.message })
    }
    setFieldErrors({})
    if (field === 'aeId') {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAssozart`],
      })
    }
  }

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div
        className={styles.container}
        data-id="assozart"
      >
        <FormTitle
          title="assoziierte Art"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <SelectLoadingOptions
            key={`${row?.id}aeId`}
            field="aeId"
            valueLabelPath="aeTaxonomyByAeId.taxArtName"
            label="Art"
            row={row}
            query={queryAeTaxonomies}
            filter={aeTaxonomiesfilter}
            queryNodesName="allAeTaxonomies"
            value={row.aeId}
            saveToDb={saveToDb}
            error={fieldErrors.aeId}
          />
          <TextField
            name="bemerkungen"
            label="Bemerkungen zur Assoziation"
            type="text"
            value={row.bemerkungen}
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
})
