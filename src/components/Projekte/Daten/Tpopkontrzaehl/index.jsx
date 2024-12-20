import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { Select } from '../../../shared/Select.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { tpopkontrzaehl } from '../../../shared/fragments.js'
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
  anzahl: 'Float',
  einheit: 'Int',
  methode: 'Int',
}

export const Component = memo(
  observer(() => {
    const { tpopkontrzaehlId, tpopkontrId } = useParams()

    const client = useApolloClient()
    const queryClient = useQueryClient()
    const store = useContext(MobxContext)

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, loading, error } = useQuery(query, {
      variables: {
        id: tpopkontrzaehlId,
        tpopkontrId,
      },
    })

    const zaehlEinheitCodesAlreadyUsed = (data?.otherZaehlOfEk?.nodes ?? [])
      .map((n) => n.einheit)
      // prevent null values which cause error in query
      .filter((e) => !!e)

    // filter out already used in other zaehlung of same kontr
    const zaehlEinheitOptions = (
      data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
    ).filter((o) => !zaehlEinheitCodesAlreadyUsed.includes(o.value))

    const row = useMemo(
      () => data?.tpopkontrzaehlById ?? {},
      [data?.tpopkontrzaehlById],
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
            mutation updateAnzahlForEkZaehl(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopkontrzaehlById(
                input: {
                  id: $id
                  tpopkontrzaehlPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopkontrzaehl {
                  ...TpopkontrzaehlFields
                }
              }
            }
            ${tpopkontrzaehl}
          `,
            variables,
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        setFieldErrors({})
        queryClient.invalidateQueries({
          queryKey: [`treeTpopfeldkontrzaehl`],
        })
      },
      [client, queryClient, row.id, store.user.name],
    )

    // console.log('Tpopkontrzaehl rendering')

    if (loading) return <Spinner />

    if (error) return <Error errors={[error]} />

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="Zählung"
            MenuBarComponent={Menu}
          />
          <FormContainer>
            <Select
              name="einheit"
              label="Einheit"
              options={zaehlEinheitOptions}
              loading={loading}
              value={row.einheit}
              saveToDb={saveToDb}
              error={fieldErrors.einheit}
            />
            <TextField
              name="anzahl"
              label="Anzahl"
              type="number"
              value={row.anzahl}
              saveToDb={saveToDb}
              error={fieldErrors.anzahl}
            />
            <RadioButtonGroup
              name="methode"
              label="Methode"
              dataSource={data?.allTpopkontrzaehlMethodeWertes?.nodes ?? []}
              value={row.methode}
              saveToDb={saveToDb}
              error={fieldErrors.methode}
            />
          </FormContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
