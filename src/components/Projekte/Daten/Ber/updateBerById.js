import gql from 'graphql-tag'

export default gql`
  mutation updateBer(
    $id: UUID!
    $apId: UUID
    $autor: String
    $jahr: Int
    $titel: String
    $url: String
  ) {
    updateBerById(
      input: {
        id: $id
        berPatch: {
          id: $id
          apId: $apId
          autor: $autor
          jahr: $jahr
          titel: $titel
          url: $url
        }
      }
    ) {
      ber {
        id
        apId
        autor
        jahr
        titel
        url
      }
    }
  }
`
