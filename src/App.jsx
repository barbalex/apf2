import { lazy, Suspense, createRef, useEffect } from 'react'

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale/de'
import { ApolloProvider } from '@apollo/client/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { Provider as JotaiProvider } from 'jotai'
import { Analytics } from '@vercel/analytics/react'
//import { onPatch } from 'mobx-state-tree'

// see: https://github.com/fontsource/fontsource/blob/master/packages/roboto
import '@fontsource/roboto-mono'
import '@fontsource/roboto-mono/700.css'
// see: https://github.com/fontsource/fontsource/tree/master/packages/roboto-mono
import '@fontsource/roboto'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'react-leaflet-markercluster/styles'
import 'react-datepicker/dist/react-datepicker.css'

import { theme } from './utils/materialTheme.js'

import { initializeIdb } from './modules/initializeIdb.js'
import { MobxStore } from './store/index.js'
import { buildApolloClient } from './apolloClient.js'

import { store as jotaiStore } from './JotaiStore/index.js'

import { MobxContext } from './mobxContext.js'
import { IdbContext } from './idbContext.js'
import { UploaderContext } from './UploaderContext.js'

import { persistStore } from './modules/persistStore.js'

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
// const UnterhaltsRouter = lazy(async () => ({
//   default: (await import('./components/Router/indexUnterhalt.tsx')).Router,
// }))
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
const Spinner = lazy(async () => ({
  default: (await import('./components/shared/Spinner.tsx')).Spinner,
}))

registerLocale('de', de)
setDefaultLocale('de')

// https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
// If true (standard): leads to entire tree refetching every time window is focused
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const App = () => {
  const idb = initializeIdb()
  const store = MobxStore.create()
  const apolloClient = buildApolloClient({ store })
  const idbContext = { idb }
  const uploaderRef = createRef(null)

  useEffect(() => {
    persistStore({ store, idb })
  }, [])

  return (
    <JotaiProvider store={jotaiStore}>
      <IdbContext value={idbContext}>
        <MobxContext value={store}>
          <ApolloProvider client={apolloClient}>
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
                      {/* <Suspense fallback={<Spinner />}> */}
                      <Router />
                      {/*<UnterhaltsRouter />*/}
                      {/* </Suspense> */}
                      {/* <Suspense fallback={null}> */}
                      <Notifier />
                      <IsPrintSetter />
                      <LastTouchedNodeSetter />
                      <MouseWheelHandler />
                      <LegacyBrowserInformer />
                      {/* </Suspense> */}
                    </UploaderContext>
                  </SnackbarProvider>
                </ThemeProvider>
              </StyledEngineProvider>
            </QueryClientProvider>
          </ApolloProvider>
        </MobxContext>
      </IdbContext>
      <Analytics debug={false} />
    </JotaiProvider>
  )
}
