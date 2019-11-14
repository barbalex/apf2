import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerFormik'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import updateApberByIdGql from './updateApberById'
import query from './query'
import queryAdresses from './queryAdresses'
import queryApErfkritWertes from './queryApErfkritWertes'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
  column-width: ${props =>
    props.width > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const veraenGegenVorjahrWerte = [
  { value: '+', label: '+' },
  { value: '-', label: '-' },
]

const Apber = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { activeNodeArray, datenWidth } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataAdresses,
    loading: loadingAdresses,
    error: errorAdresses,
  } = useQuery(queryAdresses)
  const {
    data: dataApErfkritWertes,
    loading: loadingApErfkritWertes,
    error: errorApErfkritWertes,
  } = useQuery(queryApErfkritWertes)

  const row = get(data, 'apberById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: updateApberByIdGql,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateApberById: {
              apber: {
                ...variables,
                __typename: 'Apber',
              },
              __typename: 'Apber',
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

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (errorApErfkritWertes) {
    return `Fehler: ${errorApErfkritWertes.message}`
  }

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="AP-Bericht"
          treeName={treeName}
          table="apber"
        />
        <FieldsContainer width={datenWidth}>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  name="jahr"
                  label="Jahr"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="vergleichVorjahrGesamtziel"
                  label="Vergleich Vorjahr - Gesamtziel"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="beurteilung"
                  label="Beurteilung"
                  dataSource={get(
                    dataApErfkritWertes,
                    'allApErfkritWertes.nodes',
                    [],
                  )}
                  loading={loadingApErfkritWertes}
                  component={RadioButtonGroup}
                />
                <Field
                  name="veraenderungZumVorjahr"
                  label="Veränderung zum Vorjahr"
                  dataSource={veraenGegenVorjahrWerte}
                  component={RadioButtonGroup}
                />
                <Field
                  name="apberAnalyse"
                  label="Analyse"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="konsequenzenUmsetzung"
                  label="Konsequenzen für die Umsetzung"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="konsequenzenErfolgskontrolle"
                  label="Konsequenzen für die Erfolgskontrolle"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="biotopeNeue"
                  label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="biotopeOptimieren"
                  label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="massnahmenApBearb"
                  label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Aktionsplan-Verantwortlichen"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="massnahmenPlanungVsAusfuehrung"
                  label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="massnahmenOptimieren"
                  label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="wirkungAufArt"
                  label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="datum"
                  label="Datum"
                  component={DateFieldWithPicker}
                />
                <Field
                  name="bearbeiter"
                  label="BearbeiterIn"
                  options={get(dataAdresses, 'allAdresses.nodes', [])}
                  loading={loadingAdresses}
                  component={Select}
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Apber)
