import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import TextField from '../../../shared/TextField'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { assozart } from '../../../shared/fragments'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const FormContainer = styled.div`
  padding: 10px;
`

const fieldTypes = {
  bemerkungen: 'String',
  aeId: 'UUID',
  apId: 'UUID',
}

const Assozart = () => {
  const { assozartId: id } = useParams()

  const client = useApolloClient()
  const store = useContext(storeContext)
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
    inputValue
      ? assozartenOfAp.length
        ? {
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
        store.queryClient.invalidateQueries({
          queryKey: [`treeAssozart`],
        })
      }
    },
    [client, row.id, store.queryClient, store.user.name],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container data-id="assozart">
        <FormTitle title="assoziierte Art" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
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
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Assozart)
