import { gql } from '@apollo/client'

export const queryApsToChoose = gql`
  query ekPlanChooseApsQuery($filter: ApFilter!) {
    allAps(first: 8, filter: $filter, orderBy: LABEL_ASC) {
      nodes {
        value: id
        label
      }
    }
  }
`
