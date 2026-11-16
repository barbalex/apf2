import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAtomValue, useStore } from 'jotai'

import {
  labelFilterSearchString,
  readLabelFilterFromSearchParams,
  writeLabelFilterToSearchParams,
} from '../../modules/labelFilterSearchParam.ts'
import {
  initialTreeNodeLabelFilter,
  treeNodeLabelFilterAtom,
} from '../../store/index.ts'

// the tree's label filter commits per Enter, so writes are rare — the
// debounce additionally coalesces bursts (e.g. the ap-switch reset)
const writeDebounceMs = 250

/**
 * keeps the tree node label filter linkable in the url as one readable
 * param per node type (?labelFilter.pop=Eg): on mount, url params win
 * over the stored value; afterwards every change is written back
 * through the router (replace, debounced) and reconciled whenever the
 * url's params diverge — a racing navigation may drop them (params set
 * from handlers evaluate against the last committed search).
 */
export const LabelFilterUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const targetStore = useStore()
  const labelFilter = useAtomValue(treeNodeLabelFilterAtom)

  const settled = useRef(false)
  const firstChangeRun = useRef(true)
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentSearchString = labelFilterSearchString(
    readLabelFilterFromSearchParams(searchParams),
  )
  const desiredSearchString = labelFilterSearchString(
    labelFilter as Record<string, string>,
  )

  // on mount: url params win over the stored value, then complete the
  // url with the now-effective filter (read from the store because this
  // render's subscribed values are pre-seed). Declared before the
  // change effect so that one skips its own stale first run
  useEffect(() => {
    const fromUrl = readLabelFilterFromSearchParams(
      new URLSearchParams(searchParams),
    )
    if (Object.keys(fromUrl).length > 0) {
      targetStore.set(treeNodeLabelFilterAtom, {
        ...initialTreeNodeLabelFilter,
        ...fromUrl,
      })
    }
    const effective = targetStore.get(treeNodeLabelFilterAtom)
    const desired = labelFilterSearchString(effective as Record<string, string>)
    if (desired !== labelFilterSearchString(fromUrl)) {
      setSearchParams(
        (prev) =>
          writeLabelFilterToSearchParams(
            prev,
            effective as Record<string, string>,
          ),
        { replace: true },
      )
    }
    settled.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep the url current: debounced on label filter changes, immediate
  // reconciliation when the url's params diverge (racing navigation).
  // Its first run happens in the same commit as the mount effect above,
  // with pre-seed (stale) subscribed values — skip exactly that one run
  useEffect(() => {
    if (firstChangeRun.current) {
      firstChangeRun.current = false
      return
    }
    if (!settled.current) return
    if (currentSearchString === desiredSearchString) return

    if (writeTimer.current) clearTimeout(writeTimer.current)
    writeTimer.current = setTimeout(() => {
      writeTimer.current = null
      setSearchParams(
        (prev) =>
          writeLabelFilterToSearchParams(
            prev,
            labelFilter as Record<string, string>,
          ),
        { replace: true },
      )
    }, writeDebounceMs)
    return () => {
      if (writeTimer.current) {
        clearTimeout(writeTimer.current)
        writeTimer.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelFilter, searchParams])

  useEffect(
    () => () => {
      if (writeTimer.current) clearTimeout(writeTimer.current)
    },
    [],
  )

  return null
}
