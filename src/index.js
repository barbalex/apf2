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
import injectTapEventPlugin from 'react-tap-event-plugin'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import uiTheme from './modules/uiTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import {
  ApolloClient,
  createNetworkInterface,
  ApolloProvider,
} from 'react-apollo'
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
import Errors from './components/Errors'
import getActiveNodeArrayFromPathname from './store/action/getActiveNodeArrayFromPathname'
import getUrlQuery from './store/action/getUrlQuery'

// service worker
import registerServiceWorker from './registerServiceWorker'

// turned off because of errors in production
import apiBaseUrl from './modules/apiBaseUrl'
import updateFromSocket from './modules/updateFromSocket'

import './index.css'

registerServiceWorker()

// TODO: in production use other address
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:5000/graphiql',
})
const client = new ApolloClient({
  networkInterface: networkInterface,
})

// prevent changing values in number inputs when scrolling pages!
// see: http://stackoverflow.com/a/38589039/712005
document.addEventListener('mousewheel', function(event) {
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

// Needed for onTouchTap and material-ui
// //stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const theme = Object.assign({}, uiTheme, {
  appBar: {
    height: 51,
  },
})

// make store accessible in dev
window.app = app

store.setLoginFromIdb()
// load immediately because is used to validate active dataset
store.fetchFieldsFromIdb()

// turned off because of errors in production
const socket = window.io(apiBaseUrl)
socket.on('tabelle_update', payload => updateFromSocket(store, payload))

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`

// initiate activeNodeArray
const activeNodeArrayFromUrl = getActiveNodeArrayFromPathname()
store.tree.setActiveNodeArray(activeNodeArrayFromUrl)
store.tree.setLastClickedNode(activeNodeArrayFromUrl)
// need to set openNodes
store.tree.setOpenNodesFromActiveNodeArray()
// clone tree2 in case tree2 is open
store.tree.cloneActiveNodeArrayToTree2()
const urlQuery = getUrlQuery(window.location.search)
store.setUrlQuery(urlQuery)

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <AppContainer>
          {false && <DevTools />}
          <AppBar />
          <Projekte />
          <User />
          <Errors />
        </AppContainer>
      </MuiThemeProvider>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)
