import { lazy, createRef, Suspense, useEffect } from 'react'

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { Provider as JotaiProvider } from 'jotai'
import { Analytics } from '@vercel/analytics/react'
import { version as appVersion } from '../package.json'

import { theme } from './utils/materialTheme.ts'

import { store, userTokenAtom, removeUserAtom } from './store/index.ts'

import { UploaderContext } from './UploaderContext.ts'
import type { UploadCtxProvider } from '@uploadcare/file-uploader'

import { navigateToLastActiveNodeArray } from './modules/navigateToLastActiveNodeArray.ts'

import { ApiError, isTokenExpired } from './modules/api.ts'

import { VersionCheck } from './components/VersionCheck/index.tsx'

import './app.css'

const Notifier = lazy(async () => ({
  default: (await import('./components/shared/Notifier.tsx')).Notifier,
}))
const NotificationDismisser = lazy(async () => ({
  default: (await import('./components/shared/NotificationDismisser.tsx'))
    .NotificationDismisser,
}))
const Router = lazy(async () => ({
  default: (await import('./components/Router/index.tsx')).Router,
}))
const IsPrintSetter = lazy(async () => ({
  default: (await import('./components/IsPrintSetter.tsx')).IsPrintSetter,
}))
const MouseWheelHandler = lazy(async () => ({
  default: (await import('./components/MouseWheelHandler.tsx'))
    .MouseWheelHandler,
}))
const LastTouchedNodeSetter = lazy(async () => ({
  default: (await import('./components/LastTouchedNodeSetter.tsx'))
    .LastTouchedNodeSetter,
}))
const LegacyBrowserInformer = lazy(async () => ({
  default: (await import('./components/LegacyBrowserInformer.tsx'))
    .LegacyBrowserInformer,
}))

// https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
// If true (standard): leads to entire tree refetching every time window is focused
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // 4xx never recovers by retrying; retrying them (f.i. an expired
      // token's 401s on a 460-request print page) only multiplies the load.
      // Everything else gets one retry instead of the default three
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          (error.status ?? 0) >= 400 &&
          (error.status ?? 0) < 500
        )
          return false
        return failureCount < 1
      },
    },
  },
})

export const App = () => {
  const uploaderRef = createRef<UploadCtxProvider | null>()

  useEffect(() => {
    const baseTitle = 'apflora'
    document.title = `${baseTitle} ${appVersion}`
  }, [])

  useEffect(() => {
    navigateToLastActiveNodeArray()
  }, [])

  // a token that expires mid-session logs the user out at expiry —
  // otherwise the app silently browses on cached data until a refetch
  // fails (api.ts catches the request-time cases; this catches idle tabs)
  useEffect(() => {
    const check = () => {
      if (isTokenExpired(store.get(userTokenAtom))) store.set(removeUserAtom)
    }
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <JotaiProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <uc-upload-ctx-provider
            id="uploaderctx"
            ctx-name="uploadcare"
            ref={uploaderRef}
          ></uc-upload-ctx-provider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
              preventDuplicate
              autoHideDuration={10000}
              action={(key) => <NotificationDismisser nKey={key} />}
            >
              <UploaderContext value={uploaderRef}>
                {/* these are all lazy: give them a boundary so they
                    don't suspend the whole app without a fallback */}
                <Suspense fallback={null}>
                  <Router />
                  <Notifier />
                  <IsPrintSetter />
                  <LastTouchedNodeSetter />
                  <MouseWheelHandler />
                  <LegacyBrowserInformer />
                  <VersionCheck />
                </Suspense>
              </UploaderContext>
            </SnackbarProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
      <Analytics debug={false} />
    </JotaiProvider>
  )
}
