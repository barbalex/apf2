import { apiFetch } from '../../../../../modules/api.ts'
import { apSelect } from '../../../../../modules/selects.ts'
import type { SaveToDbEvent } from '../../../../shared/types.ts'
import { useState, type ReactNode } from 'react'
import { useParams } from 'react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroupWithInfo } from '../../../../shared/RadioButtonGroupWithInfo.tsx'
import { TextField } from '../../../../shared/TextField.tsx'
import { Select } from '../../../../shared/Select.tsx'
import { SelectLoadingOptions } from '../../../../shared/SelectLoadingOptions.tsx'
import { queryAeTaxonomies } from '../queryAeTaxonomies.ts'
import { ifIsNumericAsNumber } from '../../../../../modules/ifIsNumericAsNumber.ts'
import { userNameAtom } from '../../../../../store/index.ts'

import type { ApId } from '../../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../../models/apflora/AeTaxonomies.ts'
import type { AdresseId } from '../../../../../models/apflora/Adresse.ts'
import type { ProjektId } from '../../../../../models/apflora/Projekt.ts'

import styles from './Ap.module.css'
import { apiUpdateByVariables } from '../../../../../modules/api.ts'

export interface ApQueryResult {
  apById: {
    id: ApId
    label: string | null
    artId: AeTaxonomiesId | null
    bearbeitung: number | null
    startJahr: number | null
    umsetzung: number | null
    bearbeiter: AdresseId | null
    ekfBeobachtungszeitpunkt: string | null
    projId: ProjektId | null
    changedBy: string | null
    aeTaxonomyByArtId: {
      id: AeTaxonomiesId
      taxArtName: string | null
      artwert: number | null
    } | null
  }
  allAdresses: {
    nodes: {
      value: AdresseId
      label: string | null
    }[]
  }
  allApBearbstandWertes: {
    nodes: {
      value: number
      label: string | null
    }[]
  }
  allApUmsetzungWertes: {
    nodes: {
      value: number
      label: string | null
    }[]
  }
}

interface Props {
  children?: ReactNode
}

export const apQueryOptions = (apId: string | undefined) => ({
  queryKey: ['ap', apId],
  queryFn: async () => {
    const [rows, adresses, bearbstandWerte, umsetzungWerte] = await Promise.all(
      [
        apiFetch<NonNullable<ApQueryResult['apById']>[]>(
          `/v_ap?id=eq.${apId}&select=${apSelect},aeTaxonomyByArtId:ae_taxonomy_by_art_id`,
        ),
        apiFetch<NonNullable<ApQueryResult['allAdresses']>['nodes']>(
          `/adresse?order=name.asc&select=value:id,label:name`,
        ),
        apiFetch<NonNullable<ApQueryResult['allApBearbstandWertes']>['nodes']>(
          `/ap_bearbstand_werte?order=sort.asc&select=value:code,label:text`,
        ),
        apiFetch<NonNullable<ApQueryResult['allApUmsetzungWertes']>['nodes']>(
          `/ap_umsetzung_werte?order=sort.asc&select=value:code,label:text`,
        ),
      ],
    )
    return {
      apById: rows?.[0] ?? null,
      allAdresses: { nodes: adresses ?? [] },
      allApBearbstandWertes: { nodes: bearbstandWerte ?? [] },
      allApUmsetzungWertes: { nodes: umsetzungWerte ?? [] },
    }
  },
})

export const Ap = ({ children }: Props) => {
  const { apId } = useParams<{ apId: string }>()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, refetch } = useSuspenseQuery(apQueryOptions(apId))

  const row = (data.apById ?? {}) as NonNullable<ApQueryResult['apById']>

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apiUpdateByVariables('ap', variables)
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    void refetch()
    if (field === 'artId') {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
    }
  }

  const aeTaxonomiesfilterForData = (inputValue: string) =>
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
    <>
      <SelectLoadingOptions
        key={`${apId}artId`}
        field="artId"
        valueLabelPath="aeTaxonomyByArtId.taxArtName"
        valueLabel={undefined}
        label="Art (das namensgebende Taxon)"
        labelSize={undefined}
        row={row}
        query={queryAeTaxonomies}
        filter={aeTaxonomiesfilterForData}
        queryNodesName="allAeTaxonomies"
        saveToDb={saveToDb}
        error={fieldErrors.artId}
      />
      <RadioButtonGroupWithInfo
        name="bearbeitung"
        dataSource={data.allApBearbstandWertes?.nodes ?? []}
        popover={
          <div className={styles.popover}>
            <div
              className={styles.title}
              data-id="info-icon-popover"
            >
              Legende
            </div>
            <div className={styles.row}>
              <div className={styles.columnLeft}>keiner:</div>
              <div>kein Aktionsplan vorgesehen</div>
            </div>
            <div className={styles.row}>
              <div className={styles.columnLeft}>erstellt:</div>
              <div>Aktionsplan fertig, auf der Webseite der FNS</div>
            </div>
          </div>
        }
        label="Aktionsplan"
        value={row.bearbeitung as unknown as string}
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
        key={`${apId}umsetzung`}
        name="umsetzung"
        dataSource={data.allApUmsetzungWertes?.nodes ?? []}
        popover={
          <div className={styles.popover}>
            <div
              className={styles.title}
              data-id="info-icon-popover"
            >
              Legende
            </div>
            <div className={styles.row}>
              <div className={styles.columnLeft}>
                noch keine
                <br />
                Umsetzung:
              </div>
              <div>noch keine Massnahmen ausgeführt</div>
            </div>
            <div className={styles.row}>
              <div className={styles.columnLeft}>in Umsetzung:</div>
              <div>
                bereits Massnahmen ausgeführt (auch wenn AP noch nicht erstellt)
              </div>
            </div>
          </div>
        }
        label="Stand Umsetzung"
        value={row.umsetzung as unknown as string}
        saveToDb={saveToDb}
        error={fieldErrors.umsetzung}
      />
      <Select
        key={`${apId}bearbeiter`}
        name="bearbeiter"
        label="Verantwortlich"
        options={data.allAdresses?.nodes ?? []}
        loading={false}
        value={row.bearbeiter}
        saveToDb={(event) => void saveToDb(event)}
        error={fieldErrors.bearbeiter ?? ''}
      />
      {children}
      <TextField
        name="ekfBeobachtungszeitpunkt"
        label="Bester Beobachtungszeitpunkt für EKF (Freiwilligen-Kontrollen)"
        type="text"
        value={row.ekfBeobachtungszeitpunkt}
        saveToDb={saveToDb}
        error={fieldErrors.ekfBeobachtungszeitpunkt}
      />
    </>
  )
}
