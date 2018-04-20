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

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import uiTheme from './modules/uiTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { Provider } from 'mobx-react'

import DevTools from 'mobx-react-devtools'

import styled from 'styled-components'

import app from 'ampersand-app'
import 'typeface-roboto'
import 'react-reflex/styles.css'

// import components
import store from './store'
import initializeDb from './modules/initializeDb'
import setLoginFromIdb from './store/action/setLoginFromIdb'
import Loading from './components/shared/Loading'

// service worker
import registerServiceWorker from './registerServiceWorker'

import apiBaseUrl from './modules/apiBaseUrl'
// turned off because of errors in production
//import updateFromSocket from './modules/updateFromSocket'

import './index.css'

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
const NewAp = Loadable({
  loader: () => import('./components/NewAp'),
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
const DownloadMessages = Loadable({
  loader: () => import('./components/DownloadMessages'),
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
    axios.interceptors.response.use(undefined, function(error) {
      if (error.response.status === 401) {
        console.log('axios interceptor found status 401')
        // need to empty user
        //store.user.token = null
        return store.logout()
      }
      return Promise.reject(error)
    })

    await setLoginFromIdb(store)

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
            <NewAp />
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
