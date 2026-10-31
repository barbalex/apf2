import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import { useSuspenseQuery } from '@tanstack/react-query'
import { apiFetch } from '../../../../modules/api.ts'

import { Option } from './Option.tsx'

import styles from './Options.module.css'

interface PopStatusWerteNode {
  id: number
  code: number | null
  text: string | null
}

interface PopStatusWerteQueryResult {
  allPopStatusWertes: {
    nodes: PopStatusWerteNode[]
  } | null
}

export const Options = ({ type }: { type: string }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['PopStatusWertes'],
    queryFn: async () => {
      const nodes =
        (await apiFetch<{ id: number; code: number; text: string | null }[]>(
          `/pop_status_werte?select=id,code,text&order=code.asc`,
        )) ?? []
      return {
        allPopStatusWertes: { nodes },
      } as unknown as PopStatusWerteQueryResult
    },
  })
  const options =
    (data as PopStatusWerteQueryResult).allPopStatusWertes?.nodes ?? []

  return (
    <FormGroup className={styles.formGroup}>
      <FormLabel>Gewünschte Stati wählen:</FormLabel>
      {options.map((option: PopStatusWerteNode) => (
        <Option
          key={option.id}
          option={option}
          type={type}
        />
      ))}
    </FormGroup>
  )
}
