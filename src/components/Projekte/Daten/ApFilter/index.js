import React, { useContext, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import RadioButtonGroupWithInfo from '../../../shared/RadioButtonGroupWithInfo'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import FilterTitle from '../../../shared/FilterTitle'
import queryAeTaxonomiesById from './queryAeTaxonomiesById'
import queryLists from './queryLists'
import queryAps from './queryAps'
import queryAdresses from './queryAdresses'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
import { simpleTypes as apType } from '../../../../store/Tree/DataFilter/ap'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const FormContainer = styled.div`
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
  background-color: rgb(46, 125, 50);
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
  const { dataFilterSetValue, enqueNotification } = store
  const {
    activeNodeArray,
    dataFilter,
    setApFilter,
    apFilter: nurApFilter,
  } = store[treeName]

  const projId = activeNodeArray[1]

  const apFilter = useMemo(() => {
    const apFilter = { projId: { equalTo: projId } }
    const dataFilterAp = { ...dataFilter.ap }
    const apFilterValues = Object.entries(dataFilterAp).filter(
      (e) => e[1] || e[1] === 0,
    )
    apFilterValues.forEach(([key, value]) => {
      const expression = apType[key] === 'string' ? 'includes' : 'equalTo'
      apFilter[key] = { [expression]: value }
    })
    return apFilter
  }, [dataFilter.ap, projId])
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
      ? dataAeTaxonomiesById?.aeTaxonomyById?.artname ?? ''
      : ''

  const row = dataFilter.ap

  const saveToDb = useCallback(
    (event) => {
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

      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      dataFilterSetValue({
        treeName,
        table: 'ap',
        key: field,
        value,
      })
    },
    [dataFilterSetValue, enqueNotification, nurApFilter, setApFilter, treeName],
  )

  const aeTaxonomiesFilter = useCallback(
    (inputValue) =>
      inputValue
        ? {
            apByArtIdExists: true,
            artname: { includesInsensitive: inputValue },
          }
        : {
            apByArtIdExists: true,
          },
    [],
  )

  const errors = [
    ...(errorAdresses ? [errorAdresses] : []),
    ...(apsError ? [apsError] : []),
    ...(errorLists ? [errorLists] : []),
    ...(errorAeTaxonomiesById ? [errorAeTaxonomiesById] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container>
        <FilterTitle
          title="Art"
          treeName={treeName}
          table="ap"
          totalNr={apsData?.allAps?.totalCount ?? '...'}
          filteredNr={apsData?.filteredAps?.totalCount ?? '...'}
          // need to pass row even though not used
          // to ensure title re-renders an change of row
          row={row}
        />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <SelectLoadingOptions
                field="artId"
                valueLabelPath="aeTaxonomyByArtId.artname"
                label="Art (das namensgebende Taxon)"
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
                value={row.artId}
                saveToDb={saveToDb}
              />
              <RadioButtonGroupWithInfo
                name="bearbeitung"
                dataSource={dataLists?.allApBearbstandWertes?.nodes ?? []}
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
                value={row.bearbeitung}
                saveToDb={saveToDb}
              />
              <TextField
                name="startJahr"
                label="Start im Jahr"
                type="number"
                value={row.startJahr}
                saveToDb={saveToDb}
              />
              <FieldContainer>
                <RadioButtonGroupWithInfo
                  name="umsetzung"
                  dataSource={dataLists?.allApUmsetzungWertes?.nodes ?? []}
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
                  value={row.umsetzung}
                  saveToDb={saveToDb}
                />
              </FieldContainer>
              <Select
                name="bearbeiter"
                label="Verantwortlich"
                options={dataAdresses?.allAdresses?.nodes ?? []}
                loading={loadingAdresses}
                value={row.bearbeiter}
                saveToDb={saveToDb}
              />
              <TextField
                name="ekfBeobachtungszeitpunkt"
                label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
                type="text"
                value={row.ekfBeobachtungszeitpunkt}
                saveToDb={saveToDb}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApFilter)
