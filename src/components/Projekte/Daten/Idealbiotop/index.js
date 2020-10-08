import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Formik, Form, Field } from 'formik'

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
import { idealbiotop } from '../../../shared/fragments'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
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
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
  column-width: ${(props) =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`
const FilesContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
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

  const [tab, setTab] = useState(get(urlQuery, 'idealbiotopTab', 'idealbiotop'))
  const { activeNodeArray, datenWidth } = store[treeName]

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

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler beim Laden der Daten: ${error.message}`
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
          {tab === 'idealbiotop' && (
            <FormContainer data-width={datenWidth}>
              <Formik
                initialValues={row}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({ handleSubmit, dirty }) => (
                  <Form onBlur={() => dirty && handleSubmit()}>
                    <DateField name="erstelldatum" label="Erstelldatum" />
                    <Section>Lage</Section>
                    <TextField
                      name="hoehenlage"
                      label="Höhe"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="region"
                      label="Region"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="exposition"
                      label="Exposition"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="besonnung"
                      label="Besonnung"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="hangneigung"
                      label="Hangneigung"
                      type="text"
                      multiLine
                    />
                    <Section>Boden</Section>
                    <TextField
                      name="bodenTyp"
                      label="Typ"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="bodenKalkgehalt"
                      label="Kalkgehalt"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="bodenDurchlaessigkeit"
                      label="Durchlässigkeit"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="bodenHumus"
                      label="Humus"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="bodenNaehrstoffgehalt"
                      label="Nährstoffgehalt"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="wasserhaushalt"
                      label="Wasserhaushalt"
                      type="text"
                      multiLine
                    />
                    <Section>Vegetation</Section>
                    <TextField
                      name="konkurrenz"
                      label="Konkurrenz"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="moosschicht"
                      label="Moosschicht"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="krautschicht"
                      label="Krautschicht"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="strauchschicht"
                      label="Strauchschicht"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="baumschicht"
                      label="Baumschicht"
                      type="text"
                      multiLine
                    />
                    <TextField
                      name="bemerkungen"
                      label="Bemerkungen"
                      type="text"
                      multiLine
                    />
                  </Form>
                )}
              </Formik>
            </FormContainer>
          )}
          {tab === 'dateien' && (
            <FilesContainer data-width={datenWidth}>
              <Files parentId={row.id} parent="idealbiotop" />
            </FilesContainer>
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Idealbiotop)
