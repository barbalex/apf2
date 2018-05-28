// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

import copyTo from './copyTo'

export default async ({
  tpopkontrIdFrom,
  tpopkontrIdTo,
  client,
  refetch
}: {
  tpopkontrIdFrom: String,
  tpopkontrIdTo: String,
  client: Object,
  refetch: () => void
}) => {
  // 1. fetch all tpopkontrzaehl
  const { data } = await client.query({
    query: gql`
      query myquery($tpopkontrId: UUID!) {
        allTpopkontrzaehls(filter: {tpopkontrId: {equalTo: $tpopkontrId}}) {
          nodes {
            id
            anzahl
            einheit
            methode
          }
        }
      }
    `,
    variables: { tpopkontrId: tpopkontrIdFrom }
  })
  const tpopkontrzaehl = get(data, 'allTpopkontrzaehls.nodes')
  // 2. add tpopkontrzaehl to new tpopkontr
  tpopkontrzaehl.forEach(zaehl =>
    copyTo({
      parentId: tpopkontrIdTo,
      table: 'tpopkontrzaehl',
      id: zaehl.id,
      client,
      refetch
    })
  )
}
