import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ekplan } from '../../../shared/fragments.ts'

export const mutationCreateEkplan = dynamicGql`
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
