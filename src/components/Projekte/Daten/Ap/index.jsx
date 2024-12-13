import { memo, useContext, useCallback, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useApolloClient, useQuery, gql } from '@apollo/client'

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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
`
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: rgb(46, 125, 50);
  color: white;
`
const LabelPopoverContentRow = styled(LabelPopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-top-style: none;
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const LabelPopoverRowColumnLeft = styled.div`
  width: 110px;
`
const LabelPopoverRowColumnRight = styled.div`
  padding-left: 5px;
`

const fieldTypes = {
  bearbeitung: 'Int',
  startJahr: 'Int',
  umsetzung: 'Int',
  artId: 'UUID',
  bearbeiter: 'UUID',
  ekfBeobachtungszeitpunkt: 'String',
  projId: 'UUID',
}

export const Component = memo(
  observer(() => {
    const { apId } = useParams()

    const client = useApolloClient()
    const store = useContext(MobxContext)
    const { user } = store
    const queryClient = useQueryClient()

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, error, loading } = useQuery(query, {
      variables: { id: apId },
    })

    const row = useMemo(() => data?.apById ?? {}, [data?.apById])

    const saveToDb = useCallback(
      async (event) => {
        const field = event.target.name
        const value = ifIsNumericAsNumber(event.target.value)

        const variables = {
          id: row.id,
          [field]: value,
          changedBy: user.name,
        }
        try {
          await client.mutate({
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
          queryClient.invalidateQueries({
            queryKey: [`treeAp`],
          })
        }
      },
      [client, queryClient, row.id, user.name],
    )

    const aeTaxonomiesfilterForData = useCallback(
      (inputValue) =>
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
          },
      [apId],
    )

    return (
      <ErrorBoundary>
        <FormTitle
          title="Art"
          menuBar={<Menu />}
        />
        <FormContainer>
          <SelectLoadingOptions
            field="artId"
            valueLabelPath="aeTaxonomyByArtId.taxArtName"
            label="Art (das namensgebende Taxon)"
            row={row}
            query={queryAeTaxonomies}
            filter={aeTaxonomiesfilterForData}
            queryNodesName="allAeTaxonomies"
            //value={row.artId}
            saveToDb={saveToDb}
            error={fieldErrors.artId}
          />
          <RadioButtonGroupWithInfo
            name="bearbeitung"
            dataSource={data?.allApBearbstandWertes?.nodes ?? []}
            loading={false}
            popover={
              <>
                <LabelPopoverTitleRow data-id="info-icon-popover">
                  Legende
                </LabelPopoverTitleRow>
                <LabelPopoverContentRow>
                  <LabelPopoverRowColumnLeft>keiner:</LabelPopoverRowColumnLeft>
                  <LabelPopoverRowColumnRight>
                    kein Aktionsplan vorgesehen
                  </LabelPopoverRowColumnRight>
                </LabelPopoverContentRow>
                <LabelPopoverContentRow>
                  <LabelPopoverRowColumnLeft>
                    erstellt:
                  </LabelPopoverRowColumnLeft>
                  <LabelPopoverRowColumnRight>
                    Aktionsplan fertig, auf der Webseite der FNS
                  </LabelPopoverRowColumnRight>
                </LabelPopoverContentRow>
              </>
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
          <FieldContainer>
            <RadioButtonGroupWithInfo
              name="umsetzung"
              dataSource={data?.allApUmsetzungWertes?.nodes ?? []}
              loading={false}
              popover={
                <>
                  <LabelPopoverTitleRow data-id="info-icon-popover">
                    Legende
                  </LabelPopoverTitleRow>
                  <LabelPopoverContentRow>
                    <LabelPopoverRowColumnLeft>
                      noch keine
                      <br />
                      Umsetzung:
                    </LabelPopoverRowColumnLeft>
                    <LabelPopoverRowColumnRight>
                      noch keine Massnahmen ausgeführt
                    </LabelPopoverRowColumnRight>
                  </LabelPopoverContentRow>
                  <LabelPopoverContentRow>
                    <LabelPopoverRowColumnLeft>
                      in Umsetzung:
                    </LabelPopoverRowColumnLeft>
                    <LabelPopoverRowColumnRight>
                      bereits Massnahmen ausgeführt (auch wenn AP noch nicht
                      erstellt)
                    </LabelPopoverRowColumnRight>
                  </LabelPopoverContentRow>
                </>
              }
              label="Stand Umsetzung"
              value={row.umsetzung}
              saveToDb={saveToDb}
              error={fieldErrors.umsetzung}
            />
          </FieldContainer>
          <Select
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
        </FormContainer>
      </ErrorBoundary>
    )
  }),
)
