import { useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { Select } from '../../../shared/Select.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { tpopfeldkontr } from '../../../shared/fragments.ts'
import { fieldTypes } from './Form.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type {
  TpopkontrId,
  TpopId,
  TpopkontrIdbiotuebereinstWerteCode,
} from '../../../../generated/apflora/models.ts'

import styles from './Form.module.css'

interface BiotopQueryResult {
  tpopkontrById?: {
    id: TpopkontrId
    tpopId: TpopId
    flaeche?: number | null
    lrDelarze?: string | null
    lrUmgebungDelarze?: string | null
    vegetationstyp?: string | null
    konkurrenz?: string | null
    moosschicht?: string | null
    krautschicht?: string | null
    strauchschicht?: string | null
    baumschicht?: string | null
    idealbiotopUebereinstimmung?: TpopkontrIdbiotuebereinstWerteCode | null
    handlungsbedarf?: string | null
  } | null
  allTpopkontrIdbiotuebereinstWertes?: {
    nodes: {
      value: TpopkontrIdbiotuebereinstWerteCode
      label?: string | null
    }[]
  } | null
  allAeLrDelarzes?: {
    nodes: {
      id: string
      label?: string | null
      einheit?: string | null
    }[]
  } | null
}

export const Component = () => {
  const { tpopkontrId } = useParams()

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery<BiotopQueryResult>({
    queryKey: ['tpopfeldkontrBiotop', tpopkontrId],
    queryFn: async () => {
      const result = await apolloClient.query<BiotopQueryResult>({
        query,
        variables: { id: tpopkontrId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const row = data?.tpopkontrById ?? {}

  const saveToDb = async (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    if (field === 'jahr') {
      variables.datum = null
    }
    if (field === 'datum') {
      // value can be null so check if substring method exists
      const newJahr = value && value.substring ? +value.substring(0, 4) : value
      variables.jahr = newJahr
    }
    try {
      await apolloClient.mutate({
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
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpopfeldkontr query
    tsQueryClient.invalidateQueries({
      queryKey: ['tpopfeldkontrBiotop', tpopkontrId],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (['jahr', 'datum', 'typ'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontr`],
      })
    }
  }

  const aeLrWerte = (data?.allAeLrDelarzes?.nodes ?? [])
    .map(
      (e) => `${e.label}: ${e.einheit ? e.einheit.replace(/  +/g, ' ') : ''}`,
    )
    .map((o) => ({ value: o, label: o }))

  return (
    <ErrorBoundary>
      <FormTitle title="Biotop" />
      <div className={styles.formContainer}>
        <TextField
          name="flaeche"
          label="Fläche"
          type="number"
          value={row.flaeche}
          saveToDb={saveToDb}
          error={fieldErrors.flaeche}
        />
        <div className={styles.section}>Vegetation</div>
        <Select
          key={`${tpopkontrId}lrDelarze`}
          data-id="lrDelarze"
          name="lrDelarze"
          label="Lebensraum nach Delarze"
          options={aeLrWerte}
          value={row.lrDelarze}
          saveToDb={saveToDb}
          error={fieldErrors.lrDelarze}
        />
        <Select
          key={`${tpopkontrId}lrUmgebungDelarze`}
          name="lrUmgebungDelarze"
          label="Umgebung nach Delarze"
          options={aeLrWerte}
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
        <div className={styles.section}>Beurteilung</div>
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
          value={row.idealbiotopUebereinstimmung}
          saveToDb={saveToDb}
          error={fieldErrors.idealbiotopUebereinstimmung}
        />
      </div>
    </ErrorBoundary>
  )
}
