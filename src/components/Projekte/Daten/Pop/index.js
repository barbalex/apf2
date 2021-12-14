import React, { useContext, useCallback, useState, useMemo } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import Checkbox2States from '../../../shared/Checkbox2States'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import Coordinates from '../../../shared/Coordinates'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { pop } from '../../../shared/fragments'
import Spinner from '../../../shared/Spinner'

import PopHistory from './History'

const Container = styled.div`
  height: 100%;
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

const Pop = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { refetch, urlQuery, setUrlQuery } = store
  const { activeNodeArray } = store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

  let id =
    activeNodeArray.length > 5
      ? activeNodeArray[5]
      : '99999999-9999-9999-9999-999999999999'

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

  const [tab, setTab] = useState(urlQuery?.popTab ?? 'pop')
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'popTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

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
        if (refetch.popForMap) refetch.popForMap()
      }
      setFieldErrors({})
    },
    [client, refetch, row, store.user.name],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={data?.popById?.apId}
          title="Population"
          treeName={treeName}
        />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="Population" value="pop" data-id="pop" />
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
            {tab === 'dateien' && <Files parentId={row.id} parent="pop" />}
            {tab === 'history' && <PopHistory popId={id} />}
          </TabContent>
        </div>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Pop)
