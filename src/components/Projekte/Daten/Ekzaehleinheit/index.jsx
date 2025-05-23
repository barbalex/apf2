import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { Select } from '../../../shared/Select.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { queryLists } from './queryLists.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
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
  bemerkungen: 'String',
  apId: 'UUID',
  zaehleinheitId: 'UUID',
  zielrelevant: 'Boolean',
  notMassnCountUnit: 'Boolean',
  sort: 'Int',
}

export const Component = memo(
  observer(() => {
    const { zaehleinheitId: id } = useParams()

    const queryClient = useQueryClient()
    const client = useApolloClient()
    const store = useContext(MobxContext)

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, loading, error } = useQuery(query, {
      variables: {
        id,
      },
    })

    const row = useMemo(
      () => data?.ekzaehleinheitById ?? {},
      [data?.ekzaehleinheitById],
    )

    const ekzaehleinheitenOfAp = (
      row?.apByApId?.ekzaehleinheitsByApId?.nodes ?? []
    ).map((o) => o.zaehleinheitId)
    // re-add this ones id
    const notToShow = ekzaehleinheitenOfAp.filter(
      (o) => o !== row.zaehleinheitId,
    )
    const zaehleinheitWerteFilter =
      notToShow.length ?
        { id: { notIn: notToShow } }
      : { id: { isNull: false } }
    const {
      data: dataLists,
      loading: loadingLists,
      error: errorLists,
    } = useQuery(queryLists, {
      variables: {
        filter: zaehleinheitWerteFilter,
      },
    })

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
            mutation updateEkzaehleinheit(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateEkzaehleinheitById(
                input: {
                  id: $id
                  ekzaehleinheitPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekzaehleinheit {
                  ...EkzaehleinheitFields
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    ...TpopkontrzaehlEinheitWerteFields
                  }
                }
              }
            }
            ${ekzaehleinheit}
            ${tpopkontrzaehlEinheitWerte}
          `,
            variables,
          })
        } catch (error) {
          if (
            field === 'zielrelevant' &&
            (error.message.includes('doppelter Schlüsselwert') ||
              error.message.includes('duplicate key value'))
          ) {
            return setFieldErrors({
              [field]: 'Pro Art darf nur eine Einheit zielrelevant sein',
            })
          }
          return setFieldErrors({ [field]: error.message })
        }
        setFieldErrors({})
        if (['zaehleinheitId', 'sort'].includes(field)) {
          queryClient.invalidateQueries({
            queryKey: [`treeEkzaehleinheit`],
          })
        }
      },
      [client, queryClient, row.id, store.user.name],
    )

    // console.log('Ekzaehleinheit rendering, loading:', loading)

    if (loading) return <Spinner />

    const errors = [
      ...(error ? [error] : []),
      ...(errorLists ? [errorLists] : []),
    ]
    if (errors.length) return <Error errors={errors} />

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="EK-Zähleinheit"
            MenuBarComponent={Menu}
          />
          <FormContainer>
            <Select
              name="zaehleinheitId"
              label="Zähleinheit"
              options={dataLists?.allTpopkontrzaehlEinheitWertes?.nodes ?? []}
              loading={loadingLists}
              value={row.zaehleinheitId}
              saveToDb={saveToDb}
              error={fieldErrors.zaehleinheitId}
            />
            <Checkbox2States
              name="zielrelevant"
              label="zielrelevant"
              value={row.zielrelevant}
              saveToDb={saveToDb}
              error={fieldErrors.zielrelevant}
            />
            {row.zielrelevant && (
              <Checkbox2States
                name="notMassnCountUnit"
                label="Entspricht bewusst keiner Massnahmen-Zähleinheit ('Anzahl Pflanzen' oder 'Anzahl Triebe')"
                value={row.notMassnCountUnit}
                saveToDb={saveToDb}
                error={fieldErrors.notMassnCountUnit}
              />
            )}
            <TextField
              name="sort"
              label="Sortierung"
              type="number"
              value={row.sort}
              saveToDb={saveToDb}
              error={fieldErrors.sort}
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
