// @flow

import app from 'ampersand-app'
import isEqual from 'lodash/isEqual'

import getActiveNodeArrayFromPathname from '../../modules/getActiveNodeArrayFromPathname'

export default {
  Mutation: {
    setActiveNodeArray: (_, { value }, { cache }) => {
      // do not manipulate url if store is not yet initiated?
      //if (!store.initiated) return
      cache.writeData({
        data: {
          activeNodeArray: value
        } 
      })
      const activeNodeArrayFromUrl = getActiveNodeArrayFromPathname()
      if (!isEqual(activeNodeArrayFromUrl, value)) {
        app.history.push(`/${value.join('/')}`)
      }
      return null
    },
  },
}
