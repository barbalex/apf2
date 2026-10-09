import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpopkontrzaehl } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query TpopkontrzaehlQueryForEkZaehl($id: UUID!, $tpopkontrId: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
    allTpopkontrzaehlEinheitWertes(orderBy: SORT_ASC) {
      nodes {
        id
        value: code
        label: text
      }
    }
    allTpopkontrzaehlMethodeWertes(orderBy: SORT_ASC) {
      nodes {
        id
        value: code
        label: text
      }
    }
    otherZaehlOfEk: allTpopkontrzaehls(
      filter: {
        tpopkontrId: { equalTo: $tpopkontrId }
        id: { notEqualTo: $id }
      }
    ) {
      nodes {
        id
        einheit
      }
    }
  }
  ${tpopkontrzaehl}
`
