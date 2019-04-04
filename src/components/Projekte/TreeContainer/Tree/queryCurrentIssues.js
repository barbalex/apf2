import gql from 'graphql-tag'

import { currentIssue } from '../../../shared/fragments'

export default gql`
  query CurrentIssuesDataQuery {
    allCurrentissues(orderBy: SORT_ASC) {
      nodes {
        ...CurrentIssueFields
      }
    }
  }
  ${currentIssue}
`
