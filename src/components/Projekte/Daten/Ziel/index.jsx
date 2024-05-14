import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { getSnapshot } from 'mobx-state-tree'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField.jsx'
import FormTitle from '../../../shared/FormTitle/index.jsx'
import query from './query.js'
import storeContext from '../../../../storeContext.js'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber.js'
import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import Error from '../../../shared/Error.jsx'
import { ziel as zielFragment } from '../../../shared/fragments.js'
import Spinner from '../../../shared/Spinner.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
`
const FormContainer = styled.div`
  padding: 10px;
`

const fieldTypes = {
  apId: 'UUID',
  typ: 'Int',
  jahr: 'Int',
  bezeichnung: 'String',
}

const Ziel = () => {
  const { zielId: id } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()

  const client = useApolloClient()
  const queryClient = useQueryClient()

  const store = useContext(storeContext)
  const { activeNodeArray, openNodes: openNodesRaw, setOpenNodes } = store.tree
  const aNA = getSnapshot(activeNodeArray)
  const openNodes = getSnapshot(openNodesRaw)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const row = useMemo(() => data?.zielById ?? {}, [data?.zielById])

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
            mutation updateZiel(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateZielById(
                input: {
                  id: $id
                  zielPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ziel {
                  ...ZielFields
                }
              }
            }
            ${zielFragment}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      queryClient.invalidateQueries({
        queryKey: [`treeZieljahrFolders`],
      })
      // if jahr of ziel is updated, activeNodeArray und openNodes need to change
      if (field === 'jahr') {
        const newActiveNodeArray = [...aNA]
        newActiveNodeArray[5] = +value
        const oldParentNodeUrl = [...aNA]
        oldParentNodeUrl.pop()
        const newParentNodeUrl = [...newActiveNodeArray]
        newParentNodeUrl.pop()
        let newOpenNodes = openNodes.map((n) => {
          if (isEqual(n, aNA)) return newActiveNodeArray
          if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
          return n
        })
        navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
        setOpenNodes(newOpenNodes)
      }
    },
    [
      row.id,
      store.user.name,
      queryClient,
      client,
      aNA,
      openNodes,
      navigate,
      search,
      setOpenNodes,
    ],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Ziel" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <TextField
                name="jahr"
                label="Jahr"
                type="number"
                value={row.jahr}
                saveToDb={saveToDb}
                error={fieldErrors.jahr}
              />
              <RadioButtonGroup
                name="typ"
                label="Zieltyp"
                dataSource={data?.allZielTypWertes?.nodes ?? []}
                loading={loading}
                value={row.typ}
                saveToDb={saveToDb}
                error={fieldErrors.typ}
              />
              <TextField
                name="bezeichnung"
                label="Ziel"
                type="text"
                multiLine
                value={row.bezeichnung}
                saveToDb={saveToDb}
                error={fieldErrors.bezeichnung}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export const Component = observer(Ziel)
