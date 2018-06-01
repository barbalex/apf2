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
import axios from 'axios'

import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import moment from 'moment'
import 'moment/locale/de-ch' // this is the important bit, you have to import the locale your'e trying to use.
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import { Provider } from 'mobx-react'
import { ApolloProvider } from 'react-apollo'

import app from 'ampersand-app'
import 'typeface-roboto'
import 'react-reflex/styles.css'
import createHistory from 'history/createBrowserHistory'

// import components
import store from './store'
import initializeIdb from './modules/initializeIdb'
import client from './client'

import initiateDataFromUrl from './modules/initiateDataFromUrl'

// service worker
import registerServiceWorker from './registerServiceWorker'

import apiBaseUrl from './modules/apiBaseUrl'
import AppContainer from './components/AppContainer'
import historyListen from './modules/historyListen'

import './index.css'

;(async () => {
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
    const myClient = await client(idb)
    registerServiceWorker(myClient)

    const history = createHistory()

    app.extend({
      init() {
        this.db = idb
        this.store = store
        this.client = myClient
        this.history = history
      },
    })
    app.init()

    // make store accessible in dev
    window.app = app

    axios.defaults.baseURL = apiBaseUrl

    await initiateDataFromUrl(store, myClient)

    // begin _after_ initiation data from url
    history.listen((location, action) =>
      historyListen({
        location,
        action,
      })
    )

    ReactDOM.render(
      <ApolloProvider client={myClient}>
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider
              utils={MomentUtils}
              moment={moment}
              locale="de-ch"
            >
              <AppContainer />
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </Provider>
      </ApolloProvider>,
      document.getElementById('root')
    )
  } catch (error) {
    console.log('Error in index.js:', error)
  }
})()
