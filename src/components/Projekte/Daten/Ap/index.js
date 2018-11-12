// @flow
import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
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
import withAeEigenschaftens from './withAeEigenschaftens'
import updateApByIdGql from './updateApById'
import withNodeFilter from '../../../../state/withNodeFilter'
import withAllAdresses from './withAllAdresses'
import withAllAps from './withAllAps'
import withLocalData from './withLocalData'
import withData from './withData'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
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
  withAllAps,
  withAllAdresses,
  withAeEigenschaftens,
  withNodeFilter,
  withLocalData,
  withData,
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
      const showFilter = !!nodeFilterState.state[treeName].activeTable
      if (showFilter) {
        nodeFilterState.setValue({
          treeName,
          table: 'ap',
          key: field,
          value,
        })
        refetchTree('aps')
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
        if (['artId'].includes(field)) refetchTree('aps')
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
  dataAeEigenschaftens,
  dataAllAdresses,
  dataAllAps,
  localData,
  data,
}: {
  treeName: String,
  saveToDb: () => void,
  errors: Object,
  nodeFilterState: Object,
  dataAeEigenschaftens: Object,
  dataAllAdresses: Object,
  dataAllAps: Object,
  localData: Object,
  data: Object,
}) => {
  if (
    data.loading ||
    dataAeEigenschaftens.loading ||
    dataAllAdresses.loading ||
    dataAllAps.loading
  )
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (dataAeEigenschaftens.error)
    return `Fehler: ${dataAeEigenschaftens.error.message}`
  if (dataAllAdresses.error) return `Fehler: ${dataAllAdresses.error.message}`
  if (dataAllAps.error) return `Fehler: ${dataAllAps.error.message}`
  if (localData.error) return `Fehler: ${localData.error.message}`
  if (data.error) return `Fehler: ${data.error.message}`

  console.log('Ap rendering', { data })

  const id = get(
    localData,
    `${treeName}.activeNodeArray[3]`,
    // pass in fake id to avoid error when filter is shown
    // which means there is no id
    '99999999-9999-9999-9999-999999999999',
  )

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
  let adressenWerte = get(dataAllAdresses, 'allAdresses.nodes', [])
  adressenWerte = sortBy(adressenWerte, 'name')
  adressenWerte = adressenWerte.map(el => ({
    label: el.name,
    value: el.id,
  }))

  const showFilter = !!nodeFilterState.state[treeName].activeTable
  let apArten
  let artWerte
  if (showFilter) {
    apArten = get(dataAllAps, 'allAps.nodes', []).map(o => o.artId)
    artWerte = get(dataAeEigenschaftens, 'allAeEigenschaftens.nodes', [])
    // only list ap arten
    artWerte = artWerte.filter(o => apArten.includes(o.id))
    artWerte = sortBy(artWerte, 'artname')
    artWerte = artWerte.map(el => ({
      value: el.id,
      label: el.artname,
    }))
  } else {
    // list all ap-Arten BUT the active one
    apArten = get(dataAllAps, 'allAps.nodes', [])
      .filter(o => o.id !== id)
      .map(o => o.artId)
    artWerte = get(dataAeEigenschaftens, 'allAeEigenschaftens.nodes', [])
    // filter ap arten but the active one
    artWerte = artWerte.filter(o => !apArten.includes(o.id))
    artWerte = sortBy(artWerte, 'artname')
    artWerte = artWerte.map(el => ({
      value: el.id,
      label: el.artname,
    }))
  }

  let row
  if (showFilter) {
    row = nodeFilterState.state[treeName].ap
  } else {
    row = get(data, 'apById', {})
  }

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <FormTitle
          apId={id}
          title="Aktionsplan"
          treeName={treeName}
          table="ap"
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
                  saveToDb={value => {
                    saveToDb({
                      row,
                      field: 'umsetzung',
                      value,
                      updateAp,
                    })
                  }}
                  error={errors.umsetzung}
                  popover={
                    <Fragment>
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
              {!showFilter && (
                <TextFieldNonUpdatable
                  key={`${row.id}artwert`}
                  label="Artwert"
                  value={get(
                    row,
                    'aeEigenschaftenByArtId.artwert',
                    'Diese Art hat keinen Artwert',
                  )}
                />
              )}
            </FieldsContainer>
          )}
        </Mutation>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Ap)
