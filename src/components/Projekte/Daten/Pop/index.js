import React, { useContext, useCallback, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfoFormik'
import Status from '../../../shared/Status'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import Coordinates from '../../../shared/Coordinates'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { pop } from '../../../shared/fragments'
import PopHistory from './History'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const LoadingContainer = styled.div`
  height: 100%;
  padding: 10px;
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

  const [tab, setTab] = useState(get(urlQuery, 'popTab', 'pop'))
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

  const row = get(data, 'popById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      // when GeomPoint is changed, Coordinates takes over
      // need to return
      if (changedField === null) return

      const value = values[changedField]
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updatePopForPop(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updatePopById(
                input: {
                  id: $id
                  popPatch: {
                    ${changedField}: $${changedField}
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
          // no optimistic responce as geomPoint
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      // update pop on map
      if (
        (value &&
          row &&
          ((changedField === 'lv95Y' && row.lv95X) ||
            (changedField === 'lv95X' && row.lv95Y))) ||
        (!value && (changedField === 'lv95Y' || changedField === 'lv95X'))
      ) {
        if (refetch.popForMap) refetch.popForMap()
      }
      setErrors({})
    },
    [client, refetch, row, store.user.name],
  )

  if (loading) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }
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
                  <Formik
                    key={row.id}
                    initialValues={row}
                    onSubmit={onSubmit}
                    enableReinitialize
                  >
                    {({ handleSubmit, dirty }) => (
                      <Form onBlur={() => dirty && handleSubmit()}>
                        <TextField
                          label="Nr."
                          name="nr"
                          type="number"
                          handleSubmit={handleSubmit}
                        />
                        <TextFieldWithInfo
                          label="Name"
                          name="name"
                          type="text"
                          popover="Dieses Feld möglichst immer ausfüllen"
                          handleSubmit={handleSubmit}
                        />
                        <Status
                          apJahr={get(row, 'apByApId.startJahr')}
                          treeName={treeName}
                          showFilter={false}
                          handleSubmit={handleSubmit}
                        />
                        <Checkbox2States
                          label="Status unklar"
                          name="statusUnklar"
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          label="Begründung"
                          name="statusUnklarBegruendung"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <Coordinates
                          row={row}
                          refetchForm={refetchPop}
                          table="pop"
                        />
                      </Form>
                    )}
                  </Formik>
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
