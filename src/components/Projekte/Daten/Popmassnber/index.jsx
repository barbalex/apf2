import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import {
  pop,
  popmassnber,
  tpopmassnErfbeurtWerte,
} from '../../../shared/fragments'

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
  popId: 'UUID',
  jahr: 'Int',
  beurteilung: 'Int',
  bemerkungen: 'String',
}

const Popmassnber = () => {
  const { popmassnberId: id } = useParams()

  const client = useApolloClient()
  const queryClient = useQueryClient()
  const store = useContext(storeContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const row = useMemo(
    () => data?.popmassnberById ?? {},
    [data?.popmassnberById],
  )

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
            mutation updatePopmassnber(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updatePopmassnberById(
                input: {
                  id: $id
                  popmassnberPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                popmassnber {
                  ...PopmassnberFields
                  tpopmassnErfbeurtWerteByBeurteilung {
                    ...TpopmassnErfbeurtWerteFields
                  }
                  popByPopId {
                    ...PopFields
                  }
                }
              }
            }
            ${pop}
            ${popmassnber}
            ${tpopmassnErfbeurtWerte}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      if (['jahr', 'entwicklung'].includes(field)) {
        queryClient.invalidateQueries({ queryKey: [`treeQuery`] })
      }
    },
    [client, queryClient, row.id, store.user.name],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Massnahmen-Bericht Population" />
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
                name="beurteilung"
                label="Entwicklung"
                dataSource={data?.allTpopmassnErfbeurtWertes?.nodes ?? []}
                loading={loading}
                value={row.beurteilung}
                saveToDb={saveToDb}
                error={fieldErrors.beurteilung}
              />
              <TextField
                name="bemerkungen"
                label="Interpretation"
                type="text"
                multiLine
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

export default observer(Popmassnber)
