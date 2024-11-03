import { useState, useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { Select } from '../../../shared/Select.jsx'
import { constants } from '../../../../modules/constants.js'
import { query } from './query.js'
import { StoreContext } from '../../../../storeContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { tpopfeldkontr } from '../../../shared/fragments.js'
import { Spinner } from '../../../shared/Spinner.jsx'
import { fieldTypes, FormContainer, Section } from './index.jsx'

export const Component = observer(() => {
  const { tpopkontrId } = useParams()

  const client = useApolloClient()
  const queryClient = useQueryClient()
  const store = useContext(StoreContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: tpopkontrId,
    },
  })

  const row = data?.tpopkontrById ?? {}

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      if (field === 'jahr') {
        variables.datum = null
      }
      if (field === 'datum') {
        // value can be null so check if substring method exists
        const newJahr =
          value && value.substring ? +value.substring(0, 4) : value
        variables.jahr = newJahr
      }
      try {
        await client.mutate({
          mutation: gql`
              mutation updateTpopkontrForEk(
                $id: UUID!
                $${field}: ${fieldTypes[field]}
                ${field === 'jahr' ? '$datum: Date' : ''}
                ${field === 'datum' ? '$jahr: Int' : ''}
                $changedBy: String
              ) {
                updateTpopkontrById(
                  input: {
                    id: $id
                    tpopkontrPatch: {
                      ${field}: $${field}
                      ${field === 'jahr' ? 'datum: $datum' : ''}
                      ${field === 'datum' ? 'jahr: $jahr' : ''}
                      changedBy: $changedBy
                    }
                  }
                ) {
                  tpopkontr {
                    ...TpopfeldkontrFields
                  }
                }
              }
              ${tpopfeldkontr}
            `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      if (['jahr', 'datum', 'typ'].includes(field)) {
        queryClient.invalidateQueries({
          queryKey: [`treeTpopfeldkontr`],
        })
      }
    },
    [client, queryClient, row.id, store.user.name],
  )

  const aeLrWerte = (data?.allAeLrDelarzes?.nodes ?? [])
    .map(
      (e) => `${e.label}: ${e.einheit ? e.einheit.replace(/  +/g, ' ') : ''}`,
    )
    .map((o) => ({ value: o, label: o }))

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
        <FormContainer>
          <TextField
            name="flaeche"
            label="Fläche"
            type="number"
            value={row.flaeche}
            saveToDb={saveToDb}
            error={fieldErrors.flaeche}
          />
          <Section>Vegetation</Section>
          <Select
            data-id="lrDelarze"
            name="lrDelarze"
            label="Lebensraum nach Delarze"
            options={aeLrWerte}
            loading={loading}
            value={row.lrDelarze}
            saveToDb={saveToDb}
            error={fieldErrors.lrDelarze}
          />
          <Select
            name="lrUmgebungDelarze"
            label="Umgebung nach Delarze"
            options={aeLrWerte}
            loading={loading}
            value={row.lrUmgebungDelarze}
            saveToDb={saveToDb}
            error={fieldErrors.lrUmgebungDelarze}
          />
          <TextField
            name="vegetationstyp"
            label="Vegetationstyp"
            type="text"
            value={row.vegetationstyp}
            saveToDb={saveToDb}
            error={fieldErrors.vegetationstyp}
          />
          <TextField
            name="konkurrenz"
            label="Konkurrenz"
            type="text"
            value={row.konkurrenz}
            saveToDb={saveToDb}
            error={fieldErrors.konkurrenz}
          />
          <TextField
            name="moosschicht"
            label="Moosschicht"
            type="text"
            value={row.moosschicht}
            saveToDb={saveToDb}
            error={fieldErrors.moosschicht}
          />
          <TextField
            name="krautschicht"
            label="Krautschicht"
            type="text"
            value={row.krautschicht}
            saveToDb={saveToDb}
            error={fieldErrors.krautschicht}
          />
          <TextField
            name="strauchschicht"
            label="Strauchschicht"
            type="text"
            value={row.strauchschicht}
            saveToDb={saveToDb}
            error={fieldErrors.strauchschicht}
          />
          <TextField
            name="baumschicht"
            label="Baumschicht"
            type="text"
            value={row.baumschicht}
            saveToDb={saveToDb}
            error={fieldErrors.baumschicht}
          />
          <Section>Beurteilung</Section>
          <TextField
            name="handlungsbedarf"
            label="Handlungsbedarf"
            type="text"
            multiline
            value={row.handlungsbedarf}
            saveToDb={saveToDb}
            error={fieldErrors.handlungsbedarf}
          />
          <RadioButtonGroup
            name="idealbiotopUebereinstimmung"
            label="Übereinstimmung mit Idealbiotop"
            dataSource={data?.allTpopkontrIdbiotuebereinstWertes?.nodes ?? []}
            loading={loading}
            value={row.idealbiotopUebereinstimmung}
            saveToDb={saveToDb}
            error={fieldErrors.idealbiotopUebereinstimmung}
          />
        </FormContainer>
      </SimpleBar>
    </ErrorBoundary>
  )
})
