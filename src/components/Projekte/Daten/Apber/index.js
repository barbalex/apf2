import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { gql } from '@apollo/client'
import { withResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import MdField from '../../../shared/MarkdownFieldFormik'
import Select from '../../../shared/SelectFormik'
import DateField from '../../../shared/DateFormik'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import query from './query'
import queryAdresses from './queryAdresses'
import queryApErfkritWertes from './queryApErfkritWertes'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { apber } from '../../../shared/fragments'
import Error from '../../../shared/Error'

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
  overflow-y: auto;
`
const StyledForm = styled(Form)`
  padding: 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`

const veraenGegenVorjahrWerte = [
  { value: '+', label: '+' },
  { value: '-', label: '-' },
]

const fieldTypes = {
  jahr: 'Int',
  situation: 'String',
  vergleichVorjahrGesamtziel: 'String',
  beurteilung: 'Int',
  veraenderungZumVorjahr: 'String',
  apberAnalyse: 'String',
  konsequenzenUmsetzung: 'String',
  konsequenzenErfolgskontrolle: 'String',
  biotopeNeue: 'String',
  biotopeOptimieren: 'String',
  massnahmenOptimieren: 'String',
  wirkungAufArt: 'String',
  datum: 'Date',
  massnahmenApBearb: 'String',
  massnahmenPlanungVsAusfuehrung: 'String',
  apId: 'UUID',
  bearbeiter: 'UUID',
}

const Apber = ({ treeName, width = 1000 }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { activeNodeArray } = store[treeName]

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
            mutation updateApber(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateApberById(
                input: {
                  id: $id
                  apberPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                apber {
                  ...ApberFields
                }
              }
            }
            ${apber}
          `,
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

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (loading) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }

  const errors = [
    ...(error ? [error] : []),
    ...(errorAdresses ? [errorAdresses] : []),
    ...(errorApErfkritWertes ? [errorApErfkritWertes] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="AP-Bericht"
          treeName={treeName}
          table="apber"
        />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
              {({ handleSubmit, dirty }) => (
                <StyledForm
                  onBlur={() => dirty && handleSubmit()}
                  data-column-width={columnWidth}
                >
                  <TextField
                    name="jahr"
                    label="Jahr"
                    type="number"
                    handleSubmit={handleSubmit}
                  />
                  <MdField
                    name="vergleichVorjahrGesamtziel"
                    label="Vergleich Vorjahr - Gesamtziel"
                  />
                  <RadioButtonGroup
                    name="beurteilung"
                    label="Beurteilung"
                    dataSource={get(
                      dataApErfkritWertes,
                      'allApErfkritWertes.nodes',
                      [],
                    )}
                    loading={loadingApErfkritWertes}
                    handleSubmit={handleSubmit}
                  />
                  <RadioButtonGroup
                    name="veraenderungZumVorjahr"
                    label="Veränderung zum Vorjahr"
                    dataSource={veraenGegenVorjahrWerte}
                    handleSubmit={handleSubmit}
                  />
                  <MdField name="apberAnalyse" label="Analyse" />
                  <MdField
                    name="konsequenzenUmsetzung"
                    label="Konsequenzen für die Umsetzung"
                  />
                  <MdField
                    name="konsequenzenErfolgskontrolle"
                    label="Konsequenzen für die Erfolgskontrolle"
                  />
                  <MdField
                    name="biotopeNeue"
                    label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
                  />
                  <MdField
                    name="biotopeOptimieren"
                    label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
                  />
                  <MdField
                    name="massnahmenApBearb"
                    label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Aktionsplan-Verantwortlichen"
                  />
                  <MdField
                    name="massnahmenPlanungVsAusfuehrung"
                    label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
                  />
                  <MdField
                    name="massnahmenOptimieren"
                    label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
                  />
                  <MdField
                    name="wirkungAufArt"
                    label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
                  />
                  <DateField
                    name="datum"
                    label="Datum"
                    handleSubmit={handleSubmit}
                  />
                  <Select
                    name="bearbeiter"
                    label="BearbeiterIn"
                    options={get(dataAdresses, 'allAdresses.nodes', [])}
                    loading={loadingAdresses}
                    handleSubmit={handleSubmit}
                  />
                </StyledForm>
              )}
            </Formik>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default withResizeDetector(observer(Apber))
