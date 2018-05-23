// @flow
/**
 * This resolver works for all keys of exporte
 */
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import gql from 'graphql-tag'

export default {
  Mutation: {
    setExportKey: (_, { key, value }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              export @client {
                applyMapFilterToExport
                fileType
              }
            }
          `
      })
      const oldValue = get(data, `export.${key}`)
      // only write if changed
      if (!isEqual(oldValue, value)) {
        //console.log('resolver setExportKey:', {key, value})
        cache.writeData({
          data: {
            export: {
              applyMapFilterToExport: key === 'applyMapFilterToExport' ?
                value :
                get(data, 'export.applyMapFilterToExport', null),
              fileType: key === 'fileType' ?
                value :
                get(data, 'export.fileType', null),
              __typename: 'Export'
            }
          } 
        })
      }
      return null
    },
  },
}
