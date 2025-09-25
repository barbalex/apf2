import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import {
  pop,
  popmassnber,
  tpopmassnErfbeurtWerte,
} from '../../../shared/fragments.js'
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
  popId: 'UUID',
  jahr: 'Int',
  beurteilung: 'Int',
  bemerkungen: 'String',
}

export const Component = memo(
  observer(() => {
    const { popmassnberId: id } = useParams()

    const store = useContext(MobxContext)

    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

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
          await apolloClient.mutate({
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
        if (['jahr', 'beurteilung'].includes(field)) {
          tsQueryClient.invalidateQueries({
            queryKey: [`treePopmassnber`],
          })
        }
      },
      [apolloClient, tsQueryClient, row.id, store.user.name],
    )

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="Massnahmen-Bericht Population"
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
        </Container>
      </ErrorBoundary>
    )
  }),
)
