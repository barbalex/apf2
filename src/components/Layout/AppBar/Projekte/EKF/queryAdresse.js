import gql from 'graphql-tag'

import { adresse } from '../../../../shared/fragments'

export default gql`
  query ekfDataWithDateByAdresseIdForAppbarQuery($id: UUID!, $jahr: Int!) {
    adresseById(id: $id) {
      ...AdresseFields
      tpopkontrsByBearbeiter(
        filter: {
          or: [
            {
              typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
              jahr: { equalTo: $jahr }
            }
            {
              typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
              jahr: { isNull: true }
            }
          ]
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
