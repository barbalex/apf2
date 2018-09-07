// @flow
import React from 'react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import Select from '../../../shared/Select'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateApartByIdGql from './updateApartById.graphql'

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
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({
      row,
      field,
      value,
      updateApart,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateApart({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
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
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['artId'].includes(field)) refetchTree()
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  }),
)

const ApArt = ({
  id,
  saveToDb,
  errors,
  treeName,
}: {
  id: String,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'apartById')
      // do not show any artId's that have been used?
      // Nope: because some species have already been worked as separate ap
      // because apart did not exist...
      // maybe do later
      let artWerte = get(data, 'allAeEigenschaftens.nodes', [])
      artWerte = sortBy(artWerte, 'artname')
      artWerte = artWerte.map(el => ({
        value: el.id,
        label: el.artname,
      }))
      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={row.apId}
              title="Aktionsplan-Art"
              activeNodeArray={activeNodeArray}
              treeName={treeName}
              table="apart"
            />
            <Mutation mutation={updateApartByIdGql}>
              {(updateApart, { data }) => (
                <FieldsContainer>
                  <div>
                    "Aktionsplan-Arten" sind alle Arten, welche der Aktionsplan
                    behandelt. Häufig dürfte das bloss eine einzige Art sein.
                    Folgende Gründe können dazu führen, dass hier mehrere
                    aufgelistet werden:
                    <ul>
                      <li>Die AP-Art hat Synonyme</li>
                      <li>
                        Beobachtungen liegen in unterschiedlichen Taxonomien
                        vor, z.B. SISF 2 und SISF 3 bzw. Checklist 2017
                      </li>
                      <li>
                        Wenn eine Art im Rahmen des Aktionsplans inklusive nicht
                        synonymer aber eng verwandter Arten gefasst wid (z.B.
                        Unterarten)
                      </li>
                    </ul>
                  </div>
                  <div>
                    Beobachtungen aller AP-Arten stehen im Ordner "Beobachtungen
                    nicht beurteilt" zur Verfügung und können Teilpopulationen
                    zugeordnet werden.
                    <br />
                    <br />
                  </div>
                  <div>
                    Die im Aktionsplan gewählte namensgebende Art gibt dem
                    Aktionsplan nicht nur den Namen. Unter ihrer id werden auch
                    die Kontrollen an InfoFlora geliefert.
                    <br />
                    <br />
                  </div>
                  <Select
                    key={`${row.id}artId`}
                    value={row.artId}
                    field="artId"
                    label="Art"
                    options={artWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'artId',
                        value,
                        updateApart,
                      })
                    }
                    error={errors.artId}
                  />
                </FieldsContainer>
              )}
            </Mutation>
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(ApArt)
