import { lazy, Suspense, createRef, useEffect } from 'react'

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale/de'
import { ApolloProvider } from '@apollo/client/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { Provider as JotaiProvider } from 'jotai'
import { Analytics } from '@vercel/analytics/react'

import 'react-leaflet-markercluster/styles'
import 'react-datepicker/dist/react-datepicker.css'

import { theme } from './utils/materialTheme.ts'

import { buildApolloClient } from './apolloClient.ts'

import { store } from './store/index.ts'

import { UploaderContext } from './UploaderContext.ts'

import { navigateToLastActiveNodeArray } from './modules/navigateToLastActiveNodeArray.js'

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
  const apolloClient = buildApolloClient()
  const uploaderRef = createRef<HTMLElement>(null)

  useEffect(() => {
    navigateToLastActiveNodeArray()
  }, [])

  return (
    <JotaiProvider store={store}>
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
                  <Router />
                  {/*<UnterhaltsRouter />*/}
                  <Notifier />
                  <IsPrintSetter />
                  <LastTouchedNodeSetter />
                  <MouseWheelHandler />
                  <LegacyBrowserInformer />
                </UploaderContext>
              </SnackbarProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </QueryClientProvider>
      </ApolloProvider>
      <Analytics debug={false} />
    </JotaiProvider>
  )
}
