import type { SaveToDbEvent } from '../../../../../shared/types.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router'

import { Select } from '../../../../../shared/Select.tsx'

import { apiFetch } from '../../../../../../modules/api.ts'
import styles from './index.module.css'

const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfRefYear = new Date(ekfRefDate).getFullYear()

export const EkfUser = ({ closeMenu }: { closeMenu: () => void }) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const { data } = useSuspenseQuery({
    queryKey: ['ekfUsers'],
    queryFn: async () => {
      const nodes =
        (await apiFetch<{ value: string; label: string | null }[]>(
          `/user?role=eq.apflora_freiwillig&select=value:id,label:name&order=name.asc`,
        )) ?? []
      return { allUsers: { nodes } }
    },
  })

  const choose = (event: SaveToDbEvent) => {
    const value = event.target.value
    closeMenu()
    // prevent this happening before setAnchor happened
    setTimeout(
      () =>
        void navigate(`/Daten/Benutzer/${value}/EKF/${ekfRefYear}${search}`),
    )
  }

  return (
    <div className={styles.container}>
      <Select
        value={''}
        label="EKF sehen als"
        options={(data.allUsers?.nodes ?? []).filter((n) => !!n)}
        loading={false}
        saveToDb={choose}
        maxHeight={120}
      />
    </div>
  )
}
