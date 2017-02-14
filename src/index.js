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
import injectTapEventPlugin from 'react-tap-event-plugin'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { Provider } from 'mobx-react'

import DevTools from 'mobx-react-devtools'

import styled from 'styled-components'

import app from 'ampersand-app'
import Dexie from 'dexie'
import tables from './modules/tables'

// import components
import store from './store'
// import styles from './app.css'  // eslint-disable-line no-unused-vars
import AppBar from './components/AppBar'
import Projekte from './components/Projekte'
import User from './components/User'
import Errors from './components/Errors'

import apiBaseUrl from './modules/apiBaseUrl'
import updateFromSocket from './modules/updateFromSocket'

// import appBaseUrl from './modules/appBaseUrl'

import './index.css';

// initiate idb
const tablesObject = {}
tables.forEach((t) => {
  if (t.table && t.idField) {
    tablesObject[t.table] = `${t.idField}`
  }
})
// add fields
tablesObject.fields = `[table_schema+table_name+column_name]`
// create table to save user name in
// this helps in that user can open new tab and remain logged in!
tablesObject.currentUser = `name`
const db = new Dexie(`apflora`)
db
  .version(1)
  .stores(tablesObject)

// const writeToStoreWorker = new Worker(`${appBaseUrl}/writeToStoreWorker.js`)
// writeToStoreWorker.postMessage(`test`)
// writeToStoreWorker.onmessage = e => console.log(`message received from writeToStoreWorker:`, e.data)

app.extend({
  init() {
    this.db = db
    this.store = store
    // this.writeToStoreWorker = writeToStoreWorker
  },
})
app.init()

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const theme = Object.assign({}, darkBaseTheme, {
  appBar: {
    height: 51,
  },
})

// make store accessible in dev
window.app = app
// window.app.writeToStoreWorker = writeToStoreWorker

store.setLoginFromIdb()
// load immediately because is used to validate active dataset
store.fetchFields()

const socket = window.io(apiBaseUrl)
socket.on(`tabelle_update`, payload => updateFromSocket(store, payload))

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider
      muiTheme={getMuiTheme(theme)}
    >
      <AppContainer>
        { false && <DevTools />}
        <AppBar />
        <Projekte />
        <User />
        <Errors />
      </AppContainer>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById(`root`)
)
