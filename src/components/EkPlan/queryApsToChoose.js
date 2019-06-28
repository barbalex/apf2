import gql from 'graphql-tag'

export default gql`
  query ekPlanQueryApsToChoose($ids: [UUID!]) {
    allAps(filter: { id: { notIn: $ids } }) {
      nodes {
        id
        aeEigenschaftenByArtId {
          id
          artname
        }
      }
    }
  }
`
