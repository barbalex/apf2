import { apiFetch } from '../../../../modules/api.ts'
import { tpopfreiwkontrSelect } from '../../../../modules/selects.ts'
import type { TpopkontrRow } from './Form/index.tsx'
import { apiInsert } from '../../../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import { useEffect } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useParams } from 'react-router'

import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Form } from './Form/index.tsx'
import { Menu } from './Menu.tsx'

interface ComponentProps {
  id?: string | undefined
}

import styles from './Tpopfreiwkontr.module.css'

import {
  addNotificationAtom,
  userNameAtom,
  isPrintAtom,
} from '../../../../store/index.ts'

export const tpopfreiwkontrQueryOptions = (id: string | undefined) => ({
  queryKey: ['TpopkontrQuery', id],
  queryFn: async () => {
    const rows = await apiFetch<TpopkontrRow[]>(
      `/v_tpopkontr?id=eq.${id}&select=${tpopfreiwkontrSelect},tpopByTpopId:tpop_by_tpop_id,adresseByBearbeiter:adresse_by_bearbeiter,tpopkontrzaehlsByTpopkontrId:tpopkontrzaehls_by_tpopkontr_id`,
    )
    return { tpopkontrById: rows?.[0] ?? null }
  },
})

export const Component = ({ id: idPassed }: ComponentProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const params = useParams()
  const { pathname } = useLocation()

  const isPrint = useAtomValue(isPrintAtom)
  const userName = useAtomValue(userNameAtom)

  const id = idPassed ?? params.tpopkontrId
  const { data, isLoading, error, refetch } = useQuery(
    tpopfreiwkontrQueryOptions(id),
  )
  // DO NOT use apId from url because this form is also used for mass prints
  const apId =
    data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apId ??
    '99999999-9999-9999-9999-999999999999'

  const zaehls = data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []

  const row: Partial<TpopkontrRow> = data?.tpopkontrById ?? {}

  useEffect(() => {
    let isActive = true
    if (!isLoading) {
      // loading data just finished
      // check if tpopkontr exist
      const tpopkontrCount = zaehls.length
      if (tpopkontrCount === 0) {
        // add counts for all ekzaehleinheit
        // BUT DANGER: only for ekzaehleinheit with zaehleinheit_id
        const ekzaehleinheits = (
          data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apByApId
            ?.ekzaehleinheitsByApId?.nodes ?? []
        )
          // remove ekzaehleinheits without zaehleinheit_id
          .filter((z) => !!z?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code)

        apiInsert(
          'tpopkontrzaehl',
          ekzaehleinheits.map((z) => ({
            id: uuidv7(),
            tpopkontr_id: row.id,
            einheit:
              z?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code ?? null,
            changed_by: userName,
          })),
        )
          .then(() => {
            if (!isActive) return

            void refetch()
          })
          .catch((error) => {
            if (!isActive) return

            addNotification({
              message: (error as Error).message,
              options: {
                variant: 'error',
              },
            })
          })
      }
    }
    return () => {
      isActive = false
    }
  }, [
    addNotification,
    data,
    isLoading,
    refetch,
    row.id,
    userName,
    zaehls.length,
  ])

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  if (Object.keys(row).length === 0) return null

  // console.log('Tpopfreiwkontr, isPrint:', isPrint)

  return (
    <div className={styles.container}>
      {!pathname.includes('EKF') && (
        <>
          <FormTitle
            title="Freiwilligen-Kontrolle"
            MenuBarComponent={Menu}
            menuBarProps={{ row }}
          />
        </>
      )}
      {isPrint ?
        <Form
          data={data}
          row={row}
          apId={apId}
          refetch={() => void refetch()}
        />
      : <div className={styles.scrollContainer}>
          <Form
            data={data}
            row={row}
            apId={apId}
            refetch={() => void refetch()}
          />
        </div>
      }
    </div>
  )
}
