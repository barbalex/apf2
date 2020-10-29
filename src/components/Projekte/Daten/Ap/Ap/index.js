import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import RadioButtonGroupWithInfo from '../../../../shared/RadioButtonGroupWithInfoFormik'
import TextField from '../../../../shared/TextFieldFormik'
import Select from '../../../../shared/SelectFormik'
import SelectLoadingOptions from '../../../../shared/SelectLoadingOptionsFormik'
import TextFieldNonUpdatable from '../../../../shared/TextFieldNonUpdatable'
import query from './query'
import queryLists from './queryLists'
import queryAdresses from './queryAdresses'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../../storeContext'
import objectsFindChangedKey from '../../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../../modules/objectsEmptyValuesToNull'
import ApUsers from './ApUsers'
import { ap, aeTaxonomies } from '../../../../shared/fragments'

const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
`
const LoadingContainer = styled.div`
  height: calc(100vh - 64px);
  padding: 10px;
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

const fieldTypes = {
  bearbeitung: 'Int',
  startJahr: 'Int',
  umsetzung: 'Int',
  artId: 'UUID',
  bearbeiter: 'UUID',
  ekfBeobachtungszeitpunkt: 'String',
  projId: 'UUID',
}

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
          mutation: gql`
            mutation updateAp(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateApById(
                input: {
                  id: $id
                  apPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                ap {
                  ...ApFields
                  aeTaxonomyByArtId {
                    ...AeTaxonomiesFields
                  }
                }
              }
            }
            ${ap}
            ${aeTaxonomies}
          `,
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
    return <LoadingContainer>Lade...</LoadingContainer>
  }
  if (errorAdresses) {
    return (
      <LoadingContainer>{`Fehler: ${errorAdresses.message}`}</LoadingContainer>
    )
  }
  if (errorLists) {
    return (
      <LoadingContainer>{`Fehler: ${errorLists.message}`}</LoadingContainer>
    )
  }
  if (error) {
    return (
      <LoadingContainer>
        `Fehler beim Laden der Daten: ${error.message}`
      </LoadingContainer>
    )
  }

  return (
    <SimpleBar
      style={{
        maxHeight: '100%',
        height: '100%',
      }}
    >
      <FormContainer>
        <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
          {({ handleSubmit, dirty }) => (
            <Form onBlur={() => dirty && handleSubmit()}>
              <SelectLoadingOptions
                name="artId"
                valueLabelPath="aeTaxonomyByArtId.taxArtName"
                label="Art (gibt dem Aktionsplan den Namen)"
                row={row}
                query={queryAeTaxonomies}
                filter={aeTaxonomiesfilterForData}
                queryNodesName="allAeTaxonomies"
                handleSubmit={handleSubmit}
              />
              <RadioButtonGroupWithInfo
                name="bearbeitung"
                dataSource={get(dataLists, 'allApBearbstandWertes.nodes', [])}
                loading={loadingLists}
                popover={
                  <>
                    <LabelPopoverTitleRow data-id="info-icon-popover">
                      Legende
                    </LabelPopoverTitleRow>
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
                handleSubmit={handleSubmit}
              />
              <TextField
                name="startJahr"
                label="Start im Jahr"
                type="number"
                handleSubmit={handleSubmit}
              />
              <FieldContainer>
                <RadioButtonGroupWithInfo
                  name="umsetzung"
                  dataSource={get(dataLists, 'allApUmsetzungWertes.nodes', [])}
                  loading={loadingLists}
                  popover={
                    <>
                      <LabelPopoverTitleRow data-id="info-icon-popover">
                        Legende
                      </LabelPopoverTitleRow>
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
                  handleSubmit={handleSubmit}
                />
              </FieldContainer>
              <Select
                name="bearbeiter"
                label="Verantwortlich"
                options={get(dataAdresses, 'allAdresses.nodes', [])}
                loading={loadingAdresses}
                handleSubmit={handleSubmit}
              />
              <ApUsers apId={row.id} />
              <TextField
                key={`${row.id}ekfBeobachtungszeitpunkt`}
                name="ekfBeobachtungszeitpunkt"
                label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
                handleSubmit={handleSubmit}
              />
              <TextFieldNonUpdatable
                key={`${row.id}artwert`}
                label="Artwert"
                value={get(
                  row,
                  'aeTaxonomyByArtId.artwert',
                  'Diese Art hat keinen Artwert',
                )}
                handleSubmit={handleSubmit}
              />
            </Form>
          )}
        </Formik>
      </FormContainer>
    </SimpleBar>
  )
}

export default observer(ApAp)
