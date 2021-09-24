import React, { useCallback, useContext, useState } from 'react'
import { FaPlus, FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form, FieldArray } from 'formik'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextFieldFormik'
import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import KontrolljahrField from './KontrolljahrField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryEkAbrechnungstypWertes from './queryEkAbrechnungstypWertes'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import { ekfrequenz } from '../../../shared/fragments'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

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
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledForm = styled(Form)`
  padding: 10px;
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
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { appBarHeight } = store
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

  const [formTitleHeight, setFormTitleHeight] = useState(0)

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
          title="EK-Frequenz"
          treeName={treeName}
          table="ekfrequenz"
          setFormTitleHeight={setFormTitleHeight}
        />
        <FieldsContainer data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <Formik
              key={row.kontrolljahre}
              initialValues={row}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty, values }) => (
                <StyledForm
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
                                values.kontrolljahre.filter((v) => !v).length >
                                  1
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
                              <KontrolljahrField
                                name={`kontrolljahre.${index}`}
                                handleSubmit={handleSubmit}
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
                </StyledForm>
              )}
            </Formik>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ekfrequenz)
