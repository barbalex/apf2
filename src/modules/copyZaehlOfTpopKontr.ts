import { graphql } from '../gql'

import { copyTo } from './copyTo/index.ts'
import { store, apolloClientAtom } from '../store/index.ts'

export const copyZaehlOfTpopKontr = async ({
  tpopkontrIdFrom,
  tpopkontrIdTo,
}) => {
  const apolloClient = store.get(apolloClientAtom)
  // 1. fetch all tpopkontrzaehl
  const { data } = await apolloClient.query({
    query: graphql(`
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
    `),
    variables: { tpopkontrId: tpopkontrIdFrom },
  })
  const tpopkontrzaehl = data?.allTpopkontrzaehls?.nodes ?? []
  // 2. add tpopkontrzaehl to new tpopkontr
  tpopkontrzaehl.forEach((zaehl) =>
    copyTo({
      parentId: tpopkontrIdTo,
      table: 'tpopkontrzaehl',
      id: zaehl.id,
    }),
  )
}
