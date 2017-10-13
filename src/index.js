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

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import uiTheme from './modules/uiTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { Provider } from 'mobx-react'

import DevTools from 'mobx-react-devtools'

import styled from 'styled-components'

import app from 'ampersand-app'
import 'react-reflex/styles.css'

// import components
import store from './store'
import initializeDb from './modules/initializeDb'
import AppBar from './components/AppBar'
import Projekte from './components/Projekte'
import User from './components/User'
import Deletions from './components/Deletions'
import Errors from './components/Errors'
import UpdateAvailable from './components/UpdateAvailable'
import Messages from './components/Messages'
import DownloadMessages from './components/DownloadMessages'
import setLoginFromIdb from './store/action/setLoginFromIdb'
import initiateDataFromUrl from './modules/initiateDataFromUrl'

// service worker
import registerServiceWorker from './registerServiceWorker'

import apiBaseUrl from './modules/apiBaseUrl'
// turned off because of errors in production
//import updateFromSocket from './modules/updateFromSocket'

import './index.css'
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

    app.extend({
      init() {
        this.db = initializeDb()
        this.store = store
      },
    })
    app.init()

    const theme = Object.assign({}, uiTheme, {
      appBar: {
        height: 51,
      },
    })

    // make store accessible in dev
    window.app = app

    axios.defaults.baseURL = apiBaseUrl

    await setLoginFromIdb(store)

    // initiate activeNodeArray - but only if user is logged in
    const { user } = store
    if (user && user.name && user.role && user.token) {
      initiateDataFromUrl(store)
    }

    // turned off because of errors in production
    // const socket = window.io(apiBaseUrl)
    // socket.on('tabelle_update', payload => updateFromSocket(store, payload))

    const AppContainer = styled.div`
      display: flex;
      flex-direction: column;
    `

    ReactDOM.render(
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <AppContainer>
            {false && <DevTools />}
            <AppBar />
            <Projekte />
            <User />
            <Deletions />
            <Errors />
            <UpdateAvailable />
            <Messages />
            <DownloadMessages />
          </AppContainer>
        </MuiThemeProvider>
      </Provider>,
      document.getElementById('root')
    )
  } catch (error) {
    console.log('Error in index.js:', error)
  }
})()
