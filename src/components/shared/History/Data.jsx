import { diffSentences } from 'diff'

import { toStringIfPossible } from '../../../modules/toStringIfPossible.js'
import { Spinner } from '../Spinner'

import styles from './Data.module.css'

const styles = {
  added: { color: 'green' },
  removed: { color: 'red' },
}

export const Data = ({ dataArray = [], loading }) => {
  if (loading) return <Spinner />

  return (dataArray ?? [])?.map((d, index) => {
    // need to use get to enable passing paths as key, for instance 'person.name'
    // also stringify because Diff split's it
    let inputA = toStringIfPossible(d.valueInRow) ?? '(nichts)'
    let inputB = toStringIfPossible(d.valueInHist) ?? '(nichts)'
    // explicitly show when only one of the values is empty
    if (inputA !== inputB) {
      inputA = inputA ?? '(nichts)'
      inputB = inputB ?? '(nichts)'
    }

    const showDiff = !['geändert', 'geändert von'].includes(d.label)
    const isLast = index + 1 === (dataArray ?? []).length

    return (
      <div
        className={styles.row}
        key={d.label}
        style={{
          borderBottom: isLast ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        <div className={styles.key}>{`${d.label}:`}</div>
        {showDiff ?
          <>
            {(diffSentences(inputB, inputA) ?? []).map((group) => (
              <span
                key={group.value}
                style={
                  group.added ? styles.added
                  : group.removed ?
                    styles.removed
                  : {}
                }
              >
                {group.value}
              </span>
            ))}
          </>
        : <div>{inputB}</div>}
      </div>
    )
  })
}
