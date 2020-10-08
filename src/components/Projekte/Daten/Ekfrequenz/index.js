import React, { useCallback, useContext } from 'react'
import { FaPlus, FaTimes } from 'react-icons/fa'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form, Field, FieldArray } from 'formik'

import TextField from '../../../shared/TextFieldFormik'
import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import KontrolljahrField from './KontrolljahrField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryEkAbrechnungstypWertes from './queryEkAbrechnungstypWertes'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ekfrequenz } from '../../../shared/fragments'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`
const KontrolljahrContainer = styled.div`
  margin-bottom: 20px;
`
const LabelRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: -5px;
`
const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  user-select: none;
  padding-bottom: 6px;
`
const PlusIcon = styled(IconButton)`
  font-size: 1rem !important;
`
const DelIcon = styled(IconButton)`
  font-size: 1rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`

const fieldTypes = {
  apId: 'UUID',
  ektyp: 'EkType',
  anwendungsfall: 'String',
  code: 'String',
  kontrolljahre: '[Int]',
  kontrolljahreAb: 'EkKontrolljahreAb',
  bemerkungen: 'String',
  sort: 'Int',
  ekAbrechnungstyp: 'String',
}

const ektypeWertes = [
  { value: 'EK', label: 'EK' },
  { value: 'EKF', label: 'EKF' },
]
const kontrolljahreAbWertes = [
  { value: 'EK', label: 'Kontrolle' },
  { value: 'ANSIEDLUNG', label: 'Ansiedlung' },
]

const Ekfrequenz = ({ treeName }) => {
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
    data: dataEkAbrechnungstypWertes,
    loading: loadingEkAbrechnungstypWertes,
    error: errorEkAbrechnungstypWertes,
  } = useQuery(queryEkAbrechnungstypWertes)

  const row = get(data, 'ekfrequenzById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row) || 'kontrolljahre'
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateEkfrequenz(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateEkfrequenzById(
                input: {
                  id: $id
                  ekfrequenzPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekfrequenz {
                  ...EkfrequenzFields
                }
              }
            }
            ${ekfrequenz}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateEkfrequenzById: {
              ekfrequenz: {
                ...variables,
                // sort kontrolljahre here
                kontrolljahre: values.kontrolljahre
                  ? values.kontrolljahre.sort((a, b) => {
                      if (a === '') return -1
                      if (b === '') return -1
                      return a - b
                    })
                  : null,
                __typename: 'Ekfrequenz',
              },
              __typename: 'Ekfrequenz',
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
  if (error) return `Fehler beim Laden der Daten: ${error.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="EK-Frequenz"
          treeName={treeName}
          table="ekfrequenz"
        />
        <FieldsContainer>
          <Formik
            key={row.kontrolljahre}
            initialValues={row}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ handleSubmit, dirty, values }) => (
              <Form
                onBlur={(event) => {
                  // prevent submitting when button blurs
                  if (event.target.type === 'button') return
                  dirty && handleSubmit()
                }}
              >
                <TextField
                  name="code"
                  label="Kürzel"
                  type="text"
                  handleSubmit={handleSubmit}
                />
                <TextField
                  name="anwendungsfall"
                  label="Anwendungsfall"
                  type="text"
                  multiLine
                  handleSubmit={handleSubmit}
                />
                <RadioButtonGroup
                  name="ektyp"
                  dataSource={ektypeWertes}
                  loading={false}
                  label="EK-Typ"
                  handleSubmit={handleSubmit}
                />
                <FieldArray
                  name="kontrolljahre"
                  render={(arrayHelpers) => (
                    <KontrolljahrContainer>
                      <LabelRow>
                        <StyledLabel>
                          Kontrolljahre (= Anzahl Jahre nach Start bzw.
                          Ansiedlung)
                        </StyledLabel>
                        <PlusIcon
                          title="Kontrolljahr hinzufügen"
                          aria-label="Kontrolljahr hinzufügen"
                          onClick={() => {
                            // only accept one empty value
                            if (
                              values.kontrolljahre &&
                              values.kontrolljahre.filter((v) => !v).length > 1
                            ) {
                              return
                            }
                            values.kontrolljahre &&
                            values.kontrolljahre.length > 0
                              ? arrayHelpers.insert(
                                  values.kontrolljahre.length,
                                  '',
                                )
                              : arrayHelpers.push('')
                          }}
                        >
                          <FaPlus />
                        </PlusIcon>
                      </LabelRow>
                      {!!values.kontrolljahre &&
                        // do not sort here as sorting happens on every change of value
                        // so after typing every number - bad for multiple digits
                        values.kontrolljahre.map((kontrolljahr, index) => (
                          <div key={index}>
                            <Field
                              name={`kontrolljahre.${index}`}
                              component={KontrolljahrField}
                            />
                            <DelIcon
                              title={`${values.kontrolljahre[index]} entfernen`}
                              aria-label={`${values.kontrolljahre[index]} entfernen`}
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <FaTimes />
                            </DelIcon>
                          </div>
                        ))}
                    </KontrolljahrContainer>
                  )}
                />
                <RadioButtonGroup
                  name="kontrolljahreAb"
                  dataSource={kontrolljahreAbWertes}
                  loading={false}
                  label="Kontrolljahre ab letzter"
                  handleSubmit={handleSubmit}
                />
                <div>
                  {errorEkAbrechnungstypWertes ? (
                    errorEkAbrechnungstypWertes.message
                  ) : (
                    <RadioButtonGroup
                      name="ekAbrechnungstyp"
                      dataSource={get(
                        dataEkAbrechnungstypWertes,
                        'allEkAbrechnungstypWertes.nodes',
                        [],
                      )}
                      loading={loadingEkAbrechnungstypWertes}
                      label="EK-Abrechnungstyp"
                      handleSubmit={handleSubmit}
                    />
                  )}
                </div>
                <TextField
                  name="bemerkungen"
                  label="Bemerkungen"
                  type="text"
                  multiLine
                  handleSubmit={handleSubmit}
                />
                <TextField
                  name="sort"
                  label="Sortierung"
                  type="number"
                  handleSubmit={handleSubmit}
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ekfrequenz)
