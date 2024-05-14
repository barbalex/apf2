import React, { useContext, useCallback, useState, useMemo } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import TextField from '../../../shared/TextField.jsx'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo.jsx'
import Status from '../../../shared/Status.jsx'
import Checkbox2States from '../../../shared/Checkbox2States.jsx'
import FormTitle from '../../../shared/FormTitle/index.jsx'
import query from './query.js'
import storeContext from '../../../../storeContext.js'
import Coordinates from '../../../shared/Coordinates.jsx'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber.js'
import Files from '../../../shared/Files/index.jsx'
import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import Error from '../../../shared/Error.jsx'
import { pop } from '../../../shared/fragments.js'
import Spinner from '../../../shared/Spinner.jsx'
import useSearchParamsState from '../../../../modules/useSearchParamsState.js'
import TpopMenge from './TpopMenge/index.jsx'

import PopHistory from './History.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
  height: 100%;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
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

const Pop = () => {
  const { popId: id } = useParams()

  const store = useContext(storeContext)
  const queryClient = useQueryClient()
  const client = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const {
    data,
    loading,
    error,
    refetch: refetchPop,
  } = useQuery(query, {
    variables: {
      id,
    },
  })

  const [tab, setTab] = useSearchParamsState('popTab', 'pop')
  const onChangeTab = useCallback((event, value) => setTab(value), [setTab])

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

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Population" />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="Population" value="pop" data-id="pop" />
          <StyledTab
            label="Auswertung"
            value="auswertung"
            data-id="auswertung"
          />
          <StyledTab label="Dateien" value="dateien" data-id="dateien" />
          <StyledTab label="Historien" value="history" data-id="history" />
        </Tabs>
        <div style={{ overflowY: 'auto' }}>
          <TabContent>
            {tab === 'pop' && (
              <SimpleBar
                style={{
                  maxHeight: '100%',
                  height: '100%',
                }}
              >
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
                  <Coordinates row={row} refetchForm={refetchPop} table="pop" />
                </FormContainer>
              </SimpleBar>
            )}
            {tab === 'auswertung' && <TpopMenge />}
            {tab === 'dateien' && <Files parentId={row.id} parent="pop" />}
            {tab === 'history' && <PopHistory />}
          </TabContent>
        </div>
      </Container>
    </ErrorBoundary>
  )
}

export const Component = observer(Pop)
