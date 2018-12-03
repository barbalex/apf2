// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import Select from '../../../shared/Select'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateApartByIdGql from './updateApartById'
import withAeEigenschaftens from './withAeEigenschaftens'
import withData from './withData'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const enhance = compose(
  withProps(() => ({
    mobxStore: useContext(mobxStoreContext),
  })),
  withData,
  withAeEigenschaftens,
  observer,
)

const ApArt = ({
  treeName,
  dataAeEigenschaftens,
  data,
  refetchTree,
}: {
  treeName: string,
  dataAeEigenschaftens: Object,
  data: Object,

  refetchTree: () => void,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const client = useApolloClient()
  const [errors, setErrors] = useState({})

  const row = get(data, 'apartById', {})
  // do not show any artId's that have been used?
  // Nope: because some species have already been worked as separate ap
  // because apart did not exist...
  // maybe do later
  let artWerte = get(dataAeEigenschaftens, 'allAeEigenschaftens.nodes', [])
  artWerte = sortBy(artWerte, 'artname')
  artWerte = artWerte.map(el => ({
    value: el.id,
    label: el.artname,
  }))

  useEffect(() => setErrors({}), [row.id])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = event.target.value || null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
          mutation: updateApartByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          /*optimisticResponse: {
          __typename: 'Mutation',
          updateApartById: {
            apart: {
              id: row.id,
              apId: field === 'apId' ? value : row.apId,
              artId: field === 'artId' ? value : row.artId,
              aeEigenschaftenByArtId: row.aeEigenschaftenByArtId,
              __typename: 'Apart',
            },
            __typename: 'Apart',
          },
        },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['artId'].includes(field)) refetchTree('aparts')
    },
    [row.id],
  )

  if (data.loading || dataAeEigenschaftens.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) return `Fehler: ${data.error.message}`

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Aktionsplan-Art"
          treeName={treeName}
          table="apart"
        />
        <FieldsContainer>
          <div>
            "Aktionsplan-Arten" sind alle Arten, welche der Aktionsplan
            behandelt. Häufig dürfte das bloss eine einzige Art sein. Folgende
            Gründe können dazu führen, dass hier mehrere aufgelistet werden:
            <ul>
              <li>Die AP-Art hat Synonyme</li>
              <li>
                Beobachtungen liegen in unterschiedlichen Taxonomien vor, z.B.
                SISF 2 und SISF 3 bzw. Checklist 2017
              </li>
              <li>
                Wenn eine Art im Rahmen des Aktionsplans inklusive nicht
                synonymer aber eng verwandter Arten gefasst wid (z.B.
                Unterarten)
              </li>
            </ul>
          </div>
          <div>
            Beobachtungen aller AP-Arten stehen im Ordner "Beobachtungen nicht
            beurteilt" zur Verfügung und können Teilpopulationen zugeordnet
            werden.
            <br />
            <br />
          </div>
          <div>
            Die im Aktionsplan gewählte namensgebende Art gibt dem Aktionsplan
            nicht nur den Namen. Unter ihrer id werden auch die Kontrollen an
            InfoFlora geliefert.
            <br />
            <br />
          </div>
          <Select
            key={`${row.id}artId`}
            name="artId"
            value={row.artId}
            field="artId"
            label="Art"
            options={artWerte}
            saveToDb={saveToDb}
            error={errors.artId}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(ApArt)
