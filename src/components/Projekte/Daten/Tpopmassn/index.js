import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import { withResizeDetector } from 'react-resize-detector'
import SimpleBar from 'simplebar-react'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import MdField from '../../../shared/MarkdownFieldFormik'
import Select from '../../../shared/SelectFormik'
import SelectLoadingOptionsTypable from '../../../shared/SelectLoadingOptionsTypableFormik'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import DateField from '../../../shared/DateFormik'
import StringToCopy from '../../../shared/StringToCopy'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import query from './query'
import queryLists from './queryLists'
import queryAdresses from './queryAdresses'
import queryAeTaxonomies from './queryAeTaxonomies'
import queryIsMassnTypAnpflanzung from './queryIsMassnTypAnpflanzung'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import exists from '../../../../modules/exists'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { tpopmassn } from '../../../shared/fragments'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const ColumnContainer = styled.div`
  padding: 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: ${(props) =>
    `calc(100% - ${props['data-form-title-height']}px - 48px)`};
`

const fieldTypes = {
  typ: 'Int',
  beschreibung: 'String',
  jahr: 'Int',
  datum: 'Date',
  bemerkungen: 'String',
  planBezeichnung: 'String',
  flaeche: 'Int',
  markierung: 'String',
  anzTriebe: 'Int',
  anzPflanzen: 'Int',
  anzPflanzstellen: 'Int',
  zieleinheitEinheit: 'Int',
  zieleinheitAnzahl: 'Int',
  wirtspflanze: 'String',
  herkunftPop: 'String',
  sammeldatum: 'String',
  vonAnzahlIndividuen: 'Int',
  form: 'String',
  pflanzanordnung: 'String',
  tpopId: 'UUID',
  bearbeiter: 'UUID',
  planVorhanden: 'Boolean',
}

const Tpopmassn = ({ treeName, showFilter = false, width = 1000 }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery, appBarHeight } = store

  const { activeNodeArray } = store[treeName]

  let id =
    activeNodeArray.length > 9
      ? activeNodeArray[9]
      : '99999999-9999-9999-9999-999999999999'
  if (showFilter) id = '99999999-9999-9999-9999-999999999999'
  const apId = activeNodeArray[3]
  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const notMassnCountUnit =
    data?.tpopmassnById?.tpopByTpopId?.popByPopId?.apByApId
      ?.ekzaehleinheitsByApId?.nodes?.[0]?.notMassnCountUnit

  const {
    data: dataAdresses,
    loading: loadingAdresses,
    error: errorAdresses,
  } = useQuery(queryAdresses)
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = data?.tpopmassnById ?? {}

  const { data: dataIsMassnTypAnpflanzung } = useQuery(
    queryIsMassnTypAnpflanzung,
    {
      variables: { typ: row.typ || 999999999 },
    },
  )
  const isAnpflanzung =
    dataIsMassnTypAnpflanzung?.allTpopmassnTypWertes?.nodes?.[0]?.anpflanzung

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      // happens after choosing wirtspflanze from select
      if (!changedField) return
      const value = values[changedField]
      /**
       * enable passing two values
       * with same update
       */
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      if (changedField === 'jahr') {
        variables.datum = null
      }
      if (changedField === 'datum') {
        variables.jahr =
          value && value.substring ? +value.substring(0, 4) : value
      }
      if (changedField === 'typ') {
        // IF typ is anpflanzung
        // have to set zieleinheit_einheit to
        // ekzaehleinheit with zielrelevant = true
        let zieleinheitIdResult
        try {
          zieleinheitIdResult = await client.query({
            query: gql`
              query tpopmassnZieleinheitQuery($apId: UUID!, $typ: Int!) {
                allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                  nodes {
                    id
                    anpflanzung
                  }
                }
                allEkzaehleinheits(
                  filter: {
                    zielrelevant: { equalTo: true }
                    apId: { equalTo: $apId }
                  }
                ) {
                  nodes {
                    id
                    tpopkontrzaehlEinheitWerteByZaehleinheitId {
                      id
                      code
                      correspondsToMassnAnzTriebe
                      correspondsToMassnAnzPflanzen
                    }
                  }
                }
              }
            `,
            variables: { apId, typ: variables.typ || 1 },
          })
        } catch (error) {
          return setErrors({ [changedField]: error.message })
        }
        const isAnpflanzung =
          zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
            ?.anpflanzung
        const zieleinheit =
          zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
            ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
        const zieleinheitCode = zieleinheit?.code
        if (isAnpflanzung && zieleinheitCode) {
          variables.zieleinheitEinheit = zieleinheitCode
          if (!notMassnCountUnit && zieleinheit?.correspondsToMassnAnzTriebe) {
            variables.zieleinheitAnzahl = row.anzTriebe
          }
          if (
            !notMassnCountUnit &&
            zieleinheit?.correspondsToMassnAnzPflanzen
          ) {
            variables.zieleinheitAnzahl = row.anzPflanzen
          }
        }
      }
      if (!notMassnCountUnit && changedField === 'anzTriebe') {
        // IF zieleinheit corresponds to Anzahl Triebe
        // have to set zieleinheitAnzahl to anzTriebe
        let zieleinheitIdResult
        try {
          zieleinheitIdResult = await client.query({
            query: gql`
              query tpopmassnZieleinheitQuery2($apId: UUID!, $typ: Int!) {
                allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                  nodes {
                    id
                    anpflanzung
                  }
                }
                allEkzaehleinheits(
                  filter: {
                    zielrelevant: { equalTo: true }
                    apId: { equalTo: $apId }
                  }
                ) {
                  nodes {
                    id
                    tpopkontrzaehlEinheitWerteByZaehleinheitId {
                      id
                      correspondsToMassnAnzTriebe
                    }
                  }
                }
              }
            `,
            variables: { apId, typ: variables.typ || 1 },
          })
        } catch (error) {
          return setErrors({ [changedField]: error.message })
        }
        const isAnpflanzung =
          zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
            ?.anpflanzung
        const zieleinheit =
          zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
            ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
        if (isAnpflanzung && zieleinheit?.correspondsToMassnAnzTriebe) {
          variables.zieleinheitAnzahl = exists(value) ? value : null
        }
      }
      if (!notMassnCountUnit && changedField === 'anzPflanzen') {
        // IF zieleinheit corresponds to Anzahl Triebe
        // have to set zieleinheitAnzahl to anzPflanzen
        let zieleinheitIdResult
        try {
          zieleinheitIdResult = await client.query({
            query: gql`
              query tpopmassnZieleinheitQuery3($apId: UUID!, $typ: Int!) {
                allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
                  nodes {
                    id
                    anpflanzung
                  }
                }
                allEkzaehleinheits(
                  filter: {
                    zielrelevant: { equalTo: true }
                    apId: { equalTo: $apId }
                  }
                ) {
                  nodes {
                    id
                    tpopkontrzaehlEinheitWerteByZaehleinheitId {
                      id
                      correspondsToMassnAnzPflanzen
                    }
                  }
                }
              }
            `,
            variables: { apId, typ: variables.typ || 1 },
          })
        } catch (error) {
          return setErrors({ [changedField]: error.message })
        }
        const isAnpflanzung =
          zieleinheitIdResult?.data?.allTpopmassnTypWertes?.nodes?.[0]
            ?.anpflanzung
        const zieleinheit =
          zieleinheitIdResult?.data?.allEkzaehleinheits?.nodes?.[0]
            ?.tpopkontrzaehlEinheitWerteByZaehleinheitId
        if (isAnpflanzung && zieleinheit?.correspondsToMassnAnzPflanzen) {
          variables.zieleinheitAnzahl = exists(value) ? value : null
        }
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateTpopmassn(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              ${changedField === 'jahr' ? '$datum: Date' : ''}
              ${changedField === 'datum' ? '$jahr: Int' : ''}
              ${changedField === 'typ' ? '$zieleinheitEinheit: Int' : ''}
              ${
                ['typ', 'anzTriebe', 'anzPflanzen'].includes(changedField)
                  ? '$zieleinheitAnzahl: Int'
                  : ''
              }
              $changedBy: String
            ) {
              updateTpopmassnById(
                input: {
                  id: $id
                  tpopmassnPatch: {
                    ${changedField}: $${changedField}
                    ${changedField === 'jahr' ? 'datum: $datum' : ''}
                    ${changedField === 'datum' ? 'jahr: $jahr' : ''}
                    ${
                      changedField === 'typ'
                        ? 'zieleinheitEinheit: $zieleinheitEinheit'
                        : ''
                    }
                    ${
                      ['typ', 'anzTriebe', 'anzPflanzen'].includes(changedField)
                        ? 'zieleinheitAnzahl: $zieleinheitAnzahl'
                        : ''
                    }
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopmassn {
                  ...TpopmassnFields
                }
              }
            }
            ${tpopmassn}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopmassnById: {
              tpopmassn: {
                ...variables,
                __typename: 'Tpopmassn',
              },
              __typename: 'Tpopmassn',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
    },
    [apId, client, notMassnCountUnit, row, store.user.name],
  )

  const [tab, setTab] = useState(urlQuery?.tpopmassnTab ?? 'tpopmassn')
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'tpopmassnTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  const [formTitleHeight, setFormTitleHeight] = useState(43)

  //console.log('Tpopmassn rendering')

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (loading) {
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  }

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
    ...(errorAdresses ? [errorAdresses] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container data-appbar-height={appBarHeight}>
        <FormTitle
          apId={activeNodeArray[3]}
          title="Massnahme"
          treeName={treeName}
          setFormTitleHeight={setFormTitleHeight}
        />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="Massnahme" value="tpopmassn" data-id="tpopmassn" />
          <StyledTab label="Dateien" value="dateien" data-id="dateien" />
        </Tabs>
        <TabContent data-form-title-height={formTitleHeight}>
          {tab === 'tpopmassn' && (
            <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
              <ColumnContainer data-column-width={columnWidth}>
                <Formik
                  key={showFilter ? row : row.id}
                  initialValues={row}
                  onSubmit={onSubmit}
                  enableReinitialize
                >
                  {({ handleSubmit, dirty }) => (
                    <Form onBlur={() => dirty && handleSubmit()}>
                      <TextField
                        name="jahr"
                        label="Jahr"
                        type="number"
                        handleSubmit={handleSubmit}
                      />
                      <DateField
                        name="datum"
                        label="Datum"
                        handleSubmit={handleSubmit}
                      />
                      <RadioButtonGroup
                        name="typ"
                        label="Typ"
                        dataSource={
                          dataLists?.allTpopmassnTypWertes?.nodes ?? []
                        }
                        loading={loadingLists}
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="beschreibung"
                        label="Massnahme"
                        type="text"
                        handleSubmit={handleSubmit}
                      />
                      <Select
                        name="bearbeiter"
                        value={row.bearbeiter}
                        label="BearbeiterIn"
                        options={dataAdresses?.allAdresses?.nodes ?? []}
                        loading={loadingAdresses}
                        handleSubmit={handleSubmit}
                      />
                      <MdField name="bemerkungen" label="Bemerkungen" />
                      <Checkbox2States
                        name="planVorhanden"
                        label="Plan vorhanden"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="planBezeichnung"
                        label="Plan Bezeichnung"
                        type="text"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="flaeche"
                        label="Fläche (m2)"
                        type="number"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="form"
                        label="Form der Ansiedlung"
                        type="text"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="pflanzanordnung"
                        label="Pflanzanordnung"
                        type="text"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="markierung"
                        label="Markierung"
                        type="text"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="anzTriebe"
                        label="Anzahl Triebe"
                        type="number"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="anzPflanzen"
                        label="Anzahl Pflanzen"
                        type="number"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="anzPflanzstellen"
                        label="Anzahl Pflanzstellen"
                        type="number"
                        handleSubmit={handleSubmit}
                      />
                      {isAnpflanzung && (
                        <>
                          <Select
                            name="zieleinheitEinheit"
                            label="Ziel-Einheit: Einheit (wird automatisch gesetzt)"
                            options={
                              dataLists?.allTpopkontrzaehlEinheitWertes
                                ?.nodes ?? []
                            }
                            loading={loadingLists}
                            handleSubmit={handleSubmit}
                          />
                          <TextField
                            name="zieleinheitAnzahl"
                            label={
                              notMassnCountUnit === true
                                ? 'Ziel-Einheit: Anzahl'
                                : 'Ziel-Einheit: Anzahl (wird automatisch gesetzt)'
                            }
                            type="number"
                            handleSubmit={handleSubmit}
                          />
                        </>
                      )}
                      <SelectLoadingOptionsTypable
                        key={`${id}${!!row.wirtspflanze}`}
                        name="wirtspflanze"
                        label="Wirtspflanze"
                        handleSubmit={handleSubmit}
                        query={queryAeTaxonomies}
                        queryNodesName="allAeTaxonomies"
                      />
                      <TextField
                        name="herkunftPop"
                        label="Herkunftspopulation"
                        type="text"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="sammeldatum"
                        label="Sammeldatum"
                        type="text"
                        handleSubmit={handleSubmit}
                      />
                      <TextField
                        name="vonAnzahlIndividuen"
                        label="Anzahl besammelte Individuen der Herkunftspopulation"
                        type="number"
                        handleSubmit={handleSubmit}
                      />
                      {!showFilter && <StringToCopy text={row.id} label="id" />}
                    </Form>
                  )}
                </Formik>
              </ColumnContainer>
            </SimpleBar>
          )}
          {tab === 'dateien' && !showFilter && (
            <Files parentId={row.id} parent="tpopmassn" />
          )}
        </TabContent>
      </Container>
    </ErrorBoundary>
  )
}

export default withResizeDetector(observer(Tpopmassn))
