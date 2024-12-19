import {
  memo,
  useContext,
  useCallback,
  useState,
  useMemo,
  Suspense,
} from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { TextField } from '../../../shared/TextField.jsx'
import { TextFieldWithInfo } from '../../../shared/TextFieldWithInfo.jsx'
import { Status } from '../../../shared/Status.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { Coordinates } from '../../../shared/Coordinates.jsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { pop } from '../../../shared/fragments.js'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { query } from './query.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { Menu } from './Menu.jsx'

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
  height: 100%;
`

const fieldTypes = {
  apId: 'UUID',
  nr: 'Int',
  name: 'String',
  status: 'Int',
  statusUnklar: 'Boolean',
  statusUnklarBegruendung: 'String',
  bekanntSeit: 'Int',
}

export const Component = memo(
  observer(() => {
    const { projId, apId, popId } = useParams()

    const store = useContext(MobxContext)
    const queryClient = useQueryClient()
    const client = useApolloClient()

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, error, refetch } = useQuery(query, {
      variables: { id: popId },
    })

    const row = useMemo(() => data?.popById ?? {}, [data?.popById])

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
            mutation updatePopForPop(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updatePopById(
                input: {
                  id: $id
                  popPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                pop {
                  ...PopFields
                }
              }
            }
            ${pop}
          `,
            variables,
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        // update pop on map
        if (
          (value &&
            row &&
            ((field === 'lv95Y' && row.lv95X) ||
              (field === 'lv95X' && row.lv95Y))) ||
          (!value && (field === 'lv95Y' || field === 'lv95X'))
        ) {
          client.refetchQueries({
            include: ['PopForMapQuery'],
          })
        }
        setFieldErrors({})
        if (['name', 'nr'].includes(field)) {
          queryClient.invalidateQueries({
            queryKey: [`treePop`],
          })
        }
      },
      [client, queryClient, row, store.user.name],
    )

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <FormTitle
            title="Population"
            MenuBarComponent={Menu}
            menuBarProps={{ row }}
          />
          <FormContainer>
            <TextField
              label="Nr."
              name="nr"
              type="number"
              value={row.nr}
              saveToDb={saveToDb}
              error={fieldErrors.nr}
            />
            <TextFieldWithInfo
              label="Name"
              name="name"
              type="text"
              popover="Dieses Feld möglichst immer ausfüllen"
              value={row.name}
              saveToDb={saveToDb}
              error={fieldErrors.name}
            />
            <Status
              apJahr={row?.apByApId?.startJahr}
              showFilter={false}
              row={row}
              saveToDb={saveToDb}
              error={fieldErrors}
            />
            <Checkbox2States
              label="Status unklar"
              name="statusUnklar"
              value={row.statusUnklar}
              saveToDb={saveToDb}
              error={fieldErrors.statusUnklar}
            />
            <TextField
              label="Begründung"
              name="statusUnklarBegruendung"
              type="text"
              multiLine
              value={row.statusUnklarBegruendung}
              saveToDb={saveToDb}
              error={fieldErrors.statusUnklarBegruendung}
            />
            <Coordinates
              row={row}
              refetchForm={refetch}
              table="pop"
            />
          </FormContainer>
        </Suspense>
      </ErrorBoundary>
    )
  }),
)
