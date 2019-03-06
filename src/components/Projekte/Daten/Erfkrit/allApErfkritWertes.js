import gql from 'graphql-tag'

import { apErfkritWerte } from '../../../shared/fragments'

export default gql`
  query AllApErfkritWertesQuery {
    allApErfkritWertes {
      nodes {
        ...ApErfkritWerteFields
      }
    }
  }
  ${apErfkritWerte}
`
