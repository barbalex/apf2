import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
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

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
`

const fieldTypes = {
  bemerkungen: 'String',
  aeId: 'UUID',
  apId: 'UUID',
}

export const Component = memo(
  observer(() => {
    const { assozartId: id } = useParams()

    const client = useApolloClient()
    const store = useContext(MobxContext)
    const queryClient = useQueryClient()

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, loading, error } = useQuery(query, {
      variables: {
        id,
      },
    })

    const row = useMemo(() => data?.assozartById ?? {}, [data?.assozartById])

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

    const saveToDb = useCallback(
      async (event) => {
        const field = event.target.name
        const value = ifIsNumericAsNumber(event.target.value)

        const variables = {
          id: row.id,
          [field]: value,
          changedBy: store.user.name,
        }
        try {
          await client.mutate({
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
          queryClient.invalidateQueries({
            queryKey: [`treeAssozart`],
          })
        }
      },
      [client, queryClient, row.id, store.user.name],
    )

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container data-id="assozart">
          <FormTitle
            title="assoziierte Art"
            MenuBarComponent={Menu}
          />
          <FormContainer>
            <SelectLoadingOptions
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
          </FormContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
