import { gql } from '@apollo/client'

export default gql`
  query startjahrForPopStatus($apId: UUID!) {
    apById(id: $apId) {
      id
      startJahr
    }
  }
`
