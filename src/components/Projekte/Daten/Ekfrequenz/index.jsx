import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import TextField from '../../../shared/TextField'
import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import Kontrolljahre from './Kontrolljahre'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryEkAbrechnungstypWertes from './queryEkAbrechnungstypWertes'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import { ekfrequenz } from '../../../shared/fragments'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
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
const KontrolljahrContainer = styled.div`
  margin-bottom: 20px;
`
const LabelRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: -5px;
`
const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  user-select: none;
  padding-bottom: 6px;
`

const fieldTypes = {
  apId: 'UUID',
  ektyp: 'EkType',
  anwendungsfall: 'String',
  code: 'String',
  kontrolljahre: '[Int]',
  kontrolljahreAb: 'EkKontrolljahreAb',
  bemerkungen: 'String',
  sort: 'Int',
  ekAbrechnungstyp: 'String',
}

const ektypeWertes = [
  { value: 'EK', label: 'EK' },
  { value: 'EKF', label: 'EKF' },
]
const kontrolljahreAbWertes = [
  { value: 'EK', label: 'Kontrolle' },
  { value: 'ANSIEDLUNG', label: 'Ansiedlung' },
]

const Ekfrequenz = () => {
  const { ekfrequenzId: id } = useParams()

  const queryClient = useQueryClient()
  const client = useApolloClient()
  const store = useContext(storeContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
    },
  })

  const {
    data: dataEkAbrechnungstypWertes,
    loading: loadingEkAbrechnungstypWertes,
    error: errorEkAbrechnungstypWertes,
  } = useQuery(queryEkAbrechnungstypWertes)

  const row = useMemo(() => data?.ekfrequenzById ?? {}, [data?.ekfrequenzById])

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
            mutation updateEkfrequenz(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateEkfrequenzById(
                input: {
                  id: $id
                  ekfrequenzPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekfrequenz {
                  ...EkfrequenzFields
                }
              }
            }
            ${ekfrequenz}
          `,
          variables,
        })
      } catch (error) {
        setFieldErrors({ [field]: error.message })
        return
      }
      setFieldErrors({})
      if (field === 'code') {
        queryClient.invalidateQueries({
          queryKey: [`treeEkfrequenz`],
        })
      }
      return
    },
    [client, queryClient, row.id, store.user.name],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="EK-Frequenz" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <TextField
                name="code"
                label="Kürzel"
                type="text"
                value={row.code}
                saveToDb={saveToDb}
                error={fieldErrors.code}
              />
              <TextField
                name="anwendungsfall"
                label="Anwendungsfall"
                type="text"
                value={row.anwendungsfall}
                saveToDb={saveToDb}
                error={fieldErrors.anwendungsfall}
              />
              <RadioButtonGroup
                name="ektyp"
                dataSource={ektypeWertes}
                loading={false}
                label="EK-Typ"
                value={row.ektyp}
                saveToDb={saveToDb}
                error={fieldErrors.ektyp}
              />
              <KontrolljahrContainer>
                <LabelRow>
                  <StyledLabel>
                    Kontrolljahre (= Anzahl Jahre nach Start bzw. Ansiedlung)
                  </StyledLabel>
                </LabelRow>
                <Kontrolljahre
                  kontrolljahre={row?.kontrolljahre?.slice()}
                  saveToDb={saveToDb}
                  refetch={refetch}
                  //kontrolljahreString={JSON.stringify(row.kontrolljahre)}
                />
              </KontrolljahrContainer>
              <RadioButtonGroup
                name="kontrolljahreAb"
                dataSource={kontrolljahreAbWertes}
                loading={false}
                label="Kontrolljahre ab letzter"
                value={row.kontrolljahreAb}
                saveToDb={saveToDb}
                error={fieldErrors.kontrolljahreAb}
              />
              <div>
                {errorEkAbrechnungstypWertes ? (
                  errorEkAbrechnungstypWertes.message
                ) : (
                  <RadioButtonGroup
                    name="ekAbrechnungstyp"
                    dataSource={
                      dataEkAbrechnungstypWertes?.allEkAbrechnungstypWertes
                        ?.nodes ?? []
                    }
                    loading={loadingEkAbrechnungstypWertes}
                    label="EK-Abrechnungstyp"
                    value={row.ekAbrechnungstyp}
                    saveToDb={saveToDb}
                    error={fieldErrors.ekAbrechnungstyp}
                  />
                )}
              </div>
              <TextField
                name="bemerkungen"
                label="Bemerkungen"
                type="text"
                value={row.bemerkungen}
                saveToDb={saveToDb}
                error={fieldErrors.bemerkungen}
              />
              <TextField
                name="sort"
                label="Sortierung"
                type="number"
                value={row.sort}
                saveToDb={saveToDb}
                error={fieldErrors.sort}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ekfrequenz)
