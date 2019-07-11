// This is the entry file for the application
import 'babel-polyfill'

import React from 'react'
import 'isomorphic-fetch'

import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './utils/materialTheme'
import moment from 'moment'
import 'moment/locale/de-ch' // this is the important bit, you have to import the locale your'e trying to use.
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import localForage from 'localforage'
import MobxStore from './store'
import { SnackbarProvider } from 'notistack'
//import { onPatch } from 'mobx-state-tree'

import 'typeface-roboto'
import 'typeface-roboto-mono'

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
    const blacklist = ['user', 'refetch', 'notifications']
    import('mst-persist').then(module =>
      module
        .default('store', store, {
          storage: localForage,
          jsonify: false,
          blacklist,
        })
        .then(async () => {
          const username = await setUserFromIdb({ idb, store })
          const isUser = !!username
          // set last activeNodeArray
          // only if top domain was visited
          if (isUser && visitedTopDomain) {
            return store.tree.setActiveNodeArray(store.tree.activeNodeArray)
          }
          const activeNodeArray = getActiveNodeArrayFromPathname()
          if (activeNodeArray[0] === 'Projekte') {
            initiateDataFromUrl({
              store,
            })
          }
        }),
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

  console.log('App rendering')

  return (
    <IdbProvider value={idbContext}>
      <MobxProvider value={store}>
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            <MuiThemeProvider theme={theme}>
              <MuiPickersUtilsProvider
                utils={MomentUtils}
                moment={moment}
                locale="de-ch"
              >
                <SnackbarProvider
                  maxSnack={5}
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
          </ApolloHooksProvider>
        </ApolloProvider>
      </MobxProvider>
    </IdbProvider>
  )
}

export default App
