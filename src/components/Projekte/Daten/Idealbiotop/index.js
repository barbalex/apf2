import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Formik, Form, Field } from 'formik'

import TextField from '../../../shared/TextFieldFormik'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerFormik'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import updateIdealbiotopByIdGql from './updateIdealbiotopById'
import storeContext from '../../../../storeContext'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'

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
      try {
        await client.mutate({
          mutation: updateIdealbiotopByIdGql,
          variables: {
            id: row.id,
            apId: values.apId,
            erstelldatum: values.erstelldatum,
            hoehenlage: values.hoehenlage,
            region: values.region,
            exposition: values.exposition,
            besonnung: values.besonnung,
            hangneigung: values.hangneigung,
            bodenTyp: values.bodenTyp,
            bodenKalkgehalt: values.bodenKalkgehalt,
            bodenDurchlaessigkeit: values.bodenDurchlaessigkeit,
            bodenHumus: values.bodenHumus,
            bodenNaehrstoffgehalt: values.bodenNaehrstoffgehalt,
            wasserhaushalt: values.wasserhaushalt,
            konkurrenz: values.konkurrenz,
            moosschicht: values.moosschicht,
            krautschicht: values.krautschicht,
            strauchschicht: values.strauchschicht,
            baumschicht: values.baumschicht,
            bemerkungen: values.bemerkungen,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateIdealbiotopById: {
              idealbiotop: {
                id: row.id,
                apId: values.apId,
                erstelldatum: values.erstelldatum,
                hoehenlage: values.hoehenlage,
                region: values.region,
                exposition: values.exposition,
                besonnung: values.besonnung,
                hangneigung: values.hangneigung,
                bodenTyp: values.bodenTyp,
                bodenKalkgehalt: values.bodenKalkgehalt,
                bodenDurchlaessigkeit: values.bodenDurchlaessigkeit,
                bodenHumus: values.bodenHumus,
                bodenNaehrstoffgehalt: values.bodenNaehrstoffgehalt,
                wasserhaushalt: values.wasserhaushalt,
                konkurrenz: values.konkurrenz,
                moosschicht: values.moosschicht,
                krautschicht: values.krautschicht,
                strauchschicht: values.strauchschicht,
                baumschicht: values.baumschicht,
                bemerkungen: values.bemerkungen,
                __typename: 'Idealbiotop',
              },
              __typename: 'Idealbiotop',
            },
          },
        })
      } catch (error) {
        const { message } = error
        const field = message.includes('$erstelldatum')
          ? 'erstelldatum'
          : message.includes('$hoehenlage')
          ? 'hoehenlage'
          : message.includes('$region')
          ? 'region'
          : message.includes('$exposition')
          ? 'exposition'
          : message.includes('$besonnung')
          ? 'besonnung'
          : message.includes('$hangneigung')
          ? 'hangneigung'
          : message.includes('$bodenTyp')
          ? 'bodenTyp'
          : message.includes('$bodenKalkgehalt')
          ? 'bodenKalkgehalt'
          : message.includes('$bodenDurchlaessigkeit')
          ? 'bodenDurchlaessigkeit'
          : message.includes('$bodenHumus')
          ? 'bodenHumus'
          : message.includes('$bodenNaehrstoffgehalt')
          ? 'bodenNaehrstoffgehalt'
          : message.includes('$wasserhaushalt')
          ? 'wasserhaushalt'
          : message.includes('$konkurrenz')
          ? 'konkurrenz'
          : message.includes('$moosschicht')
          ? 'moosschicht'
          : message.includes('$krautschicht')
          ? 'krautschicht'
          : message.includes('$strauchschicht')
          ? 'strauchschicht'
          : message.includes('$baumschicht')
          ? 'baumschicht'
          : 'bemerkungen'
        return setErrors({ [field]: message })
      }
      setErrors({})
    },
    [row],
  )
  const onChangeTab = useCallback((event, value) => {
    setUrlQueryValue({
      key: 'feldkontrTab',
      value,
      urlQuery,
      setUrlQuery,
    })
    setTab(value)
  })

  console.log('Idealbiotop rendering')

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
                {({ isSubmitting, handleSubmit, dirty }) => (
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
