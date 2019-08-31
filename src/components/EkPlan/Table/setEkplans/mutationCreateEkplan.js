import gql from 'graphql-tag'

import { ekplan } from '../../../shared/fragments'

export default gql`
  mutation createEkplanMutation($tpopId: UUID!, $jahr: Int!, $typ: EkType!) {
    createEkplan(
      input: { ekplan: { tpopId: $tpopId, jahr: $jahr, typ: $typ } }
    ) {
      ekplan {
        ...EkplanFields
      }
    }
  }
  ${ekplan}
`
