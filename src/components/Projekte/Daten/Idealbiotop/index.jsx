import { useState, useCallback, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { TextField } from '../../../shared/TextField.jsx'
import { DateField } from '../../../shared/Date.jsx'
import { constants } from '../../../../modules/constants.js'
import { query } from './query.js'
import { StoreContext } from '../../../../storeContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { idealbiotop } from '../../../shared/fragments.js'
import { Spinner } from '../../../shared/Spinner.jsx'

const FormContainer = styled.div`
  padding: 0 10px;
  height: 100%;
  column-width: ${constants.columnWidth}px;
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
const simplebarStyle = { maxHeight: '100%', height: '100%' }

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

export const Component = observer(() => {
  const { apId } = useParams()

  const store = useContext(StoreContext)
  const client = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: apId,
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
        id: apId,
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
    </ErrorBoundary>
  )
})
