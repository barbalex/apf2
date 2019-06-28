import gql from 'graphql-tag'

export default gql`
  query ekPlanApsQuery($aps: [UUID!], $projId: UUID!) {
    allAps(
      filter: { id: { notIn: $aps }, projId: { equalTo: $projId } }
      orderBy: LABEL_ASC
    ) {
      nodes {
        id
        label
      }
    }
  }
`
