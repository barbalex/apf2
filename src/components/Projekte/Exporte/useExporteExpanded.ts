import { useSearchParamsState } from '../../../modules/useSearchParamsState.ts'

// which exporte sections are open travels in the url as repeated
// ?exporteOpen=<section> params (like projekteTabs), so an opened
// exporte view survives a reload and is shareable via link
const paramName = 'exporteOpen'

export const useExporteExpanded = (
  key: string,
): readonly [boolean, (open: boolean) => void] => {
  const [openSections, setOpenSections] = useSearchParamsState<string[]>(
    paramName,
    [],
  )
  const expanded = openSections.includes(key)
  const setExpanded = (open: boolean) => {
    const next = (
      open ?
        [...new Set([...openSections, key])]
      : openSections.filter((k) => k !== key)).sort()
    setOpenSections(next)
  }
  return [expanded, setExpanded] as const
}
