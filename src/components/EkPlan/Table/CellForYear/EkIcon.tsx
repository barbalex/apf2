import { useAtomValue } from 'jotai'
import { sum } from 'es-toolkit'

import {
  ekPlanShowCountAtom,
  ekPlanShowEkCountAtom,
} from '../../../../store/index.ts'
import type {
  RowTpopkontrNode,
  RowTpopkontrzaehlNode,
} from '../tableTypes.ts'
import styles from './EkIcon.module.css'

export const EkIcon = ({
  planned,
  eks,
  einheits,
}: {
  planned: boolean
  eks: RowTpopkontrNode[]
  einheits: (string | null | undefined)[] | undefined
}) => {
  const showCount = useAtomValue(ekPlanShowCountAtom)
  const showEkCount = useAtomValue(ekPlanShowEkCountAtom)

  if (!planned && !eks.length) {
    return <div className={styles.container}>&nbsp;</div>
  }

  // zaehls of zielrelevanten einheits that were counted
  const gezaehlteZielrelevanteZaehls = (ek: RowTpopkontrNode) =>
    (ek.tpopkontrzaehlsByTpopkontrId?.nodes ?? []).filter(
      (z: RowTpopkontrzaehlNode) =>
        (einheits?.includes(z.einheit) ?? false) &&
        z.anzahl !== null &&
        (z.tpopkontrzaehlEinheitWerteByEinheit?.ekzaehleinheitsByZaehleinheitId
          ?.totalCount ?? 0) > 0,
    )

  let sumCounted = null
  let eksHaveCountedZielrelevanteEinheits = false
  if (einheits && einheits.length) {
    eksHaveCountedZielrelevanteEinheits =
      eks.flatMap(gezaehlteZielrelevanteZaehls).length > 0
  }
  if (eksHaveCountedZielrelevanteEinheits) {
    sumCounted = sum(
      eks.flatMap((ek) =>
        gezaehlteZielrelevanteZaehls(ek).flatMap((z) =>
          z.anzahl !== null ? [z.anzahl] : [],
        ),
      ),
    )
  }

  return (
    <div
      className={styles.container}
      style={{
        justifyContent: showCount ? 'space-between' : 'center',
      }}
    >
      <div
        className={styles.checkbox}
        style={{
          background: planned ? 'rgba(46, 125, 50, 0.05)' : 'none',
          border: planned ? '1px solid #2e7d32' : 'none',
        }}
      >
        {!!eks.length && (
          <svg
            viewBox="0 0 24 24"
            className={styles.icon}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {showEkCount && eks.length > 1 && (
          <div className={styles.nrOfEk}>{eks.length}</div>
        )}
      </div>
      {showCount && (
        <div className={styles.sumCounted}>
          {sumCounted !== null ? sumCounted : ' '}
        </div>
      )}
    </div>
  )
}
