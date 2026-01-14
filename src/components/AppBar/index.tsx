import { Suspense, useEffect, useContext } from 'react'
import { Outlet, useLocation, useParams, useNavigate } from 'react-router'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { Bar } from './Bar/index.tsx'
import { EkfBar } from './EkfBar/index.tsx'
import { inIframe } from '../../modules/inIframe.ts'
import { Spinner } from '../shared/Spinner.tsx'
import { MobxContext } from '../../mobxContext.ts'
import { isMobileViewAtom } from '../../JotaiStore/index.ts'
import { IsDesktopViewSetter } from '../IsDesktopViewSetter.tsx'

import styles from './index.module.css'

const isInIframe = inIframe()

export const Component = observer(() => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { pathname, search } = useLocation()

  const store = useContext(MobxContext)
  const activeNodeArray = store.tree.activeNodeArray

  const [isMobileView] = useAtom(isMobileViewAtom)

  useEffect(() => {
    if (isInIframe) return

    // if app was opened on top level, navigate to last active node
    // but only if activeNodeArray is not empty
    // otherwise first time users are navigated to the login
    if (pathname === '/' && activeNodeArray.length > 0) {
      navigate('/Daten/' + activeNodeArray.join('/') + search)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isInIframe) return <Outlet />

  const showEkf =
    !!userId && pathname.startsWith(`/Daten/Benutzer/${userId}/EKF`)

  return (
    <div className={styles.container}>
      <IsDesktopViewSetter />
      <div
        className={styles.appbar}
        style={{ padding: isMobileView ? 0 : 4 }}
      >
        {showEkf ?
          <EkfBar />
        : <Bar />}
      </div>
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </div>
  )
})
