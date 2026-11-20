import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAtomValue, useStore } from 'jotai'

import { treeApFilterAtom } from '../../store/index.ts'

// the "nur AP" checkbox is view state that changes what a link shows:
// it travels as ?nurAp=false. Absent means the default (on) — links
// from a default-on session never carry it and never override a
// receiver's own stored preference
const nurApParamName = 'nurAp'

/**
 * keeps the tree's "nur AP" filter linkable: on mount the param (when
 * present) wins over the stored value; afterwards the param carries the
 * state when it is off and reconciles against racing navigations.
 */
export const NurApUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const targetStore = useStore()
  const nurAp = useAtomValue(treeApFilterAtom)

  const settled = useRef(false)
  const firstChangeRun = useRef(true)

  // on mount: apply the param, then complete the url when nur AP is off
  // (read from the store because this render's subscribed value is
  // pre-seed). Declared before the change effect so that one skips its
  // own stale first run
  useEffect(() => {
    const fromUrl = searchParams.get(nurApParamName)
    if (fromUrl !== null) {
      targetStore.set(treeApFilterAtom, fromUrl === 'true')
    }
    if (targetStore.get(treeApFilterAtom) === false && fromUrl !== 'false') {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(nurApParamName, 'false')
          return next
        },
        { replace: true },
      )
    }
    settled.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep the url current. Its first run happens in the same commit as
  // the mount effect above, with pre-seed (stale) subscribed values —
  // skip exactly that one run
  useEffect(() => {
    if (firstChangeRun.current) {
      firstChangeRun.current = false
      return
    }
    if (!settled.current) return
    // absent = the default (on): the param only travels when off
    const desired = nurAp ? null : 'false'
    const current = searchParams.get(nurApParamName)
    if (desired === current) return
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (desired === null) next.delete(nurApParamName)
        else next.set(nurApParamName, desired)
        return next
      },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nurAp, searchParams])

  return null
}
