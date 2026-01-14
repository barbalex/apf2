import { gql } from '@apollo/client'

import { tpopmassn } from '../../components/shared/fragments.ts'

export const updateTpopmassnById = gql`
  mutation updateTpopmassnById($id: UUID!, $tpopId: UUID) {
    updateTpopmassnById(
      input: { id: $id, tpopmassnPatch: { tpopId: $tpopId } }
    ) {
      tpopmassn {
        ...TpopmassnFields
      }
    }
  }
  ${tpopmassn}
`
