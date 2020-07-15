import { gql } from '@apollo/client'

export default gql`
  query ekPlanChooseApsQuery($filter: ApFilter!) {
    allAps(first: 8, filter: $filter, orderBy: LABEL_ASC) {
      nodes {
        value: id
        label
      }
    }
  }
`
