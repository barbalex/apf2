import { gql } from '@apollo/client'

export default gql`
  query apByArtIdQuery($aeId: UUID!) {
    apByArtId(artId: $aeId) {
      id
    }
  }
`
