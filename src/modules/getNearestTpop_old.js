/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import { gql } from '@apollo/client'
import { tpop } from '../components/shared/fragments'

const getNearestTpop = async ({ latLng, client, apId }) => {
  const { lat, lng } = latLng
  const { data } = await client.query({
    query: gql`
      query nearestTpopForApQuery($apId: UUID, $point: String) {
        nearestTpopForApFunction(apId: $apId, point: $point) {
          nodes {
            ...TpopFields
          }
        }
      }
      ${tpop}
    `,
    variables: {
      apId: apId || '99999999-9999-9999-9999-999999999999',
      point: `SRID=4326;POINT(${lng} ${lat})`,
    },
    // WARNING: caching can lead to completely incomprehensible behavior where previous values are returned
    // https://github.com/barbalex/apf2/issues/536
    fetchPolicy: 'no-cache',
  })
  const val = data?.nearestTpopForApFunction?.nodes?.[0]
  return val
}

export default getNearestTpop
