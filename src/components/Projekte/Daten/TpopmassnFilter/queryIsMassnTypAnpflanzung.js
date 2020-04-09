import gql from 'graphql-tag'

export default gql`
  query TpopmassnFilterIsTDypAnpflanzungQuery($typ: Int!) {
    allTpopmassnTypWertes(filter: { code: { equalTo: $typ } }) {
      nodes {
        id
        anpflanzung
      }
    }
  }
`
