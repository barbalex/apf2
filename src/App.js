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
import GlobalStyle from './components/GlobalStyle'

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
      'notifications',
      'ekfIds',
      'hideMapControls',
      'overlays', // 2022.10.26 added overlay. Need to refresh or users will not get new ones
      'apfloraLayers', // 2022.10.28 added. Need to refresh or users will not get new ones
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
          const dataFilterTreeTpop = getSnapshot(store.tree.dataFilter.tpop)
          const dataFilterTreeTpopmassn = getSnapshot(
            store.tree.dataFilter.tpopmassn,
          )
          const dataFilterTreeTpopfeldkontr = getSnapshot(
            store.tree.dataFilter.tpopfeldkontr,
          )
          const dataFilterTreeTpopfreiwkontr = getSnapshot(
            store.tree.dataFilter.tpopfreiwkontr,
          )
          const dataFilterTree2Ap = getSnapshot(store.tree2.dataFilter.ap)
          const dataFilterTree2Pop = getSnapshot(store.tree2.dataFilter.pop)
          const dataFilterTree2Tpop = getSnapshot(store.tree2.dataFilter.tpop)
          const dataFilterTree2Tpopmassn = getSnapshot(
            store.tree2.dataFilter.tpopmassn,
          )
          const dataFilterTree2Tpopfeldkontr = getSnapshot(
            store.tree2.dataFilter.tpopfeldkontr,
          )
          const dataFilterTree2Tpopfreiwkontr = getSnapshot(
            store.tree2.dataFilter.tpopfreiwkontr,
          )
          if (
            isObject(dataFilterTreeAp) ||
            isObject(dataFilterTreePop) ||
            isObject(dataFilterTreeTpop) ||
            isObject(dataFilterTreeTpopmassn) ||
            isObject(dataFilterTreeTpopfeldkontr) ||
            isObject(dataFilterTreeTpopfreiwkontr)
          ) {
            [store.dataFilterEmptyTree('tree')]
          }
          if (
            isObject(dataFilterTree2Ap) ||
            isObject(dataFilterTree2Pop) ||
            isObject(dataFilterTree2Tpop) ||
            isObject(dataFilterTree2Tpopmassn) ||
            isObject(dataFilterTree2Tpopfeldkontr) ||
            isObject(dataFilterTree2Tpopfreiwkontr)
          ) {
            store.dataFilterEmptyTree('tree2')
          }

          const username = await setUserFromIdb({ idb, store })
          const isUser = !!username

          // window.store = store

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
