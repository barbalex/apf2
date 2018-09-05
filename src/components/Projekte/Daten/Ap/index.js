// @flow
import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import updateApByIdGql from './updateApById.graphql'
import withNodeFilter from '../../../../state/withNodeFilter'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
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

const enhance = compose(
  withNodeFilter,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({
      refetchTree,
      setErrors,
      errors,
      nodeFilterState,
      treeName,
    }) => async ({ row, field, value, updateAp }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      const { show: showFilter } = nodeFilterState.state
      if (showFilter) {
        nodeFilterState.setValue({ treeName, table: 'ap', key: field, value })
      } else {
        try {
          await updateAp({
            variables: {
              id: row.id,
              [field]: value,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateApById: {
                ap: {
                  id: row.id,
                  startJahr: field === 'startJahr' ? value : row.startJahr,
                  bearbeitung:
                    field === 'bearbeitung' ? value : row.bearbeitung,
                  umsetzung: field === 'umsetzung' ? value : row.umsetzung,
                  artId: field === 'artId' ? value : row.artId,
                  bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                  ekfBeobachtungszeitpunkt:
                    field === 'ekfBeobachtungszeitpunkt'
                      ? value
                      : row.ekfBeobachtungszeitpunkt,
                  projId: field === 'projId' ? value : row.projId,
                  adresseByBearbeiter: row.adresseByBearbeiter,
                  aeEigenschaftenByArtId: row.aeEigenschaftenByArtId,
                  __typename: 'Ap',
                },
                __typename: 'Ap',
              },
            },
          })
        } catch (error) {
          return setErrors({ [field]: error.message })
        }
        setErrors({})
        if (['artId'].includes(field)) refetchTree()
      }
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  }),
)

const Ap = ({
  treeName,
  saveToDb,
  errors,
  nodeFilterState,
}: {
  treeName: String,
  saveToDb: () => void,
  errors: Object,
  nodeFilterState: Object,
}) => (
  <Query query={data1Gql}>
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`
      const id = get(data, `${treeName}.activeNodeArray[3]`)
      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)

      return (
        <Query query={data2Gql} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading)
              return (
                <Container>
                  <FieldsContainer>Lade...</FieldsContainer>
                </Container>
              )
            if (error) return `Fehler: ${error.message}`

            let bearbeitungWerte = get(data, 'allApBearbstandWertes.nodes', [])
            bearbeitungWerte = sortBy(bearbeitungWerte, 'sort')
            bearbeitungWerte = bearbeitungWerte.map(el => ({
              value: el.code,
              label: el.text,
            }))
            let umsetzungWerte = get(data, 'allApUmsetzungWertes.nodes', [])
            umsetzungWerte = sortBy(umsetzungWerte, 'sort')
            umsetzungWerte = umsetzungWerte.map(el => ({
              value: el.code,
              label: el.text,
            }))
            let adressenWerte = get(data, 'allAdresses.nodes', [])
            adressenWerte = sortBy(adressenWerte, 'name')
            adressenWerte = adressenWerte.map(el => ({
              label: el.name,
              value: el.id,
            }))
            // list all ap-Arten BUT the active one
            const apArten = get(data, 'allAps.nodes', [])
              .filter(o => o.id !== id)
              .map(o => o.artId)
            let artWerte = get(data, 'allAeEigenschaftens.nodes', [])
            // filter ap arten but the active one
            artWerte = artWerte.filter(o => !apArten.includes(o.id))
            artWerte = sortBy(artWerte, 'artname')
            artWerte = artWerte.map(el => ({
              value: el.id,
              label: el.artname,
            }))

            const { show: showFilter } = nodeFilterState.state
            let row
            if (showFilter) {
              row = nodeFilterState.state[treeName].ap
            } else {
              row = get(data, 'apById')
            }
            console.log('Ap, row:', row)

            return (
              <ErrorBoundary>
                <Container>
                  <FormTitle
                    apId={id}
                    title="Aktionsplan"
                    activeNodeArray={activeNodeArray}
                    treeName={treeName}
                  />
                  <Mutation mutation={updateApByIdGql}>
                    {(updateAp, { data }) => (
                      <FieldsContainer>
                        <Select
                          key={`${row.id}artId`}
                          value={row.artId}
                          field="artId"
                          label="Art (gibt dem Aktionsplan den Namen)"
                          options={artWerte}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'artId',
                              value,
                              updateAp,
                            })
                          }
                          error={errors.artId}
                        />
                        <RadioButtonGroupWithInfo
                          key={`${row.id}bearbeitung`}
                          value={row.bearbeitung}
                          dataSource={bearbeitungWerte}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'bearbeitung',
                              value,
                              updateAp,
                            })
                          }
                          error={errors.bearbeitung}
                          popover={
                            <Fragment>
                              <LabelPopoverTitleRow>
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
                            </Fragment>
                          }
                          label="Aktionsplan"
                        />
                        <TextField
                          key={`${row.id}startJahr`}
                          label="Start im Jahr"
                          value={row.startJahr}
                          type="number"
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'startJahr',
                              value,
                              updateAp,
                            })
                          }
                          error={errors.startJahr}
                        />
                        <FieldContainer>
                          <RadioButtonGroupWithInfo
                            key={`${row.id}umsetzung`}
                            value={row.umsetzung}
                            dataSource={umsetzungWerte}
                            saveToDb={value =>
                              updateAp({
                                variables: {
                                  id,
                                  umsetzung: value,
                                },
                              })
                            }
                            error={errors.umsetzung}
                            popover={
                              <Fragment>
                                <LabelPopoverTitleRow>
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
                                    bereits Massnahmen ausgeführt (auch wenn AP
                                    noch nicht erstellt)
                                  </LabelPopoverRowColumnRight>
                                </LabelPopoverContentRow>
                              </Fragment>
                            }
                            label="Stand Umsetzung"
                          />
                        </FieldContainer>
                        <Select
                          key={`${row.id}bearbeiter`}
                          value={row.bearbeiter}
                          field="bearbeiter"
                          label="Verantwortlich"
                          options={adressenWerte}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'bearbeiter',
                              value,
                              updateAp,
                            })
                          }
                          error={errors.bearbeiter}
                        />
                        <TextField
                          key={`${row.id}ekfBeobachtungszeitpunkt`}
                          label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
                          value={row.ekfBeobachtungszeitpunkt}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'ekfBeobachtungszeitpunkt',
                              value,
                              updateAp,
                            })
                          }
                          error={errors.ekfBeobachtungszeitpunkt}
                        />
                        <TextFieldNonUpdatable
                          key={`${row.id}artwert`}
                          label="Artwert"
                          value={get(
                            row,
                            'aeEigenschaftenByArtId.artwert',
                            'Diese Art hat keinen Artwert',
                          )}
                        />
                      </FieldsContainer>
                    )}
                  </Mutation>
                </Container>
              </ErrorBoundary>
            )
          }}
        </Query>
      )
    }}
  </Query>
)

export default enhance(Ap)
