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
import Loadable from 'react-loadable'

import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import moment from 'moment'
import 'moment/locale/de-ch' // this is the important bit, you have to import the locale your'e trying to use.
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import { Provider } from 'mobx-react'
import { ApolloProvider } from 'react-apollo'

import styled from 'styled-components'

import app from 'ampersand-app'
import 'typeface-roboto'
import 'react-reflex/styles.css'
import createHistory from 'history/createBrowserHistory'

// import components
import store from './store'
import initializeIdb from './modules/initializeIdb'
import Loading from './components/shared/Loading'
import client from './client'

import initiateDataFromUrl from './modules/initiateDataFromUrl'

// service worker
import registerServiceWorker from './registerServiceWorker'

import apiBaseUrl from './modules/apiBaseUrl'

import './index.css'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const AppBar = Loadable({
  loader: () => import('./components/AppBar'),
  loading: Loading,
})
const Projekte = Loadable({
  loader: () => import('./components/Projekte'),
  loading: Loading,
})
const User = Loadable({
  loader: () => import('./components/User'),
  loading: Loading,
})
const Deletions = Loadable({
  loader: () => import('./components/Deletions'),
  loading: Loading,
})
const Errors = Loadable({
  loader: () => import('./components/Errors'),
  loading: Loading,
})
const UpdateAvailable = Loadable({
  loader: () => import('./components/UpdateAvailable'),
  loading: Loading,
})
const Messages = Loadable({
  loader: () => import('./components/Messages'),
  loading: Loading,
})
;(async () => {
  try {
    registerServiceWorker(store)

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

    app.extend({
      init() {
        this.db = idb
        this.store = store
        this.client = myClient
        this.history = createHistory()
      },
    })
    app.init()

    // make store accessible in dev
    window.app = app

    axios.defaults.baseURL = apiBaseUrl

    initiateDataFromUrl(store, myClient)

    ReactDOM.render(
      <ApolloProvider client={myClient}>
        <Provider store={store}>
          <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider
              utils={MomentUtils}
              moment={moment}
              locale="de-ch"
            >
              <AppContainer>
                <AppBar />
                <Projekte />
                <User />
                <Deletions />
                <Errors />
                <UpdateAvailable />
                <Messages />
              </AppContainer>
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
