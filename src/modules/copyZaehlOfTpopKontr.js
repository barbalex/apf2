// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'
import app from 'ampersand-app'

import copyTo from './copyTo'

export default async ({
  tpopkontrIdFrom,
  tpopkontrIdTo,
  refetchTree,
}: {
  tpopkontrIdFrom: String,
  tpopkontrIdTo: String,
  refetchTree: () => void,
}) => {
  // 1. fetch all tpopkontrzaehl
  const { data } = await app.client.query({
    query: gql`
      query myquery($tpopkontrId: UUID!) {
        allTpopkontrzaehls(filter: { tpopkontrId: { equalTo: $tpopkontrId } }) {
          nodes {
            id
            anzahl
            einheit
            methode
          }
        }
      }
    `,
    variables: { tpopkontrId: tpopkontrIdFrom },
  })
  const tpopkontrzaehl = get(data, 'allTpopkontrzaehls.nodes', [])
  // 2. add tpopkontrzaehl to new tpopkontr
  tpopkontrzaehl.forEach(zaehl =>
    copyTo({
      parentId: tpopkontrIdTo,
      table: 'tpopkontrzaehl',
      id: zaehl.id,
      refetchTree,
    }),
  )
}
