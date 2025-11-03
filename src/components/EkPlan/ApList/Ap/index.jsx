import { useContext } from 'react'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'

import { container, apClass, label, delIcon } from './index.module.css'

export const Ap = observer(({ ap }) => {
  const store = useContext(MobxContext)
  const { removeAp, apsData, apsDataLoading } = store.ekPlan

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
    <div className={container}>
      <div className={apClass}>{`${ap.label}.`}</div>
      {!apsDataLoading && (
        <>
          <div
            style={{
              color: einheits.length === 0 ? 'red' : 'unset',
            }}
          >
            <span className={label}>{labelText}</span> {einheitsText}
          </div>
          <Tooltip title={`${ap.label} entfernen`}>
            <IconButton
              aria-label={`${ap.label} entfernen`}
              onClick={onClickDelete}
              className={delIcon}
            >
              <FaTimes />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  )
})
