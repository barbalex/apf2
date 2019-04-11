// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

import copyTo from './copyTo'

export default async ({
  popIdFrom,
  popIdTo,
  client,
  copying,
  store,
}: {
  popIdFrom: String,
  popIdTo: String,
  client: Object,
  copying: Object,
  store: Object,
}) => {
  // 1. fetch all tpops
  const { data } = await client.query({
    query: gql`
      query myquery($popId: UUID!) {
        allTpops(filter: { popId: { equalTo: $popId } }) {
          nodes {
            id
          }
        }
      }
    `,
    variables: { popId: popIdFrom },
  })
  const tpops = get(data, 'allTpops.nodes', [])

  // 2. add tpops to new pop
  tpops.forEach(tpop =>
    copyTo({
      parentId: popIdTo,
      table: 'tpop',
      id: tpop.id,
      client,
      copying,
      store,
    }),
  )
}
