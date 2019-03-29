import gql from 'graphql-tag'

import { projekt } from '../../../shared/fragments'

export default gql`
  query ProjektsQuery {
    allProjekts(orderBy: NAME_ASC) {
      nodes {
        ...ProjektFields
      }
    }
  }
  ${projekt}
`
