import { useLocation } from 'react-router'
import { useAtomValue } from 'jotai'

import { isPrintAtom } from '../store/index.ts'

/**
 * Print mode is either requested via the atom (in-place prints: EKF,
 * tpopfreiwkontr form) or implied by being on a dedicated print route.
 * The route-derived variant matters: ProjektContainer swaps its tree shape
 * for print layout, which REMOUNTS the whole routed subtree — a 454-page
 * report remounting when the print button is clicked froze the app for
 * ~12 s. On print routes the report therefore mounts in print layout from
 * the start and the print button only navigates back when done.
 */
export const useIsPrint = () => {
  const { pathname } = useLocation()
  return useAtomValue(isPrintAtom) || pathname.endsWith('/print')
}
