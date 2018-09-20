// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'
import app from 'ampersand-app'

import copyTo from './copyTo'

export default async ({
  popIdFrom,
  popIdTo,
  refetchTree,
}: {
  popIdFrom: String,
  popIdTo: String,
  refetchTree: () => void,
}) => {
  // 1. fetch all tpops
  const { data } = await app.client.query({
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
      refetchTree,
    }),
  )
}
