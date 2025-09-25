import { gql } from '@apollo/client'

import { copyTo } from './copyTo/index.js'

export const copyZaehlOfTpopKontr = async ({
  tpopkontrIdFrom,
  tpopkontrIdTo,
  client,
  store,
}) => {
  // 1. fetch all tpopkontrzaehl
  const { data } = await client.query({
    query: gql`
      query tpopkontrzaehlsForCopyZaehlOfTpopkontrQuery($tpopkontrId: UUID!) {
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
  const tpopkontrzaehl = data?.allTpopkontrzaehls?.nodes ?? []
  // 2. add tpopkontrzaehl to new tpopkontr
  tpopkontrzaehl.forEach((zaehl) =>
    copyTo({
      parentId: tpopkontrIdTo,
      table: 'tpopkontrzaehl',
      id: zaehl.id,
      apolloClient: client,
      store,
    }),
  )
}
