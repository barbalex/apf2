import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams, useLocation, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { getSnapshot } from 'mobx-state-tree'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { Select } from '../../../shared/Select.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { ziel as zielFragment } from '../../../shared/fragments.js'
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
const Subtitle = styled.h3`
  margin-top: 10px;
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.6);
  padding-bottom: 2px;
`

const fieldTypes = {
  apId: 'UUID',
  typ: 'Int',
  jahr: 'Int',
  bezeichnung: 'String',
  erreichung: 'String',
  bemerkungen: 'String',
}

const erreichungOptions = [
  { value: 'erreicht', label: 'erreicht' },
  { value: 'nicht', label: 'nicht erreicht' },
  { value: 'unsicher', label: 'unsicher' },
]

export const Component = memo(
  observer(() => {
    const { zielId: id } = useParams()
    const { search } = useLocation()
    const navigate = useNavigate()

    const client = useApolloClient()
    const queryClient = useQueryClient()

    const store = useContext(MobxContext)
    const {
      activeNodeArray,
      openNodes: openNodesRaw,
      setOpenNodes,
    } = store.tree
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
          queryKey: [`treeZiel`],
        })
        queryClient.invalidateQueries({
          queryKey: [`treeZieljahrs`],
        })
        queryClient.invalidateQueries({
          queryKey: [`treeZielsOfJahr`],
        })
        // if jahr of ziel is updated, activeNodeArray und openNodes need to change
        if (field === 'jahr') {
          const newActiveNodeArray = [...aNA]
          newActiveNodeArray[5] = +value
          const oldParentNodeUrl = aNA.toSpliced(-1)
          const newParentNodeUrl = newActiveNodeArray.toSpliced(-1)
          const newOpenNodes = openNodes.map((n) => {
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
          <FormTitle
            title="Ziel"
            MenuBarComponent={Menu}
          />
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
            <Subtitle>Beurteilung</Subtitle>
            <Select
              name="erreichung"
              label="Ziel-Erreichung"
              options={erreichungOptions}
              loading={false}
              value={row.erreichung}
              saveToDb={saveToDb}
              error={fieldErrors.erreichung}
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
          </FormContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
