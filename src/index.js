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
import MobxStore from './mobxStore'

import 'typeface-roboto'
import 'react-reflex/styles.css'
import createHistory from 'history/createBrowserHistory'

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
import { Provider as HistoryProvider } from './historyContext'

import './index.css'
import createInitialMobxStore from './mobxStore/initial'

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

    const history = createHistory()

    const idb = initializeIdb()

    const initialMobxStore = await createInitialMobxStore({ idb })
    const mobxStore = MobxStore.create(initialMobxStore)

    const client = await buildClient({ idb, history, mobxStore })
    registerServiceWorker(mobxStore)

    await initiateDataFromUrl({
      client,
      setUrlQuery: mobxStore.setUrlQuery,
      history,
    })

    // begin _after_ initiation data from url
    history.listen((location, action) =>
      historyListen({
        location,
        action,
        client,
      }),
    )

    const idbContext = { idb }
    const historyContext = { history }

    ReactDOM.render(
      <HistoryProvider value={historyContext}>
        <IdbProvider value={idbContext}>
          <MobxProvider value={mobxStore}>
            <ApolloProvider client={client}>
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
            </ApolloProvider>
          </MobxProvider>
        </IdbProvider>
      </HistoryProvider>,
      document.getElementById('root'),
    )
  } catch (error) {
    console.log('Error in index.js:', error)
  }
}

run()
