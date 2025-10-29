import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

import { container, formContainer } from './Projekt.module.css'

const fieldTypes = {
  name: 'String',
}

export const Component = observer(() => {
  const { projId } = useParams()

  const store = useContext(MobxContext)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: projId,
    },
  })

  const row = data?.projektById ?? {}

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
            mutation updateProjekt(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateProjektById(
                input: {
                  id: $id
                  projektPatch: { 
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                projekt {
                  id
                  name
                  changedBy
                }
              }
            }
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors({ [field]: error.message })
    }
    setFieldErrors({})
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
  }

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={container}>
        <FormTitle title="Projekt" />
        <div className={formContainer}>
          <TextField
            name="name"
            label="Name"
            type="text"
            value={row.name}
            saveToDb={saveToDb}
            error={fieldErrors.name}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
})
