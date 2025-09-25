import {
  ApolloClient,
  InMemoryCache,
  defaultDataIdFromObject,
  ApolloLink,
  CombinedGraphQLErrors,
} from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { setContext } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename'
import { jwtDecode } from 'jwt-decode'
import { uniqBy } from 'es-toolkit'

import { graphQlUri } from './modules/graphQlUri.js'
import { existsPermissionError } from './modules/existsPermissionError.js'
import { existsTooLargeError } from './modules/existsTooLargeError.js'

const cleanTypeNameLink = new RemoveTypenameFromVariablesLink()

export const buildApolloClient = ({ store }) => {
  const { enqueNotification } = store

  // TODO: use new functionality
  // https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/?mc_cid=e593721cc7&mc_eid=c8e91f2f0a#apollo-link-and-apollo-link-http
  const authLink = setContext((_, { headers }) => {
    const { token } = store.user
    if (token) {
      const tokenDecoded = jwtDecode(token)
      // for unknown reason, date.now returns three more after comma
      // numbers than the exp date contains
      const tokenIsValid = tokenDecoded.exp > Date.now() / 1000
      if (tokenIsValid) {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        }
      }
    }
    return { headers }
  })

  const errorLink = new ErrorLink(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
      const graphQLErrorsToShow = error.errors.filter(({ message, path }) => {
        if (
          path &&
          path.includes('historize') &&
          message &&
          message.includes('Unique-Constraint')
        ) {
          return false
        }
        return true
      })
      const uniqueQraphQLErrors = uniqBy(graphQLErrorsToShow, (e) => e.message)
      if (uniqueQraphQLErrors) {
        /**
         * TODO
         * Test this at night
         * make sure message is what is wanted by logging it out
         */
        if (existsPermissionError(uniqueQraphQLErrors)) {
          // DO NOT notify
          // The User component will open and let user log in
          return
          // DO NOT logout here:
          // logout reloads the window
          // this must be controlled by the User component inside Daten
          // otherwise UI keeps reloading forever!
        }
        if (existsTooLargeError(uniqueQraphQLErrors)) {
          // could be a too large ktZh geojson file being passed in mapFilter
          store.tree.setMapFilter(undefined)
        }
        uniqueQraphQLErrors.map(({ message, locations, path }) => {
          console.log(
            `apollo client GraphQL error: Message: ${message}, Location: ${JSON.stringify(
              locations,
            )}, Path: ${path}`,
          )
          return enqueNotification({
            message: `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
              locations,
            )}, Path: ${path}`,
            options: {
              variant: 'error',
            },
          })
        })
      }
    }
    if (error) {
      console.log(`apollo client Network error:`, error.message)
      enqueNotification({
        message: `apollo client Network error: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
  })

  const cache = new InMemoryCache({
    dataIdFromObject: (object) => {
      if (object.__typename?.toLowerCase()?.includes('history')) {
        return `${object.id}/${object.year}`
      }
      // BEWARE: the following functions/types use existing id's as their id
      // thus once loaded apollo will replace the existing models in the cache with their data
      // this will cause hard to solve issues
      // so need to force default data id that combines __typename with id
      if (
        [
          'JberAbc',
          'JberAktPop',
          'QPopOhnePopmassnber',
          'QApMitAktuellenKontrollenOhneZielrelevanteEinheit',
          'QTpopMitAktuellenKontrollenOhneZielrelevanteEinheit',
          'QTpopMitAktuellenAnpflanzungenOhneZielrelevanteEinheit',
          'QPopOhnePopber',
          'QTpopOhneMassnber',
          'QTpopOhneTpopber',
          'QTpopCountedEinheitMultipleTimesInYear',
          'VQApMitAktuellenKontrollenOhneZielrelevanteEinheit',
          'VQEkzieleinheitOhneMassnZaehleinheit',
          'VQPopBekanntseitNichtAeltestetpop',
          'VQPopPopnrmehrdeutig',
          'VQPopMitBerZunehmendOhneTpopberZunehmend',
          'VQPopMitBerAbnehmendOhneTpopberAbnehmend',
          'VQPopMitBerErloschenOhneTpopberErloschen',
          'VQPopMitBerErloschenUndTpopberNichtErloschen',
          'VQPopOhnetpopmitgleichemstatus',
          'VQPopStatus300Tpopstatusanders',
          'VQPopStatus201Tpopstatusunzulaessig',
          'VQPopStatus202Tpopstatusanders',
          'VQPopStatus200Tpopstatusunzulaessig',
          'VQPopStatus101Tpopstatusanders',
          'VQPopStatuserloschenletzterpopberzunehmend',
          'VQPopStatuserloschenletzterpopberstabil',
          'VQPopStatuserloschenletzterpopberabnehmend',
          'VQPopStatuserloschenletzterpopberunsicher',
          'VQPopKoordentsprechenkeinertpop',
          'VQPopStatusansaatversuchmitaktuellentpop',
          'VQPopStatusansaatversuchalletpoperloschen',
          'VQPopStatusansaatversuchmittpopursprerloschen',
          'VQPopStatuserloschenmittpopaktuell',
          'VQPopStatuserloschenmittpopansaatversuche',
          'VQPopUrspruenglichWiederauferstanden',
          'VQPopStatusangesiedeltmittpopurspruenglich',
          'VQPopStatusaktuellletzterpopbererloschen',
          'VQPopStatuserloschenletzterpopberaktuell',
          'VQPopStatuserloschenletzterpopbererloschenmitansiedlung',
          'VQTpopBekanntseitJuengerAlsAeltesteBeob',
          'VQTpopStatusaktuellletztertpopbererloschen',
          'VQTpopStatuserloschenletztertpopberstabil',
          'VQTpopStatuserloschenletztertpopberabnehmend',
          'VQTpopStatuserloschenletztertpopberunsicher',
          'VQTpopStatuserloschenletztertpopberzunehmend',
          'VQTpopStatuserloschenletzterpopberaktuell',
          'VQTpopStatuserloschenletztertpopbererloschenmitansiedlung',
          'VQTpopErloschenMitEkplanNachLetztemTpopber',
          'VQTpopErloschenundrelevantaberletztebeobvor1950',
          'VQTpopPopnrtpopnrmehrdeutig',
          'VQTpopMitstatusansaatversuchundzaehlungmitanzahl',
          'VQTpopMitstatuspotentiellundzaehlungmitanzahl',
          'VQTpopMitstatuspotentiellundmassnansiedlung',
          'VQAnpflanzungOhneZielrelevanteEinheit',
          'VQAnpflanzungZielrelevanteEinheitFalsch',
          'VQAnpflanzungZielrelevanteAnzahlFalsch',
          'VEkPlanungNachAbrechnungstyp',
          'VBeobArtChanged',
          'VBeobNichtZuzuordnen',
          'VBeobZugeordnet',
          'VKontrzaehlAnzproeinheit',
          'VTpopkontrWebgisbun',
          'VMassnWebgisbun',
          'VPopMitLetzterPopmassnber',
          'VTpopLastCountWithMassn',
          'VTpopOhneapberichtrelevant',
          'VTpopOhnebekanntseit',
          'VTpopPopberundmassnber',
          'VTpopWebgisbun',
          'TpopOutsideZhForAp',
        ].includes(object.__typename)
      ) {
        return defaultDataIdFromObject(object)
      }
      if (object.id && isNaN(object.id)) {
        return object.id
      }
      return defaultDataIdFromObject(object)
    },
  })

  const batchHttpLink = new BatchHttpLink({
    uri: graphQlUri(),
    // remove after debugging
    // batchMax: 1,
  })
  const client = new ApolloClient({
    link: ApolloLink.from([
      cleanTypeNameLink,
      errorLink,
      authLink,
      batchHttpLink,
    ]),
    cache,
    defaultOptions: { fetchPolicy: 'cache-and-network' },
  })
  // make client available in store
  store.setApolloClient(client)
  return client
}
