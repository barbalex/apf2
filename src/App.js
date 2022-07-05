// This is the entry file for the application
import React from 'react'
// importing isomorphic-fetch is essential
// otherwise apollo errors during the build
// see: https://github.com/gatsbyjs/gatsby/issues/11225#issuecomment-457211628
import 'isomorphic-fetch'
import queryString from 'query-string'

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import theme from './utils/materialTheme'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import de from 'date-fns/locale/de'
import { ApolloProvider } from '@apollo/client'
import localForage from 'localforage'
import MobxStore from './store'
import { SnackbarProvider } from 'notistack'
import { navigate } from 'gatsby'
//import { onPatch } from 'mobx-state-tree'
import { getSnapshot } from 'mobx-state-tree'

import initializeIdb from './modules/initializeIdb'
import buildClient from './client'
import isObject from './modules/isObject'

// see: https://github.com/fontsource/fontsource/blob/master/packages/roboto
import '@fontsource/roboto-mono'
import '@fontsource/roboto-mono/700.css'
// see: https://github.com/fontsource/fontsource/tree/master/packages/roboto-mono
import '@fontsource/roboto'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import createGlobalStyle from './utils/createGlobalStyle'

import { Provider as MobxProvider } from './storeContext'
import { Provider as IdbProvider } from './idbContext'

import Notifier from './components/shared/Notifier'
import NotificationDismisser from './components/shared/NotificationDismisser'

import setUserFromIdb from './modules/setUserFromIdb'
import initiateDataFromUrl from './modules/initiateDataFromUrl'
import getActiveNodeArrayFromPathname from './modules/getActiveNodeArrayFromPathname'

import 'simplebar/dist/simplebar.min.css'

import '@changey/react-leaflet-markercluster/dist/styles.min.css'
import 'react-datepicker/dist/react-datepicker.css'

const GlobalStyle = createGlobalStyle()

registerLocale('de', de)
setDefaultLocale('de')

const App = ({ element }) => {
  const idb = initializeIdb()
  const store = MobxStore.create()
  const client = buildClient({ store })
  const idbContext = { idb }

  if (typeof window !== 'undefined') {
    const visitedTopDomain = window.location.pathname === '/'
    const blacklist = [
      'user',
      'refetch',
      'notifications',
      'ekfIds',
      'hideMapControls',
    ]
    import('mst-persist').then((module) =>
      module
        .default('store', store, {
          storage: localForage,
          jsonify: false,
          blacklist,
        })
        .then(async () => {
          /**
           * TODO:
           * This is temporary after rebuilding the structure of dataFilter
           * Goal: prevent errors because previous persisted structure was invalid
           * Idea: test if is object. Only then empty
           */
          const dataFilterTreeAp = getSnapshot(store.tree.dataFilter.ap)
          const dataFilterTreePop = getSnapshot(store.tree.dataFilter.pop)
          const dataFilterTree2Ap = getSnapshot(store.tree2.dataFilter.ap)
          const dataFilterTree2Pop = getSnapshot(store.tree2.dataFilter.pop)
          if (isObject(dataFilterTreeAp) || isObject(dataFilterTreePop)) {
            [store.dataFilterEmptyTree('tree')]
          }
          if (isObject(dataFilterTree2Ap) || isObject(dataFilterTree2Pop)) {
            store.dataFilterEmptyTree('tree2')
          }
          const username = await setUserFromIdb({ idb, store })
          const isUser = !!username
          // set last activeNodeArray
          // only if top domain was visited
          if (isUser && visitedTopDomain) {
            console.log('App, mst-persist: will navigate')
            const { urlQuery } = store
            const search = queryString.stringify(urlQuery)
            const query = `${
              Object.keys(urlQuery).length > 0 ? `?${search}` : ''
            }`
            return navigate(
              `/Daten/${store.tree.activeNodeArray.join('/')}${query}`,
            )
          }
          const activeNodeArray = getActiveNodeArrayFromPathname()
          if (activeNodeArray[0] === 'Projekte') {
            console.log('App, mst-persist: will initiate data from url')
            initiateDataFromUrl({
              store,
            })
          }
        }),
    )
    const activeNodeArray = getActiveNodeArrayFromPathname()
    if (activeNodeArray[0] === 'Projekte') {
      initiateDataFromUrl({
        store,
      })
    }
    // inform users of old browsers
    const browserUpdateConfiguration = {
      required: { e: -2, f: -2, o: -2, s: -2, c: -2 },
      text: {
        msg: 'Ihr Browser ({brow_name}) ist veraltet.',
        msgmore:
          'Aktualisieren Sie ihn für mehr Sicherheit, Geschwindigkeit und weil apflora einen aktuellen Browser voraussetzt.',
        bupdate: 'Browser aktualisieren',
        bignore: 'Ignorieren',
      },
      style: 'bottom',
      //test: true,
    }
    import('browser-update').then((module) =>
      module.default(browserUpdateConfiguration),
    )
  }

  //onPatch(store, patch => console.log(patch))

  if (typeof window !== 'undefined' && window.Cypress) {
    // enable directly using these in tests
    window.__client__ = client
    window.__store__ = store
    window.__idb__ = idb
  }

  if (typeof window !== 'undefined') window.store = store

  return (
    <IdbProvider value={idbContext}>
      <MobxProvider value={store}>
        <ApolloProvider client={client}>
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
                  {element}
                  <Notifier />
                </>
              </SnackbarProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </ApolloProvider>
      </MobxProvider>
    </IdbProvider>
  )
}

export default App
