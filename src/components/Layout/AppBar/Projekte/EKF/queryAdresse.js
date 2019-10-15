import gql from 'graphql-tag'

import { adresse } from '../../../../shared/fragments'

export default gql`
  query ekfDataWithDateByAdresseIdForAppbarQuery($id: UUID!, $jahr: Int!) {
    adresseById(id: $id) {
      ...AdresseFields
      tpopkontrsByBearbeiter(
        filter: {
          typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
          jahr: { equalTo: $jahr }
        }
      ) {
        totalCount
        nodes {
          id
        }
      }
    }
  }
  ${adresse}
`
