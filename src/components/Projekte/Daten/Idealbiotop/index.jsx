import React, { useState, useCallback, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'

import TextField from '../../../shared/TextField.jsx'
import DateField from '../../../shared/Date.jsx'
import FormTitle from '../../../shared/FormTitle/index.jsx'
import constants from '../../../../modules/constants.js'
import query from './query.js'
import storeContext from '../../../../storeContext.js'
import Files from '../../../shared/Files/index.jsx'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber.js'
import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import Error from '../../../shared/Error.jsx'
import { idealbiotop } from '../../../shared/fragments.js'
import Spinner from '../../../shared/Spinner.jsx'
import useSearchParamsState from '../../../../modules/useSearchParamsState.js'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > div:first-of-type {
    > div:first-of-type {
      display: block !important;
    }
  }
`
const FormContainer = styled.div`
  padding: 0 10px;
  height: 100%;
  column-width: ${constants.columnWidth}px;
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
  scrollbar-width: thin;
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

const Idealbiotop = () => {
  const { apId: id } = useParams()

  const store = useContext(storeContext)
  const client = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const [tab, setTab] = useSearchParamsState('idealbiotopTab', 'idealbiotop')
  const onChangeTab = useCallback((event, value) => setTab(value), [setTab])

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const row = useMemo(
    () => data?.allIdealbiotops?.nodes?.[0] ?? {},
    [data?.allIdealbiotops?.nodes],
  )

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

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

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Idealbiotop" />
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
                  <FormContainer>
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

export const Component = observer(Idealbiotop)
