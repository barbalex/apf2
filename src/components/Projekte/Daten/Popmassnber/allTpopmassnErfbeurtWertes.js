import gql from 'graphql-tag'

import { tpopmassnErfbeurtWerte } from '../../../shared/fragments'

export default gql`
  query AllTpopmassnErfbeurtWertesQuery {
    allTpopmassnErfbeurtWertes {
      nodes {
        ...TpopmassnErfbeurtWerteFields
      }
    }
  }
  ${tpopmassnErfbeurtWerte}
`
