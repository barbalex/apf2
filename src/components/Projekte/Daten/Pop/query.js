import gql from 'graphql-tag'

import { pop } from '../../../shared/fragments'

export default gql`
  query popByIdQuery($id: UUID!) {
    popById(id: $id) {
      ...PopFields
      apByApId {
        id
        startJahr
      }
    }
  }
  ${pop}
`
