import React, { useState, useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextField'
import DateField from '../../../shared/Date'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import query from './query'
import storeContext from '../../../../storeContext'
import Files from '../../../shared/Files'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { idealbiotop } from '../../../shared/fragments'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div:first-child {
    > div:first-child {
      display: block !important;
    }
  }
`
const FormContainer = styled.div`
  padding: 0 10px;
  height: 100%;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`
const FilesContainer = styled.div`
  height: 100%;
`
const Section = styled.div`
  padding-top: 20px;
  padding-bottom: 7px;
  font-weight: bold;
  break-after: avoid;
  &:after {
    content: ':';
  }
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  overflow-y: auto;
`
const fieldTypes = {
  apId: 'UUID',
  erstelldatum: 'Date',
  hoehenlage: 'String',
  region: 'String',
  exposition: 'String',
  besonnung: 'String',
  hangneigung: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  wasserhaushalt: 'String',
  konkurrenz: 'String',
  moosschicht: 'String',
  krautschicht: 'String',
  strauchschicht: 'String',
  baumschicht: 'String',
  bemerkungen: 'String',
}

const Idealbiotop = ({ treeName }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store
  const client = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const [tab, setTab] = useState(urlQuery?.idealbiotopTab ?? 'idealbiotop')
  const { activeNodeArray, formWidth: width } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 3
          ? activeNodeArray[3]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = useMemo(
    () => data?.allIdealbiotops?.nodes?.[0] ?? {},
    [data?.allIdealbiotops?.nodes],
  )

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateIdealbiotop(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateIdealbiotopById(
                input: {
                  id: $id
                  idealbiotopPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                idealbiotop {
                  ...IdealbiotopFields
                }
              }
            }
            ${idealbiotop}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
    },
    [client, row, store.user.name],
  )

  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'idealbiotopTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Idealbiotop"
          treeName={treeName}
          table="idealbiotop"
        />
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab
              label="Idealbiotop"
              value="idealbiotop"
              data-id="idealbiotop"
            />
            <StyledTab label="Dateien" value="dateien" data-id="dateien" />
          </Tabs>
          <div style={{ overflowY: 'auto' }}>
            <TabContent>
              <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
                {tab === 'idealbiotop' && (
                  <FormContainer data-column-width={columnWidth}>
                    <DateField
                      name="erstelldatum"
                      label="Erstelldatum"
                      value={row.erstelldatum}
                      saveToDb={saveToDb}
                      error={fieldErrors.erstelldatum}
                    />
                    <Section>Lage</Section>
                    <TextField
                      name="hoehenlage"
                      label="Höhe"
                      type="text"
                      multiLine
                      value={row.hoehenlage}
                      saveToDb={saveToDb}
                      error={fieldErrors.hoehenlage}
                    />
                    <TextField
                      name="region"
                      label="Region"
                      type="text"
                      multiLine
                      value={row.region}
                      saveToDb={saveToDb}
                      error={fieldErrors.region}
                    />
                    <TextField
                      name="exposition"
                      label="Exposition"
                      type="text"
                      multiLine
                      value={row.exposition}
                      saveToDb={saveToDb}
                      error={fieldErrors.exposition}
                    />
                    <TextField
                      name="besonnung"
                      label="Besonnung"
                      type="text"
                      multiLine
                      value={row.besonnung}
                      saveToDb={saveToDb}
                      error={fieldErrors.besonnung}
                    />
                    <TextField
                      name="hangneigung"
                      label="Hangneigung"
                      type="text"
                      multiLine
                      value={row.hangneigung}
                      saveToDb={saveToDb}
                      error={fieldErrors.hangneigung}
                    />
                    <Section>Boden</Section>
                    <TextField
                      name="bodenTyp"
                      label="Typ"
                      type="text"
                      multiLine
                      value={row.bodenTyp}
                      saveToDb={saveToDb}
                      error={fieldErrors.bodenTyp}
                    />
                    <TextField
                      name="bodenKalkgehalt"
                      label="Kalkgehalt"
                      type="text"
                      multiLine
                      value={row.bodenKalkgehalt}
                      saveToDb={saveToDb}
                      error={fieldErrors.bodenKalkgehalt}
                    />
                    <TextField
                      name="bodenDurchlaessigkeit"
                      label="Durchlässigkeit"
                      type="text"
                      multiLine
                      value={row.bodenDurchlaessigkeit}
                      saveToDb={saveToDb}
                      error={fieldErrors.bodenDurchlaessigkeit}
                    />
                    <TextField
                      name="bodenHumus"
                      label="Humus"
                      type="text"
                      multiLine
                      value={row.bodenHumus}
                      saveToDb={saveToDb}
                      error={fieldErrors.bodenHumus}
                    />
                    <TextField
                      name="bodenNaehrstoffgehalt"
                      label="Nährstoffgehalt"
                      type="text"
                      multiLine
                      value={row.bodenNaehrstoffgehalt}
                      saveToDb={saveToDb}
                      error={fieldErrors.bodenNaehrstoffgehalt}
                    />
                    <TextField
                      name="wasserhaushalt"
                      label="Wasserhaushalt"
                      type="text"
                      multiLine
                      value={row.wasserhaushalt}
                      saveToDb={saveToDb}
                      error={fieldErrors.wasserhaushalt}
                    />
                    <Section>Vegetation</Section>
                    <TextField
                      name="konkurrenz"
                      label="Konkurrenz"
                      type="text"
                      multiLine
                      value={row.konkurrenz}
                      saveToDb={saveToDb}
                      error={fieldErrors.konkurrenz}
                    />
                    <TextField
                      name="moosschicht"
                      label="Moosschicht"
                      type="text"
                      multiLine
                      value={row.moosschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.moosschicht}
                    />
                    <TextField
                      name="krautschicht"
                      label="Krautschicht"
                      type="text"
                      multiLine
                      value={row.krautschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.krautschicht}
                    />
                    <TextField
                      name="strauchschicht"
                      label="Strauchschicht"
                      type="text"
                      multiLine
                      value={row.strauchschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.strauchschicht}
                    />
                    <TextField
                      name="baumschicht"
                      label="Baumschicht"
                      type="text"
                      multiLine
                      value={row.baumschicht}
                      saveToDb={saveToDb}
                      error={fieldErrors.baumschicht}
                    />
                    <TextField
                      name="bemerkungen"
                      label="Bemerkungen"
                      type="text"
                      multiLine
                      value={row.bemerkungen}
                      saveToDb={saveToDb}
                      error={fieldErrors.bemerkungen}
                    />
                  </FormContainer>
                )}
                {tab === 'dateien' && (
                  <FilesContainer>
                    <Files parentId={row.id} parent="idealbiotop" />
                  </FilesContainer>
                )}
              </SimpleBar>
            </TabContent>
          </div>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Idealbiotop)
