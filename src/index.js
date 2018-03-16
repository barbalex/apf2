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

const AppBarAsync = Loadable({
  loader: () => import('./components/AppBar'),
  loading: Loading,
})
const ProjekteAsync = Loadable({
  loader: () => import('./components/Projekte'),
  loading: Loading,
})
const UserAsync = Loadable({
  loader: () => import('./components/User'),
  loading: Loading,
})
const NewApAsync = Loadable({
  loader: () => import('./components/NewAp'),
  loading: Loading,
})
const DeletionsAsync = Loadable({
  loader: () => import('./components/Deletions'),
  loading: Loading,
})
const ErrorsAsync = Loadable({
  loader: () => import('./components/Errors'),
  loading: Loading,
})
const UpdateAvailableAsync = Loadable({
  loader: () => import('./components/UpdateAvailable'),
  loading: Loading,
})
const MessagesAsync = Loadable({
  loader: () => import('./components/Messages'),
  loading: Loading,
})
const DownloadMessagesAsync = Loadable({
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
            <AppBarAsync />
            <ProjekteAsync />
            <UserAsync />
            <NewApAsync />
            <DeletionsAsync />
            <ErrorsAsync />
            <UpdateAvailableAsync />
            <MessagesAsync />
            <DownloadMessagesAsync />
          </AppContainer>
        </MuiThemeProvider>
      </Provider>,
      document.getElementById('root')
    )
  } catch (error) {
    console.log('Error in index.js:', error)
  }
})()
