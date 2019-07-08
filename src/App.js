// @flow
/**
 * app.js
 *
 * This is the entry file for the application.
 * Contains only setup, theming and boilerplate code
 *
 */

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
import isEqual from 'lodash/isEqual'
import MobxStore from './store'
import { SnackbarProvider } from 'notistack'
//import { onPatch } from 'mobx-state-tree'

import 'typeface-roboto'
import 'typeface-roboto-mono'

// import components
import initializeIdb from './modules/initializeIdb'
import buildClient from './client'

import createGlobalStyle from './utils/createGlobalStyle'

import { Provider as MobxProvider } from './storeContext'
import { Provider as IdbProvider } from './idbContext'

import Notifier from './components/shared/Notifier'
import NotificationDismisser from './components/shared/NotificationDismisser'
import getActiveNodeArrayFromPathname from './modules/getActiveNodeArrayFromPathname'

import 'react-leaflet-markercluster/dist/styles.min.css'

const GlobalStyle = createGlobalStyle()

const App = ({ element }) => {
  // prevent changing values in number inputs when scrolling pages!
  // see: http://stackoverflow.com/a/38589039/712005
  // and: https://stackoverflow.com/a/42058469/712005
  // turned off due to chrome overriding this: https://www.chromestatus.com/features/6662647093133312
  /*typeof window !== 'undefined' &&
    document.addEventListener('wheel', function(event) {
      if (window.document.activeElement.type === 'number') {
        event.preventDefault()
      }
    })*/

  const idb = initializeIdb()
  const store = MobxStore.create()
  const client = buildClient({ idb, store })
  const idbContext = { idb }

  if (typeof window !== 'undefined') {
    import('mst-persist').then(module =>
      module
        .default('store', store, {
          storage: localForage,
          jsonify: false,
          blacklist: [
            'user',
            'updateAvailable',
            'urlQuery',
            'refetch',
            'notifications',
          ],
        })
        .then(() => {
          console.log('store has been hydrated')
          // navigate to last activeNodeArray
          // but only if url is inside daten
          const activeNodeArray = getActiveNodeArrayFromPathname()
          const storeActiveNodeArray = store.tree.activeNodeArray.slice()
          /*console.log('App, rehydrating', {
            activeNodeArray,
            storeActiveNodeArray,
            isEqual: isEqual(activeNodeArray, storeActiveNodeArray),
          })*/
          if (
            (activeNodeArray[0] === 'Daten' || activeNodeArray.length === 0) &&
            !isEqual(activeNodeArray, storeActiveNodeArray)
          ) {
            //console.log('App, rehydrating, will set active nodearray')
            store.tree.setActiveNodeArray(store.tree.activeNodeArray)
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
