import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { apiFetch } from '../../modules/api.ts'
import { getActiveNodeArrayFromPathname } from '../../modules/getActiveNodeArrayFromPathname.ts'
import { buildUrlIdChecks } from '../../modules/urlIdChecks.ts'
import { addNotificationAtom } from '../../store/index.ts'

/**
 * Forwards a url whose ids no longer exist to the deepest level that
 * does. Urls outlive ids: migrations regenerate them while browsers
 * keep bookmarks, history and open tabs. Today such a url silently
 * shows zeroed tree counters and empty menus (every level below a dead
 * id hangs on it); the guard cuts the url at the first dead id - all
 * levels below it die with their parent, so the prefix above it is the
 * lowest location that still exists. In the common case (dead projekt
 * id) that is the Projektliste.
 *
 * Checks run once per url in parallel; a check that fails to answer
 * (rls, network) never forwards - only a confirmed empty result does.
 */
export const UrlGuard = () => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const addNotification = useSetAtom(addNotificationAtom)

  const activeNodeArray = getActiveNodeArrayFromPathname(pathname)
  const checks = buildUrlIdChecks(activeNodeArray)

  const { data } = useQuery({
    queryKey: [
      'urlGuard',
      ...checks.map((check) => [
        check.view,
        check.id,
        check.parent?.column,
        check.parent?.id,
      ]),
    ],
    enabled: checks.length > 0,
    // an id cannot come back to life: cached answers stay correct for
    // the session and repeated visits of a dead link forward instantly
    staleTime: Infinity,
    queryFn: async () =>
      Promise.all(
        checks.map(async (check) => {
          const parent = check.parent ?
              `&${check.parent.column}=eq.${check.parent.id}`
            : ''
          try {
            const rows = await apiFetch<{ id: string }[]>(
              `/${check.view}?id=eq.${check.id}${parent}&select=id&limit=1`,
            )
            return (rows?.length ?? 0) > 0
          } catch {
            return true
          }
        }),
      ),
  })

  const firstInvalidIndex = data?.findIndex((isValid) => !isValid)
  const invalidCheck =
    firstInvalidIndex !== undefined && firstInvalidIndex !== -1 ?
      checks[firstInvalidIndex]
    : undefined
  const redirectTo =
    invalidCheck ?
      `/Daten/${activeNodeArray
        .slice(0, invalidCheck.index)
        .map((segment) => encodeURIComponent(String(segment)))
        .join('/')}`
    : undefined

  useEffect(() => {
    if (!redirectTo) return
    void navigate(
      { pathname: redirectTo, search },
      { replace: true },
    )
    addNotification({
      message:
        'Die geöffnete Adresse enthielt eine ungültige ID. Sie wurde zur tiefsten noch existierenden Ebene weitergeleitet.',
      options: { variant: 'info' },
    })
  }, [redirectTo, search, navigate, addNotification])

  return null
}
