import { useEffect } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useParams } from 'react-router'

import { query } from './query.ts'
import { createTpopkontrzaehl } from './createTpopkontrzaehl.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Form } from './Form/index.tsx'
import { Menu } from './Menu.tsx'

import type { TpopkontrId } from '../../../../models/apflora/TpopkontrId.ts'
import type { ApId } from '../../../../models/apflora/ApId.ts'
import type { TpopkontrzaehlEinheitWerteCode } from '../../../../models/apflora/TpopkontrzaehlEinheitWerteCode.ts'

interface TpopkontrQueryResult {
  data: {
    tpopkontrById: {
      id: TpopkontrId
      tpopByTpopId: {
        popByPopId: {
          apId: ApId
          apByApId: {
            ekzaehleinheitsByApId: {
              nodes: Array<{
                tpopkontrzaehlEinheitWerteByZaehleinheitId: {
                  code: TpopkontrzaehlEinheitWerteCode
                } | null
              }>
            }
          }
        }
      }
      tpopkontrzaehlsByTpopkontrId: {
        nodes: any[]
      }
    } | null
  }
}

interface ComponentProps {
  id?: TpopkontrId
}

import styles from './Tpopfreiwkontr.module.css'

import {
  addNotificationAtom,
  userNameAtom,
  isPrintAtom,
} from '../../../../store/index.ts'

export const Component = ({ id: idPassed }: ComponentProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const params = useParams()
  const { pathname } = useLocation()

  const isPrint = useAtomValue(isPrintAtom)
  const userName = useAtomValue(userNameAtom)
  const apolloClient = useApolloClient()

  const id = idPassed ?? params.tpopkontrId
  const { data, isLoading, error, refetch } = useQuery<TpopkontrQueryResult>({
    queryKey: ['TpopkontrQuery', id],
    queryFn: async () =>
      apolloClient.query({
        query,
        variables: { id },
      }),
  })
  // DO NOT use apId from url because this form is also used for mass prints
  const apId =
    data?.data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apId ??
    '99999999-9999-9999-9999-999999999999'

  const zaehls =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []

  const row = data?.data?.tpopkontrById ?? {}

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
          data?.data?.tpopkontrById?.tpopByTpopId?.popByPopId?.apByApId
            ?.ekzaehleinheitsByApId?.nodes ?? []
        )
          // remove ekzaehleinheits without zaehleinheit_id
          .filter((z) => !!z?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code)

        Promise.all(
          ekzaehleinheits.map((z) =>
            apolloClient.mutate({
              mutation: createTpopkontrzaehl,
              variables: {
                tpopkontrId: row.id,
                einheit:
                  z?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code ?? null,
                changedBy: userName,
              },
            }),
          ),
        )
          .then(() => {
            if (!isActive) return

            refetch()
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
  }, [apolloClient, data, isLoading, refetch, row.id, userName, zaehls.length])

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
          data={data?.data}
          row={row}
          apId={apId}
          refetch={refetch}
        />
      : <div className={styles.scrollContainer}>
          <Form
            data={data?.data}
            row={row}
            apId={apId}
            refetch={refetch}
          />
        </div>
      }
    </div>
  )
}
