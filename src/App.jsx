import React, { lazy, Suspense } from 'react'

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import theme from './utils/materialTheme'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import de from 'date-fns/locale/de'
import { ApolloProvider } from '@apollo/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MobxStore from './store'
import { SnackbarProvider } from 'notistack'
//import { onPatch } from 'mobx-state-tree'

import initializeIdb from './modules/initializeIdb'
import buildClient from './client'

// see: https://github.com/fontsource/fontsource/blob/master/packages/roboto
import '@fontsource/roboto-mono'
import '@fontsource/roboto-mono/700.css'
// see: https://github.com/fontsource/fontsource/tree/master/packages/roboto-mono
import '@fontsource/roboto'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import GlobalStyle from './components/GlobalStyle'

import { Provider as MobxProvider } from './storeContext'
import { Provider as IdbProvider } from './idbContext'

const Notifier = lazy(() => import('./components/shared/Notifier'))
import NotificationDismisser from './components/shared/NotificationDismisser'

import 'simplebar-react/dist/simplebar.min.css'

import '@changey/react-leaflet-markercluster/dist/styles.min.css'
import 'react-datepicker/dist/react-datepicker.css'

import Router from './components/Router'
const IsPrintSetter = lazy(() => import('./components/IsPrintSetter'))
const MouseWheelHandler = lazy(() => import('./components/MouseWheelHandler'))
const LastTouchedNodeSetter = lazy(() =>
  import('./components/LastTouchedNodeSetter'),
)
const LegacyBrowserInformer = lazy(() =>
  import('./components/LegacyBrowserInformer'),
)
const StorePersister = lazy(() => import('./components/StorePersister'))

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

  // console.log('App rendering')

  return (
    <IdbProvider value={idbContext}>
      <MobxProvider value={store}>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <SnackbarProvider
                  maxSnack={3}
                  preventDuplicate
                  autoHideDuration={20000}
                  action={(key) => <NotificationDismisser nKey={key} />}
                >
                  <>
                    <GlobalStyle />
                    <Router />
                    <Suspense fallback={null}>
                      <Notifier />
                      <IsPrintSetter />
                      <LastTouchedNodeSetter />
                      <MouseWheelHandler />
                      <LegacyBrowserInformer />
                      <StorePersister client={client} store={store} idb={idb} />
                    </Suspense>
                  </>
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
