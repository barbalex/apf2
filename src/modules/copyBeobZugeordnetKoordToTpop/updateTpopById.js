import gql from 'graphql-tag'

export default gql`
  mutation updateTpopById($id: UUID!, $geomPoint: GeometryPoint) {
    updateTpopById(input: { id: $id, tpopPatch: { geomPoint: $geomPoint } }) {
      tpop {
        id
        lv95X
        lv95Y
      }
    }
  }
`
