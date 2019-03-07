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
import ReactDOM from 'react-dom'

import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import moment from 'moment'
import 'moment/locale/de-ch' // this is the important bit, you have to import the locale your'e trying to use.
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import MobxStore from './mobxStore'
//import { onPatch } from 'mobx-state-tree'

import 'typeface-roboto'
import 'react-reflex/styles.css'

// import components
import initializeIdb from './modules/initializeIdb'
import buildClient from './client'

import initiateDataFromUrl from './modules/initiateDataFromUrl'

// service worker
import registerServiceWorker from './registerServiceWorker'

import AppContainer from './components/AppContainer'
import Print from './components/Print'
import historyListen from './modules/historyListen'

import { Provider as MobxProvider } from './mobxStoreContext'
import { Provider as IdbProvider } from './idbContext'

import './index.css'
import createInitialMobxStore from './mobxStore/initial'
import 'react-leaflet-markercluster/dist/styles.min.css'

const run = async () => {
  try {
    // prevent changing values in number inputs when scrolling pages!
    // see: http://stackoverflow.com/a/38589039/712005
    // and: https://stackoverflow.com/a/42058469/712005
    document.addEventListener('wheel', function(event) {
      if (window.document.activeElement.type === 'number') {
        event.preventDefault()
      }
    })

    const idb = initializeIdb()

    const initialMobxStore = await createInitialMobxStore({ idb })
    const mobxStore = MobxStore.create(initialMobxStore)

    const client = await buildClient({ idb, mobxStore })
    registerServiceWorker(mobxStore)

    await initiateDataFromUrl({
      mobxStore,
    })

    // begin _after_ initiation data from url
    mobxStore.history.listen((location, action) =>
      historyListen({
        location,
        action,
        mobxStore,
      }),
    )

    //onPatch(mobxStore, patch => console.log(patch))

    const idbContext = { idb }

    if (window.Cypress) {
      // enable directly using these in tests
      window.__client__ = client
      window.__store__ = mobxStore
      window.__idb__ = idb
    }

    ReactDOM.render(
      <IdbProvider value={idbContext}>
        <MobxProvider value={mobxStore}>
          <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
              <>
                <Print />
                <MuiThemeProvider theme={theme}>
                  <MuiPickersUtilsProvider
                    utils={MomentUtils}
                    moment={moment}
                    locale="de-ch"
                  >
                    <AppContainer />
                  </MuiPickersUtilsProvider>
                </MuiThemeProvider>
              </>
            </ApolloHooksProvider>
          </ApolloProvider>
        </MobxProvider>
      </IdbProvider>,
      document.getElementById('root'),
    )
  } catch (error) {
    console.log('Error in index.js:', error)
  }
}

run()
