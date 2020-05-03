import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'

import RadioButtonGroupWithInfo from '../../../../shared/RadioButtonGroupWithInfoFormik'
import TextField from '../../../../shared/TextFieldFormik'
import Select from '../../../../shared/SelectFormik'
import SelectLoadingOptions from '../../../../shared/SelectLoadingOptionsFormik'
import TextFieldNonUpdatable from '../../../../shared/TextFieldNonUpdatable'
import updateApByIdGql from './updateApById'
import query from './query'
import queryLists from './queryLists'
import queryAdresses from './queryAdresses'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../../storeContext'
import objectsFindChangedKey from '../../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../../modules/objectsEmptyValuesToNull'
import ApUsers from './ApUsers'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
  overflow-y: auto !important;
  height: calc(100% - 43px - 48px + 4px);
`
const LoadingContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #565656;
  color: white;
`
const LabelPopoverContentRow = styled(LabelPopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-top-style: none;
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const LabelPopoverRowColumnLeft = styled.div`
  width: 110px;
`
const LabelPopoverRowColumnRight = styled.div`
  padding-left: 5px;
`

const ApAp = ({ treeName, id }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { user } = store

  const { data, error, loading } = useQuery(query, {
    variables: { id },
  })

  const {
    data: dataAdresses,
    error: errorAdresses,
    loading: loadingAdresses,
  } = useQuery(queryAdresses)
  const {
    data: dataLists,
    error: errorLists,
    loading: loadingLists,
  } = useQuery(queryLists)

  const row = get(data, 'apById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: user.name,
      }
      try {
        await client.mutate({
          mutation: updateApByIdGql,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateApById: {
              ap: {
                ...variables,
                __typename: 'Ap',
              },
              __typename: 'Ap',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
    },
    [client, row, user.name],
  )

  const aeTaxonomiesfilterForData = useCallback(
    (inputValue) =>
      !!inputValue
        ? {
            or: [
              { apByArtIdExists: false },
              { apByArtId: { id: { equalTo: id } } },
            ],
            taxArtName: { includesInsensitive: inputValue },
          }
        : {
            or: [
              { apByArtIdExists: false },
              { apByArtId: { id: { equalTo: id } } },
            ],
          },
    [id],
  )

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Lade...</LoadingContainer>
      </Container>
    )
  }
  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  if (error) return `Fehler beim Laden der Daten: ${error.message}`

  return (
    <FormContainer>
      <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
        {({ handleSubmit, dirty }) => (
          <Form onBlur={() => dirty && handleSubmit()}>
            <Field
              name="artId"
              valueLabelPath="aeTaxonomyByArtId.taxArtName"
              label="Art (gibt dem Aktionsplan den Namen)"
              row={row}
              query={queryAeTaxonomies}
              filter={aeTaxonomiesfilterForData}
              queryNodesName="allAeTaxonomies"
              component={SelectLoadingOptions}
            />
            <Field
              name="bearbeitung"
              dataSource={get(dataLists, 'allApBearbstandWertes.nodes', [])}
              loading={loadingLists}
              popover={
                <>
                  <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
                  <LabelPopoverContentRow>
                    <LabelPopoverRowColumnLeft>
                      keiner:
                    </LabelPopoverRowColumnLeft>
                    <LabelPopoverRowColumnRight>
                      kein Aktionsplan vorgesehen
                    </LabelPopoverRowColumnRight>
                  </LabelPopoverContentRow>
                  <LabelPopoverContentRow>
                    <LabelPopoverRowColumnLeft>
                      erstellt:
                    </LabelPopoverRowColumnLeft>
                    <LabelPopoverRowColumnRight>
                      Aktionsplan fertig, auf der Webseite der FNS
                    </LabelPopoverRowColumnRight>
                  </LabelPopoverContentRow>
                </>
              }
              label="Aktionsplan"
              component={RadioButtonGroupWithInfo}
            />
            <Field
              name="startJahr"
              label="Start im Jahr"
              type="number"
              component={TextField}
            />
            <FieldContainer>
              <Field
                name="umsetzung"
                dataSource={get(dataLists, 'allApUmsetzungWertes.nodes', [])}
                loading={loadingLists}
                popover={
                  <>
                    <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
                    <LabelPopoverContentRow>
                      <LabelPopoverRowColumnLeft>
                        noch keine
                        <br />
                        Umsetzung:
                      </LabelPopoverRowColumnLeft>
                      <LabelPopoverRowColumnRight>
                        noch keine Massnahmen ausgeführt
                      </LabelPopoverRowColumnRight>
                    </LabelPopoverContentRow>
                    <LabelPopoverContentRow>
                      <LabelPopoverRowColumnLeft>
                        in Umsetzung:
                      </LabelPopoverRowColumnLeft>
                      <LabelPopoverRowColumnRight>
                        bereits Massnahmen ausgeführt (auch wenn AP noch nicht
                        erstellt)
                      </LabelPopoverRowColumnRight>
                    </LabelPopoverContentRow>
                  </>
                }
                label="Stand Umsetzung"
                component={RadioButtonGroupWithInfo}
              />
            </FieldContainer>
            <Field
              name="bearbeiter"
              label="Verantwortlich"
              options={get(dataAdresses, 'allAdresses.nodes', [])}
              loading={loadingAdresses}
              component={Select}
            />
            <ApUsers apId={row.id} />
            <Field
              key={`${row.id}ekfBeobachtungszeitpunkt`}
              name="ekfBeobachtungszeitpunkt"
              label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
              component={TextField}
            />
            <TextFieldNonUpdatable
              key={`${row.id}artwert`}
              label="Artwert"
              value={get(
                row,
                'aeTaxonomyByArtId.artwert',
                'Diese Art hat keinen Artwert',
              )}
            />
          </Form>
        )}
      </Formik>
    </FormContainer>
  )
}

export default observer(ApAp)
