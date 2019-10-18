// This is the entry file for the application
import React from 'react'
// importing isomorphic-fetch is essential
// otherwise apollo errors during the build
// see: https://github.com/gatsbyjs/gatsby/issues/11225#issuecomment-457211628
import 'isomorphic-fetch'
import queryString from 'query-string'

import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './utils/materialTheme'
import moment from 'moment'
import 'moment/locale/de-ch' // this is the important bit, you have to import the locale your'e trying to use.
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { ApolloProvider } from '@apollo/react-hooks'
import localForage from 'localforage'
import MobxStore from './store'
import { SnackbarProvider } from 'notistack'
import { navigate } from 'gatsby'
//import { onPatch } from 'mobx-state-tree'

import initializeIdb from './modules/initializeIdb'
import buildClient from './client'

import createGlobalStyle from './utils/createGlobalStyle'

import { Provider as MobxProvider } from './storeContext'
import { Provider as IdbProvider } from './idbContext'

import Notifier from './components/shared/Notifier'
import NotificationDismisser from './components/shared/NotificationDismisser'

import setUserFromIdb from './modules/setUserFromIdb'
import initiateDataFromUrl from './modules/initiateDataFromUrl'
import getActiveNodeArrayFromPathname from './modules/getActiveNodeArrayFromPathname'

import 'react-leaflet-markercluster/dist/styles.min.css'

const GlobalStyle = createGlobalStyle()

const App = ({ element }) => {
  const idb = initializeIdb()
  const store = MobxStore.create()
  const client = buildClient({ idb, store })
  const idbContext = { idb }

  if (typeof window !== 'undefined') {
    const visitedTopDomain = window.location.pathname === '/'
    const blacklist = ['user', 'refetch', 'notifications', 'ekfIds']
    import('mst-persist').then(module =>
      module
        .default('store', store, {
          storage: localForage,
          jsonify: false,
          blacklist,
        })
        .then(() => {
          // ensure window.apf2NetworkError has time to arrive
          setTimeout(async () => {
            console.log(
              'App, mst-persist: time of last network error:',
              window.apf2NetworkError,
            )
            // only do this if no network error happened recently
            // to prevent endles cycle of reloading
            // due to setting activeNodeArray causing navigation event
            if (
              !!window.apf2NetworkError &&
              window.apf2NetworkError - Date.now() < 10
            ) {
              console.log(
                'App, mst-persist: backing out because of recent network error',
              )
              return
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
          })
        }),
    )
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
    import('browser-update').then(module =>
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

  //console.log('App', { element })

  return (
    <IdbProvider value={idbContext}>
      <MobxProvider value={store}>
        <ApolloProvider client={client}>
          <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider
              utils={MomentUtils}
              moment={moment}
              locale="de-ch"
            >
              <SnackbarProvider
                maxSnack={3}
                preventDuplicate
                autoHideDuration={10000}
                action={key => <NotificationDismisser nKey={key} />}
              >
                <>
                  <GlobalStyle />
                  {element}
                  <Notifier />
                </>
              </SnackbarProvider>
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </ApolloProvider>
      </MobxProvider>
    </IdbProvider>
  )
}

export default App
