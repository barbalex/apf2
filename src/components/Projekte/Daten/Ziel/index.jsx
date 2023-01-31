import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { ziel as zielFragment } from '../../../shared/fragments'
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
  const store = useContext(storeContext)
  const { activeNodeArray, openNodes, setOpenNodes } = store.tree

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
      store.tree.incrementRefetcher()
      // if jahr of ziel is updated, activeNodeArray und openNodes need to change
      if (field === 'jahr') {
        const newActiveNodeArray = [...activeNodeArray]
        newActiveNodeArray[5] = +value
        const oldParentNodeUrl = [...activeNodeArray]
        oldParentNodeUrl.pop()
        const newParentNodeUrl = [...newActiveNodeArray]
        newParentNodeUrl.pop()
        let newOpenNodes = openNodes.map((n) => {
          if (isEqual(n, activeNodeArray)) return newActiveNodeArray
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
      store.tree,
      client,
      activeNodeArray,
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

export default observer(Ziel)
