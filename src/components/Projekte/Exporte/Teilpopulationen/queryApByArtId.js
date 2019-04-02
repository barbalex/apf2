import gql from 'graphql-tag'

export default gql`
  query apByArtIdQuery($aeId: UUID!) {
    apByArtId(artId: $aeId) {
      id
    }
  }
`
