import React, { useState, useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import TextFieldFormik from '../../../shared/TextFieldFormik'
import TextField from '../../../shared/TextField'
import DateFieldFormik from '../../../shared/DateFormik'
import DateField from '../../../shared/Date'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import query from './query'
import storeContext from '../../../../storeContext'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { idealbiotop } from '../../../shared/fragments'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: 100%;
  padding: 10px;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div:first-child {
    > div:first-child {
      display: block !important;
    }
  }
`
const FormContainer = styled.div`
  padding: 0 10px;
  height: 100%;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`
const FilesContainer = styled.div`
  height: 100%;
`
const Section = styled.div`
  padding-top: 20px;
  padding-bottom: 7px;
  font-weight: bold;
  break-after: avoid;
  &:after {
    content: ':';
  }
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  overflow-y: auto;
`
const fieldTypes = {
  apId: 'UUID',
  erstelldatum: 'Date',
  hoehenlage: 'String',
  region: 'String',
  exposition: 'String',
  besonnung: 'String',
  hangneigung: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  wasserhaushalt: 'String',
  konkurrenz: 'String',
  moosschicht: 'String',
  krautschicht: 'String',
  strauchschicht: 'String',
  baumschicht: 'String',
  bemerkungen: 'String',
}

const Idealbiotop = ({ treeName }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store
  const client = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const [tab, setTab] = useState(urlQuery?.idealbiotopTab ?? 'idealbiotop')
  const { activeNodeArray, formWidth: width } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 3
          ? activeNodeArray[3]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = useMemo(
    () => data?.allIdealbiotops?.nodes?.[0] ?? {},
    [data?.allIdealbiotops?.nodes],
  )

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateIdealbiotop(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateIdealbiotopById(
                input: {
                  id: $id
                  idealbiotopPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                idealbiotop {
                  ...IdealbiotopFields
                }
              }
            }
            ${idealbiotop}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
    },
    [client, row, store.user.name],
  )

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateIdealbiotop(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateIdealbiotopById(
                input: {
                  id: $id
                  idealbiotopPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                idealbiotop {
                  ...IdealbiotopFields
                }
              }
            }
            ${idealbiotop}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateIdealbiotopById: {
              idealbiotop: { ...variables, __typename: 'Idealbiotop' },
              __typename: 'Idealbiotop',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
    },
    [client, row, store.user.name],
  )
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'idealbiotopTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Idealbiotop"
          treeName={treeName}
          table="idealbiotop"
        />
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab
              label="Idealbiotop"
              value="idealbiotop"
              data-id="idealbiotop"
            />
            <StyledTab label="Dateien" value="dateien" data-id="dateien" />
          </Tabs>
          <div style={{ overflowY: 'auto' }}>
            <TabContent>
              <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
                {tab === 'idealbiotop' && (
                  <FormContainer data-column-width={columnWidth}>
                    <Formik
                      initialValues={row}
                      onSubmit={onSubmit}
                      enableReinitialize
                    >
                      {({ handleSubmit, dirty }) => (
                        <Form onBlur={() => dirty && handleSubmit()}>
                          <DateField
                            name="erstelldatum"
                            label="Erstelldatum"
                            value={row.erstelldatum}
                            saveToDb={saveToDb}
                            error={fieldErrors.erstelldatum}
                          />
                          <Section>Lage</Section>
                          <TextField
                            name="hoehenlage"
                            label="Höhe"
                            type="text"
                            multiLine
                            value={row.hoehenlage}
                            saveToDb={saveToDb}
                            error={fieldErrors.hoehenlage}
                          />
                          <TextField
                            name="region"
                            label="Region"
                            type="text"
                            multiLine
                            value={row.region}
                            saveToDb={saveToDb}
                            error={fieldErrors.region}
                          />
                          <TextField
                            name="exposition"
                            label="Exposition"
                            type="text"
                            multiLine
                            value={row.exposition}
                            saveToDb={saveToDb}
                            error={fieldErrors.exposition}
                          />
                          <TextField
                            name="besonnung"
                            label="Besonnung"
                            type="text"
                            multiLine
                            value={row.besonnung}
                            saveToDb={saveToDb}
                            error={fieldErrors.besonnung}
                          />
                          <TextFieldFormik
                            name="hangneigung"
                            label="Hangneigung"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <Section>Boden</Section>
                          <TextFieldFormik
                            name="bodenTyp"
                            label="Typ"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="bodenKalkgehalt"
                            label="Kalkgehalt"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="bodenDurchlaessigkeit"
                            label="Durchlässigkeit"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="bodenHumus"
                            label="Humus"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="bodenNaehrstoffgehalt"
                            label="Nährstoffgehalt"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="wasserhaushalt"
                            label="Wasserhaushalt"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <Section>Vegetation</Section>
                          <TextFieldFormik
                            name="konkurrenz"
                            label="Konkurrenz"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="moosschicht"
                            label="Moosschicht"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="krautschicht"
                            label="Krautschicht"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="strauchschicht"
                            label="Strauchschicht"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="baumschicht"
                            label="Baumschicht"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                          <TextFieldFormik
                            name="bemerkungen"
                            label="Bemerkungen"
                            type="text"
                            multiLine
                            handleSubmit={handleSubmit}
                          />
                        </Form>
                      )}
                    </Formik>
                  </FormContainer>
                )}
                {tab === 'dateien' && (
                  <FilesContainer>
                    <Files parentId={row.id} parent="idealbiotop" />
                  </FilesContainer>
                )}
              </SimpleBar>
            </TabContent>
          </div>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Idealbiotop)
