import React, { lazy, Suspense, createRef } from 'react'

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import theme from './utils/materialTheme.js'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale/de'
import { ApolloProvider } from '@apollo/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MobxStore from './store/index.js'
import { SnackbarProvider } from 'notistack'
//import { onPatch } from 'mobx-state-tree'

import initializeIdb from './modules/initializeIdb.js'
import buildClient from './client.js'

// see: https://github.com/fontsource/fontsource/blob/master/packages/roboto
import '@fontsource/roboto-mono'
import '@fontsource/roboto-mono/700.css'
// see: https://github.com/fontsource/fontsource/tree/master/packages/roboto-mono
import '@fontsource/roboto'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import GlobalStyle from './components/GlobalStyle.jsx'

import { Provider as MobxProvider } from './storeContext.js'
import { Provider as IdbProvider } from './idbContext.js'

import { UploaderContext } from './UploaderContext.js'

const Notifier = lazy(() => import('./components/shared/Notifier.jsx'))
import NotificationDismisser from './components/shared/NotificationDismisser.jsx'

import 'simplebar-react/dist/simplebar.min.css'

import '@changey/react-leaflet-markercluster/dist/styles.min.css'
import 'react-datepicker/dist/react-datepicker.css'

import Router from './components/Router/index.jsx'
const IsPrintSetter = lazy(() => import('./components/IsPrintSetter.jsx'))
const MouseWheelHandler = lazy(
  () => import('./components/MouseWheelHandler.jsx'),
)
const LastTouchedNodeSetter = lazy(
  () => import('./components/LastTouchedNodeSetter.jsx'),
)
const LegacyBrowserInformer = lazy(
  () => import('./components/LegacyBrowserInformer.jsx'),
)
const StorePersister = lazy(() => import('./components/StorePersister.jsx'))
import { Spinner } from './components/shared/Spinner.jsx'

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

const App = () => {
  const idb = initializeIdb()
  const store = MobxStore.create()
  const client = buildClient({ store })
  const idbContext = { idb }
  const uploaderRef = createRef(null)

  // console.log('App rendering')

  return (
    <IdbProvider value={idbContext}>
      <MobxProvider value={store}>
        <ApolloProvider client={client}>
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
                  <UploaderContext.Provider value={uploaderRef}>
                    <GlobalStyle />
                    <Suspense fallback={<Spinner />}>
                      <Router />
                    </Suspense>
                    <Suspense fallback={null}>
                      <Notifier />
                      <IsPrintSetter />
                      <LastTouchedNodeSetter />
                      <MouseWheelHandler />
                      <LegacyBrowserInformer />
                      <StorePersister
                        client={client}
                        store={store}
                        idb={idb}
                      />
                    </Suspense>
                  </UploaderContext.Provider>
                </SnackbarProvider>
              </ThemeProvider>
            </StyledEngineProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </MobxProvider>
    </IdbProvider>
  )
}

export default App
