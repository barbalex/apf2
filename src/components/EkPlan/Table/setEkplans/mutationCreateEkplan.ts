import { gql } from '@apollo/client'

import { ekplan } from '../../../shared/fragments.js'

export const mutationCreateEkplan = gql`
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
