import { useAtomValue, useSetAtom } from 'jotai'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import {
  ekPlanRemoveApAtom,
  ekPlanApsDataAtom,
  ekPlanApsDataLoadingAtom,
} from '../../../../store/index.ts'

import styles from './index.module.css'

export const Ap = ({ ap }) => {
  const removeAp = useSetAtom(ekPlanRemoveApAtom)
  const apsData = useAtomValue(ekPlanApsDataAtom)
  const apsDataLoading = useAtomValue(ekPlanApsDataLoadingAtom)

  const onClickDelete = () => removeAp(ap)

  const thisApData = (apsData?.allAps?.nodes ?? []).find(
    (a) => a.id === ap.value,
  )
  const einheits = (thisApData?.ekzaehleinheitsByApId?.nodes ?? []).map(
    (e) => e?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.text,
  )
  const einheitsText =
    einheits.length === 0 ?
      'Keine! Bitte erfassen Sie eine zielrelevante EK-Zähleinheit'
    : einheits.join(', ')
  const labelText =
    einheits.length > 1 ?
      'Zielrelevante Zähleinheiten:'
    : 'Zielrelevante Zähleinheit:'

  return (
    <div className={styles.container}>
      <div className={styles.apClass}>{`${ap.label}.`}</div>
      {!apsDataLoading && (
        <>
          <div
            style={{
              color: einheits.length === 0 ? 'red' : 'unset',
            }}
          >
            <span className={styles.label}>{labelText}</span> {einheitsText}
          </div>
          <Tooltip title={`${ap.label} entfernen`}>
            <IconButton
              aria-label={`${ap.label} entfernen`}
              onClick={onClickDelete}
              className={styles.delIcon}
            >
              <FaTimes />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  )
}
