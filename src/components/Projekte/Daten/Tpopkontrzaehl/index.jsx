import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import Select from '../../../shared/Select'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { tpopkontrzaehl } from '../../../shared/fragments'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const FormContainer = styled.div`
  padding: 10px;
`

const fieldTypes = {
  anzahl: 'Float',
  einheit: 'Int',
  methode: 'Int',
}

const Tpopkontrzaehl = () => {
  const { tpopkontrzaehlId, tpopkontrId } = useParams()

  const client = useApolloClient()
  const store = useContext(storeContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: tpopkontrzaehlId,
      tpopkontrId,
    },
  })

  const zaehlEinheitCodesAlreadyUsed = (data?.otherZaehlOfEk?.nodes ?? [])
    .map((n) => n.einheit)
    // prevent null values which cause error in query
    .filter((e) => !!e)

  // filter out already used in other zaehlung of same kontr
  const zaehlEinheitOptions = (
    data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
  ).filter((o) => !zaehlEinheitCodesAlreadyUsed.includes(o.value))

  const row = useMemo(
    () => data?.tpopkontrzaehlById ?? {},
    [data?.tpopkontrzaehlById],
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
            mutation updateAnzahlForEkZaehl(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopkontrzaehlById(
                input: {
                  id: $id
                  tpopkontrzaehlPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopkontrzaehl {
                  ...TpopkontrzaehlFields
                }
              }
            }
            ${tpopkontrzaehl}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      store.tree.incrementRefetcher()
    },
    [client, row.id, store.tree, store.user.name],
  )

  // console.log('Tpopkontrzaehl rendering')

  if (loading) return <Spinner />

  if (error) return <Error errors={[error]} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Zählung" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <Select
                name="einheit"
                label="Einheit"
                options={zaehlEinheitOptions}
                loading={loading}
                value={row.einheit}
                saveToDb={saveToDb}
                error={fieldErrors.einheit}
              />
              <TextField
                name="anzahl"
                label="Anzahl"
                type="number"
                value={row.anzahl}
                saveToDb={saveToDb}
                error={fieldErrors.anzahl}
              />
              <RadioButtonGroup
                name="methode"
                label="Methode"
                dataSource={data?.allTpopkontrzaehlMethodeWertes?.nodes ?? []}
                value={row.methode}
                saveToDb={saveToDb}
                error={fieldErrors.methode}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopkontrzaehl)
