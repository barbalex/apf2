import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'

import { RadioButtonGroupWithInfo } from '../../../shared/RadioButtonGroupWithInfo.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { Select } from '../../../shared/Select.jsx'
import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.jsx'
import { TextFieldNonUpdatable } from '../../../shared/TextFieldNonUpdatable.jsx'
import { queryAeTaxonomies } from './queryAeTaxonomies.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ApUsers } from './ApUsers/index.jsx'
import { ap, aeTaxonomies } from '../../../shared/fragments.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { query } from './query.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { Menu } from './Menu.jsx'

import { formContainer, popover, title, row, columnLeft } from './Ap.module.css'

const fieldTypes = {
  bearbeitung: 'Int',
  startJahr: 'Int',
  umsetzung: 'Int',
  artId: 'UUID',
  bearbeiter: 'UUID',
  ekfBeobachtungszeitpunkt: 'String',
  projId: 'UUID',
}

export const Component = observer(() => {
  const { apId } = useParams()

  const store = useContext(MobxContext)
  const { user } = store

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, error, loading } = useQuery(query, {
    variables: { id: apId },
  })

  const row = data?.apById ?? {}

  const saveToDb = async (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: user.name,
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
            mutation updateAp(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateApById(
                input: {
                  id: $id
                  apPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ap {
                  ...ApFields
                  aeTaxonomyByArtId {
                    ...AeTaxonomiesFields
                  }
                }
              }
            }
            ${ap}
            ${aeTaxonomies}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors({ [field]: error.message })
    }
    setFieldErrors({})
    if (field === 'artId') {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
    }
  }

  const aeTaxonomiesfilterForData = (inputValue) =>
    inputValue ?
      {
        or: [
          { apByArtIdExists: false },
          { apByArtId: { id: { equalTo: apId } } },
        ],
        taxArtName: { includesInsensitive: inputValue },
      }
    : {
        or: [
          { apByArtIdExists: false },
          { apByArtId: { id: { equalTo: apId } } },
        ],
      }

  return (
    <ErrorBoundary>
      <FormTitle
        title="Art"
        MenuBarComponent={Menu}
      />
      <div className={formContainer}>
        <SelectLoadingOptions
          key={`${row?.id}artId`}
          field="artId"
          valueLabelPath="aeTaxonomyByArtId.taxArtName"
          label="Art (das namensgebende Taxon)"
          row={row}
          query={queryAeTaxonomies}
          filter={aeTaxonomiesfilterForData}
          queryNodesName="allAeTaxonomies"
          saveToDb={saveToDb}
          error={fieldErrors.artId}
        />
        <RadioButtonGroupWithInfo
          name="bearbeitung"
          dataSource={data?.allApBearbstandWertes?.nodes ?? []}
          loading={false}
          popover={
            <div className={popover}>
              <div
                className={title}
                data-id="info-icon-popover"
              >
                Legende
              </div>
              <div className={row}>
                <div className={columnLeft}>keiner:</div>
                <div>kein Aktionsplan vorgesehen</div>
              </div>
              <div className={row}>
                <div className={columnLeft}>erstellt:</div>
                <div>Aktionsplan fertig, auf der Webseite der FNS</div>
              </div>
            </div>
          }
          label="Aktionsplan"
          value={row.bearbeitung}
          saveToDb={saveToDb}
          error={fieldErrors.bearbeitung}
        />
        <TextField
          name="startJahr"
          label="Start im Jahr"
          type="number"
          value={row.startJahr}
          saveToDb={saveToDb}
          error={fieldErrors.startJahr}
        />
        <RadioButtonGroupWithInfo
          key={`${row?.id}umsetzung`}
          name="umsetzung"
          dataSource={data?.allApUmsetzungWertes?.nodes ?? []}
          loading={false}
          popover={
            <div className={popover}>
              <div
                className={title}
                data-id="info-icon-popover"
              >
                Legende
              </div>
              <div className={row}>
                <div className={columnLeft}>
                  noch keine
                  <br />
                  Umsetzung:
                </div>
                <div>noch keine Massnahmen ausgeführt</div>
              </div>
              <div className={row}>
                <div className={columnLeft}>in Umsetzung:</div>
                <div>
                  bereits Massnahmen ausgeführt (auch wenn AP noch nicht
                  erstellt)
                </div>
              </div>
            </div>
          }
          label="Stand Umsetzung"
          value={row.umsetzung}
          saveToDb={saveToDb}
          error={fieldErrors.umsetzung}
        />
        <Select
          key={`${row?.id}bearbeiter`}
          name="bearbeiter"
          label="Verantwortlich"
          options={data?.allAdresses?.nodes ?? []}
          loading={false}
          value={row.bearbeiter}
          saveToDb={saveToDb}
          error={fieldErrors.bearbeiter}
        />
        <ApUsers />
        <TextField
          name="ekfBeobachtungszeitpunkt"
          label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
          type="text"
          value={row.ekfBeobachtungszeitpunkt}
          saveToDb={saveToDb}
          error={fieldErrors.ekfBeobachtungszeitpunkt}
        />
        <TextFieldNonUpdatable
          key={`${row.id}artwert`}
          label="Artwert"
          value={
            row?.aeTaxonomyByArtId?.artwert ?? 'Diese Art hat keinen Artwert'
          }
        />
      </div>
    </ErrorBoundary>
  )
})
