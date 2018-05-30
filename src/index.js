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
import gql from 'graphql-tag'

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
import getActiveNodeArrayFromPathname from './modules/getActiveNodeArrayFromPathname'

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
    
    const idb = initializeIdb()
    const myClient = await client(idb)

    const history = createHistory()
    history.listen((location, action) => {
      // location is an object like window.location
      console.log(action, location.pathname, location.state)
      const activeNodeArray = getActiveNodeArrayFromPathname(location.pathname.replace('/', ''))
      myClient.mutate({
        mutation: gql`
          mutation setTreeKey($value: Array!, $tree: String!, $key: String!) {
            setTreeKey(tree: $tree, key: $key, value: $value) @client {
              tree @client {
                name
                activeNodeArray
                openNodes
                apFilter
                nodeLabelFilter
                __typename: Tree
              }
            }
          }
        `,
        variables: {
          value: activeNodeArray,
          tree: 'tree',
          key: 'activeNodeArray'
        }
      })
    })

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
