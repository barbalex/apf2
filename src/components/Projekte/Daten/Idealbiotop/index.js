import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import TextField from '../../../shared/TextFieldFormik'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerFormik'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import query from './query'
import updateIdealbiotopByIdGql from './updateIdealbiotopById'
import storeContext from '../../../../storeContext'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

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
  column-width: ${props =>
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
      try {
        await client.mutate({
          mutation: updateIdealbiotopByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateIdealbiotopById: {
              idealbiotop: { ...values, __typename: 'Idealbiotop' },
              __typename: 'Idealbiotop',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
    },
    [row],
  )
  const onChangeTab = useCallback((event, value) => {
    setUrlQueryValue({
      key: 'idealbiotopTab',
      value,
      urlQuery,
      setUrlQuery,
    })
    setTab(value)
  })

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
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
            <Tab
              label="Idealbiotop"
              value="idealbiotop"
              data-id="idealbiotop"
            />
            <Tab label="Dateien" value="dateien" data-id="dateien" />
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
                    <Field
                      name="erstelldatum"
                      label="Erstelldatum"
                      component={DateFieldWithPicker}
                    />
                    <Section>Lage</Section>
                    <Field
                      name="hoehenlage"
                      label="Höhe"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="region"
                      label="Region"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="exposition"
                      label="Exposition"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="besonnung"
                      label="Besonnung"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="hangneigung"
                      label="Hangneigung"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Section>Boden</Section>
                    <Field
                      name="bodenTyp"
                      label="Typ"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="bodenKalkgehalt"
                      label="Kalkgehalt"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="bodenDurchlaessigkeit"
                      label="Durchlässigkeit"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="bodenHumus"
                      label="Humus"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="bodenNaehrstoffgehalt"
                      label="Nährstoffgehalt"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="wasserhaushalt"
                      label="Wasserhaushalt"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Section>Vegetation</Section>
                    <Field
                      name="konkurrenz"
                      label="Konkurrenz"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="moosschicht"
                      label="Moosschicht"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="krautschicht"
                      label="Krautschicht"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="strauchschicht"
                      label="Strauchschicht"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="baumschicht"
                      label="Baumschicht"
                      type="text"
                      component={TextField}
                      multiLine
                    />
                    <Field
                      name="bemerkungen"
                      label="Bemerkungen"
                      type="text"
                      component={TextField}
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
