import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Formik, Form } from 'formik'
import { withResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextFieldFormik'
import DateField from '../../../shared/DateFormik'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import query from './query'
import storeContext from '../../../../storeContext'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { idealbiotop } from '../../../shared/fragments'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
  height: ${(props) =>
    `calc(100% - ${props['data-form-title-height']}px - 48px)`};
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

const Idealbiotop = ({ treeName, width = 1000 }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery, appBarHeight } = store
  const client = useApolloClient()

  const [tab, setTab] = useState(get(urlQuery, 'idealbiotopTab', 'idealbiotop'))
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 3
          ? activeNodeArray[3]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'allIdealbiotops.nodes[0]', {})

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

  const [formTitleHeight, setFormTitleHeight] = useState(43)

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (loading) {
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  }
  if (error) return <Error error={error} />
  return (
    <ErrorBoundary>
      <Container data-appbar-height={appBarHeight}>
        <FormTitle
          apId={row.apId}
          title="Idealbiotop"
          treeName={treeName}
          table="idealbiotop"
          setFormTitleHeight={setFormTitleHeight}
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
          <TabContent data-form-title-height={formTitleHeight}>
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
                          handleSubmit={handleSubmit}
                        />
                        <Section>Lage</Section>
                        <TextField
                          name="hoehenlage"
                          label="Höhe"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="region"
                          label="Region"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="exposition"
                          label="Exposition"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="besonnung"
                          label="Besonnung"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="hangneigung"
                          label="Hangneigung"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <Section>Boden</Section>
                        <TextField
                          name="bodenTyp"
                          label="Typ"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="bodenKalkgehalt"
                          label="Kalkgehalt"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="bodenDurchlaessigkeit"
                          label="Durchlässigkeit"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="bodenHumus"
                          label="Humus"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="bodenNaehrstoffgehalt"
                          label="Nährstoffgehalt"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="wasserhaushalt"
                          label="Wasserhaushalt"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <Section>Vegetation</Section>
                        <TextField
                          name="konkurrenz"
                          label="Konkurrenz"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="moosschicht"
                          label="Moosschicht"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="krautschicht"
                          label="Krautschicht"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="strauchschicht"
                          label="Strauchschicht"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
                          name="baumschicht"
                          label="Baumschicht"
                          type="text"
                          multiLine
                          handleSubmit={handleSubmit}
                        />
                        <TextField
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
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default withResizeDetector(observer(Idealbiotop))
