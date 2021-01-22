import React, { useContext, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

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
import { simpleTypes as apType } from '../../../../store/Tree/DataFilter/ap'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: ${(props) =>
    `calc(100vh - ${props['data-appbar-height']}px - ${props['data-filter-title-height']}px)`};
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
`
const FieldsContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledForm = styled(Form)`
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

const ApFilter = ({ treeName, filterTitleHeight = 81 }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue, appBarHeight, enqueNotification } = store
  const {
    activeNodeArray,
    dataFilter,
    setApFilter,
    apFilter: nurApFilter,
  } = store[treeName]

  const projId = activeNodeArray[1]
  const dataFilterAp = { ...dataFilter.ap }

  const apFilter = useMemo(() => {
    const apFilter = { projId: { equalTo: projId } }
    const apFilterValues = Object.entries(dataFilterAp).filter(
      (e) => e[1] || e[1] === 0,
    )
    apFilterValues.forEach(([key, value]) => {
      const expression = apType[key] === 'string' ? 'includes' : 'equalTo'
      apFilter[key] = { [expression]: value }
    })
    return apFilter
  }, [projId, dataFilterAp])
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
      id: dataFilter.ap.artId,
      run: !!dataFilter.ap.artId,
    },
  })

  const artname =
    !!dataFilter.ap.artId && !loadingAeTaxonomiesById
      ? get(dataAeTaxonomiesById, 'aeTaxonomyById.artname') || ''
      : ''

  const row = dataFilter.ap

  const onSubmit = useCallback(
    (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      // if showFilter, turn off 'nurAp' and tell user
      if (nurApFilter) {
        setApFilter(false)
        enqueNotification({
          message:
            'Der "nur AP"-Filter wurde ausgeschaltet. Er verträgt sich nicht mit dem Formular-Filter',
          options: {
            variant: 'info',
          },
        })
      }

      const value = values[changedField]
      dataFilterSetValue({
        treeName,
        table: 'ap',
        key: changedField,
        value,
      })
    },
    [
      dataFilterSetValue,
      enqueNotification,
      nurApFilter,
      row,
      setApFilter,
      treeName,
    ],
  )

  const aeTaxonomiesFilter = useCallback(
    (inputValue) =>
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

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  const errors = [
    ...(errorAdresses ? [errorAdresses] : []),
    ...(apsError ? [apsError] : []),
    ...(errorLists ? [errorLists] : []),
    ...(errorAeTaxonomiesById ? [errorAeTaxonomiesById] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container
        data-appbar-height={appBarHeight}
        data-filter-title-height={filterTitleHeight}
      >
        <FilterTitle
          title="Aktionsplan"
          treeName={treeName}
          table="ap"
          totalNr={get(apsData, 'allAps.totalCount', '...')}
          filteredNr={get(apsData, 'filteredAps.totalCount', '...')}
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
              key={row}
              initialValues={row}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty }) => (
                <StyledForm onBlur={() => dirty && handleSubmit()}>
                  <SelectLoadingOptions
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
                    handleSubmit={handleSubmit}
                  />
                  <RadioButtonGroupWithInfo
                    name="bearbeitung"
                    dataSource={get(
                      dataLists,
                      'allApBearbstandWertes.nodes',
                      [],
                    )}
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
                  <TextField
                    name="ekfBeobachtungszeitpunkt"
                    label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
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

export default observer(ApFilter)
