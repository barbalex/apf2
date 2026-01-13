import { useContext, useState } from 'react'
import { isEqual } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
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

import styles from './Ziel.module.css'

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
  { value: 'nicht erreicht', label: 'nicht erreicht' },
  { value: 'unsicher', label: 'unsicher' },
]

export const Component = observer(() => {
  const { zielId: id } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const store = useContext(MobxContext)
  const { activeNodeArray, openNodes: openNodesRaw, setOpenNodes } = store.tree
  const aNA = getSnapshot(activeNodeArray)
  const openNodes = getSnapshot(openNodesRaw)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const row = data?.zielById ?? {}

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
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZiel`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    tsQueryClient.invalidateQueries({
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
  }

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Ziel"
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
          <h3 className={styles.subtitle}>Beurteilung</h3>
          <Select
            key={`${row?.id}erreichung`}
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
        </div>
      </div>
    </ErrorBoundary>
  )
})
