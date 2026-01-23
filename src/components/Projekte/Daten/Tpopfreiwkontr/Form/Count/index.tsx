import { sortBy, uniqBy } from 'es-toolkit'
import Button from '@mui/material/Button'
import { MdAddCircleOutline, MdDeleteForever } from 'react-icons/md'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom, useAtomValue } from 'jotai'

import { Einheit } from './Einheit.tsx'
import { Gezaehlt } from './Gezaehlt.tsx'
import { Geschaetzt } from './Geschaetzt.tsx'
import { query } from './query.ts'
import { createTpopkontrzaehl } from './createTpopkontrzaehl.ts'
import {
  setToDeleteAtom,
  treeActiveNodeArrayAtom,
} from '../../../../../../store/index.ts'

import type { TpopkontrzaehlId } from '../../../../../../models/apflora/TpopkontrzaehlId.ts'
import type { TpopkontrId } from '../../../../../../models/apflora/TpopkontrId.ts'
import type { TpopkontrzaehlEinheitWerteCode } from '../../../../../../models/apflora/TpopkontrzaehlEinheitWerteCode.ts'

interface TpopkontrzaehlQueryResult {
  tpopkontrzaehlById: {
    id: TpopkontrzaehlId
    einheit: TpopkontrzaehlEinheitWerteCode
    anzahl: number | null
    methode: number | null
  } | null
  allTpopkontrzaehlEinheitWertes: {
    nodes: Array<{
      code: TpopkontrzaehlEinheitWerteCode
      id: string
      text: string
    }>
  }
}

interface CountProps {
  id?: TpopkontrzaehlId
  tpopkontrId: TpopkontrId
  nr: number
  showEmpty?: boolean
  showNew?: boolean
  refetch: () => void
  einheitsUsed?: TpopkontrzaehlEinheitWerteCode[]
  ekzaehleinheits?: Array<{
    code: TpopkontrzaehlEinheitWerteCode
    text: string
  }>
  ekzaehleinheitsOriginal?: Array<{
    tpopkontrzaehlEinheitWerteByZaehleinheitId: {
      code: TpopkontrzaehlEinheitWerteCode
    }
    sort: number | null
  }>
}

import styles from './index.module.css'

const getZaehleinheitWerte = ({
  data,
  einheitsUsed,
  ekzaehleinheits,
  ekzaehleinheitsOriginal,
  row,
}) => {
  const allEinheits = data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
  // do list this count's einheit
  const einheitsNotToList = einheitsUsed.filter((e) => e !== row.einheit)
  let zaehleinheitWerte = ekzaehleinheits
    // remove already set values
    .filter((e) => !einheitsNotToList.includes(e.code))
  // add this zaehleineits value if missing
  // so as to show values input in earlier years that shall not be input any more
  const thisRowsEinheit = allEinheits.find((e) => e.code === row.einheit)
  if (thisRowsEinheit) {
    zaehleinheitWerte = uniqBy(
      [thisRowsEinheit, ...zaehleinheitWerte],
      (e) => e.id,
    )
  }
  return sortBy(zaehleinheitWerte, [
    (z) => {
      const ekzaehleinheitOriginal = ekzaehleinheitsOriginal.find(
        (e) => e.tpopkontrzaehlEinheitWerteByZaehleinheitId.code === z.code,
      )
      if (!ekzaehleinheitOriginal) return 999
      return ekzaehleinheitOriginal.sort || 999
    },
  ]).map((el) => ({
    value: el.code,
    label: el.text,
  }))
}

export const Count = ({
    id,
    tpopkontrId,
    nr,
    showEmpty,
    showNew,
    refetch,
    einheitsUsed = [],
    ekzaehleinheits = [],
    ekzaehleinheitsOriginal = [],
  }: CountProps) => {
    const setToDelete = useSetAtom(setToDeleteAtom)
    const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)

    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const { data, refetch: refetchMe } = useQuery<TpopkontrzaehlQueryResult>({
      queryKey: ['tpopkontrzaehl', id],
      queryFn: async () => {
        const result = await apolloClient.query<TpopkontrzaehlQueryResult>({
          query,
          variables: {
            id: id || '99999999-9999-9999-9999-999999999999',
          },
        })
        if (result.error) throw result.error
        return result.data
      },
      suspense: true,
    })

    const row = data?.tpopkontrzaehlById ?? {}

    const createNew = () =>
      apolloClient
        .mutate({
          mutation: createTpopkontrzaehl,
          variables: { tpopkontrId },
        })
        .then(() => {
          refetch()
          tsQueryClient.invalidateQueries({
            queryKey: [`treeTpopfreiwkontrzaehl`],
          })
          tsQueryClient.invalidateQueries({
            queryKey: [`treeTpopfreiwkontrzaehlFolders`],
          })
        })

    const zaehleinheitWerte = getZaehleinheitWerte({
      data,
      einheitsUsed,
      ekzaehleinheits,
      ekzaehleinheitsOriginal,
      row,
    })

    const showDelete = nr > 1

    const remove = ({ row }) => {
      const afterDeletionHook = () => {
        refetch()
        tsQueryClient.invalidateQueries({
          queryKey: [`treeTpopfreiwkontrzaehl`],
        })
        tsQueryClient.invalidateQueries({
          queryKey: [`treeTpopfreiwkontrzaehlFolders`],
        })
      }
      setToDelete({
        table: 'tpopkontrzaehl',
        id: row.id,
        label: null,
        url: activeNodeArray,
        afterDeletionHook,
      })
    }

    const containerStyle = {
      gridArea: `count${nr}`,
    }
    const containerClass =
      showNew ? styles.containerNew
      : showEmpty ? styles.containerEmpty
      : styles.containerElse

    const formStyle = {
      gridArea: `count${nr}`,
    }
    const formClass = showDelete ? styles.formShowDelete : styles.formElse

    if (showNew) {
      return (
        <div
          style={containerStyle}
          className={`${styles.containerBase} ${containerClass}`}
        >
          <div className={styles.einheitLabel}>{`Zähleinheit ${nr}`}</div>
          <div className={styles.showNewClass}>
            <Button
              color="primary"
              onClick={createNew}
            >
              <MdAddCircleOutline className={styles.styledAddIcon} /> Neu
            </Button>
          </div>
        </div>
      )
    }
    if (showEmpty) {
      return (
        <div
          style={containerStyle}
          className={`${styles.containerBase} ${containerClass}`}
        >
          <div className={styles.einheitLabel}>{`Zähleinheit ${nr}`}</div>
        </div>
      )
    }

    return (
      <div
        data-id={`count${nr}`}
        style={formStyle}
        className={`${styles.containerBase} ${formClass}`}
      >
        <Einheit
          row={row}
          refetch={refetch}
          zaehleinheitWerte={zaehleinheitWerte}
          nr={nr}
        />
        <div className={styles.gezaehltLabel}>gezählt</div>
        <div className={styles.geschaetztLabel}>geschätzt</div>
        <div className={styles.gezaehltVal}>
          <Gezaehlt
            row={row}
            refetch={refetchMe}
          />
        </div>
        <div className={styles.geschaetztVal}>
          <Geschaetzt
            row={row}
            refetch={refetchMe}
          />
        </div>
        {showDelete && (
          <div className={styles.deleteClass}>
            <Button
              title="löschen"
              onClick={() => remove({ row })}
              color="inherit"
              className={styles.styledDeleteButton}
            >
              <MdDeleteForever className={styles.deleteIcon} />
            </Button>
          </div>
        )}
      </div>
    )
  }
