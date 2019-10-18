import React, { useContext, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfoFormik'
import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptionsFormik'
import FilterTitle from '../../../shared/FilterTitle'
import queryAeTaxonomiesById from './queryAeTaxonomiesById'
import queryLists from './queryLists'
import queryAps from './queryAps'
import queryAdresses from './queryAdresses'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
import { simpleTypes as apType } from '../../../../store/NodeFilterTree/ap'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'

const Container = styled.div`
  height: calc(100vh - 145px);
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
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

const ApFilter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { nodeFilter, nodeFilterSetValue, refetch } = store
  const { activeNodeArray } = store[treeName]

  const projId = activeNodeArray[1]
  const nodeFilterAp = { ...nodeFilter[treeName].ap }
  const apFilter = useMemo(() => {
    const apFilter = { projId: { equalTo: projId } }
    const apFilterValues = Object.entries(nodeFilterAp).filter(
      e => e[1] || e[1] === 0,
    )
    apFilterValues.forEach(([key, value]) => {
      const expression = apType[key] === 'string' ? 'includes' : 'equalTo'
      apFilter[key] = { [expression]: value }
    })
    return apFilter
  }, [projId, nodeFilterAp])
  const { data: apsData, error: apsError } = useQuery(queryAps, {
    variables: { apFilter },
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

  const {
    data: dataAeTaxonomiesById,
    error: errorAeTaxonomiesById,
    loading: loadingAeTaxonomiesById,
  } = useQuery(queryAeTaxonomiesById, {
    variables: {
      id: nodeFilter[treeName].ap.artId,
      run: !!nodeFilter[treeName].ap.artId,
    },
  })

  const artname =
    !!nodeFilter[treeName].ap.artId && !loadingAeTaxonomiesById
      ? get(dataAeTaxonomiesById, 'aeTaxonomyById.artname') || ''
      : ''

  const row = nodeFilter[treeName].ap

  const onSubmit = useCallback(
    (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const value = values[changedField]
      nodeFilterSetValue({
        treeName,
        table: 'ap',
        key: changedField,
        value,
      })
      refetch.aps()
    },
    [nodeFilterSetValue, refetch, row, treeName],
  )

  const aeTaxonomiesFilter = useCallback(
    inputValue =>
      !!inputValue
        ? {
            apByArtIdExists: true,
            artname: { includesInsensitive: inputValue },
          }
        : {
            apByArtIdExists: true,
          },
    [],
  )

  if (errorAdresses) return `Fehler: ${errorAdresses.message}`
  if (apsError) return `Fehler: ${apsError.message}`
  if (errorLists) return `Fehler: ${errorLists.message}`
  if (errorAeTaxonomiesById) {
    return `Fehler: ${errorAeTaxonomiesById.message}`
  }

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Aktionsplan"
          treeName={treeName}
          table="ap"
          totalNr={get(apsData, 'allAps.totalCount', '...')}
          filteredNr={get(apsData, 'filteredAps.totalCount', '...')}
        />
        <FieldsContainer>
          <Formik
            key={row}
            initialValues={row}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  name="artId"
                  valueLabelPath="aeTaxonomyByArtId.artname"
                  label="Art (gibt dem Aktionsplan den Namen)"
                  row={{
                    ...row,
                    ...{
                      aeTaxonomyByArtId: {
                        artname,
                      },
                    },
                  }}
                  query={queryAeTaxonomies}
                  filter={aeTaxonomiesFilter}
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
                    dataSource={get(
                      dataLists,
                      'allApUmsetzungWertes.nodes',
                      [],
                    )}
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
                            bereits Massnahmen ausgeführt (auch wenn AP noch
                            nicht erstellt)
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
                <Field
                  name="ekfBeobachtungszeitpunkt"
                  label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
                  component={TextField}
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApFilter)
