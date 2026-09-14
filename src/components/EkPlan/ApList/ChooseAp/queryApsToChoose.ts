import { graphql } from '../../../../gql'

export const queryApsToChoose = graphql(`
  query ekPlanChooseApsQuery($filter: ApFilter!) {
    allAps(first: 8, filter: $filter, orderBy: LABEL_ASC) {
      nodes {
        value: id
        label
      }
    }
  }
`)
