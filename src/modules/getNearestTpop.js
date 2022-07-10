/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import { gql } from '@apollo/client'

const getNearestTpop = async ({ latLng, client, apId }) => {
  const { lat, lng } = latLng
  const { data } = await client.query({
    query: gql`
      query nearestTpopForApQuery($apId: UUID, $point: String) {
        nearestTpopForApFunction(apId: $apId, point: $point) {
          nodes {
            popId
            id
          }
        }
      }
    `,
    variables: {
      apId: apId || '99999999-9999-9999-9999-999999999999',
      point: `SRID=4326;POINT(${lng} ${lat})`,
    },
    fetchPolicy: 'no-cache',
  })
  const val = data?.nearestTpopForApFunction?.nodes?.[0]
  return val
}

export default getNearestTpop
