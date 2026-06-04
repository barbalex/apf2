import { useEffect } from 'react'
import { useSetAtom } from 'jotai'

import { setIsPrintAtom } from '../store/index.ts'

export const IsPrintSetter = () => {
  const setIsPrint = useSetAtom(setIsPrintAtom)

  /**
   * In Firefox this does not work! Bug is open since 7 years:
   * see: https://bugzilla.mozilla.org/show_bug.cgi?id=774398
   * TODO: seems to have been solved 8.2022
   * BUT: regression: https://bugzilla.mozilla.org/show_bug.cgi?id=1800897
   */
  useEffect(() => {
    window.matchMedia('print').addListener((mql) => {
      setIsPrint(mql.matches)
    })
    return () => {
      window.matchMedia('print').removeListener((mql) => {
        setIsPrint(mql.matches)
      })
    }
  }, [setIsPrint])

  // using render props on Layout to pass down appbarheight without using store
  return null
}
