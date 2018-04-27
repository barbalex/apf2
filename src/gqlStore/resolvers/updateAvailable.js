// @flow
import gql from 'graphql-tag'

export default gql`
  mutation setUpdateAvailable($value: Boolean) {
    setUpdateAvailable(value: $value) @client {
      updateAvailable
    }
  }
`
