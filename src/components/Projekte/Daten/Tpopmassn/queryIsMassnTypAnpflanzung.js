import { gql } from '@apollo/client'

export default gql`
  query TpopmassnIsTDypAnpflanzungQuery($typ: Int!) {
    allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
      nodes {
        id
        anpflanzung
      }
    }
  }
`
