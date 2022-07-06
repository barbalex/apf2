import uniq from 'lodash/uniq'
import isUuid from 'is-uuid'

import { simpleTypes as tpopmassnType } from '../../store/Tree/DataFilter/tpopmassn'
import { simpleTypes as tpopfeldkontrType } from '../../store/Tree/DataFilter/tpopfeldkontr'
import { simpleTypes as tpopfreiwkontrType } from '../../store/Tree/DataFilter/tpopfreiwkontr'

/**
 * returns a filter for every branch of the nav tree
 */

/**
 *
 * idea: build this in a psql function
 * pass in array of composite types (https://www.postgresql.org/docs/14/rowtypes.html)
 * composite type describes filter criteria:
 * - table
 * - field
 * - comparator
 * - value
 * - type
 * in function build sql query string with these filter criteria
 * TODO: how to deal with or?
 * - Solution: define the function as variadic and loop through all the composite type arrays,
 *   https://stackoverflow.com/a/32906179/712005
 */

const buildTreeQueryVariables = ({
  dataFilter,
  openNodes,
  nodeLabelFilter,
  popGqlFilter,
  tpopGqlFilter,
  apGqlFilter,
}) => {
  // apFilter is used for form nodeLabelFilter AND apFilter of tree :-(
  const isWerteListen = openNodes.some(
    (nodeArray) => nodeArray[0] === 'Werte-Listen',
  )
  const projekt = uniq(
    openNodes
      .map((a) => (a.length > 1 && a[0] === 'Projekte' ? a[1] : null))
      .filter((v) => v !== null)
      .filter((v) => isUuid.anyNonNil(v)),
  )

  const isProjekt = openNodes.some(
    (nArray) => nArray[0] === 'Projekte' && nArray[1],
  )

  const ap = uniq(
    openNodes
      .map((a) =>
        a.length > 3 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Arten'
          ? a[3]
          : null,
      )
      .filter((v) => v !== null)
      .filter((v) => isUuid.anyNonNil(v)),
  )
  const isAp =
    isProjekt && openNodes.some((nArray) => nArray[2] === 'Arten' && nArray[3])
  const ziel = uniq(
    openNodes
      .map((a) =>
        a.length > 7 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Arten' &&
        a[4] === 'AP-Ziele'
          ? a[6]
          : null,
      )
      .filter((v) => v !== null)
      .filter((v) => isUuid.anyNonNil(v)),
  )
  const isZiel =
    isAp &&
    openNodes.some(
      (nArray) => nArray[4] === 'AP-Ziele' && nArray[5] && nArray[6],
    )
  const pop = uniq(
    openNodes
      .map((a) =>
        a.length > 5 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Arten' &&
        a[4] === 'Populationen'
          ? a[5]
          : null,
      )
      .filter((v) => v !== null)
      .filter((v) => isUuid.anyNonNil(v)),
  )
  const isPop =
    isAp &&
    openNodes.some((nArray) => nArray[4] === 'Populationen' && nArray[5])

  const tpop = uniq(
    openNodes
      .map((a) =>
        a.length > 7 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Arten' &&
        a[4] === 'Populationen' &&
        a[6] === 'Teil-Populationen'
          ? a[7]
          : null,
      )
      .filter((v) => v !== null)
      .filter((v) => isUuid.anyNonNil(v)),
  )
  const isTpop =
    isPop &&
    openNodes.some((nArray) => nArray[6] === 'Teil-Populationen' && nArray[7])

  const tpopkontr = uniq(
    openNodes
      .map((a) =>
        a.length > 9 &&
        a[0] === 'Projekte' &&
        decodeURIComponent(a[2]) === 'Arten' &&
        a[4] === 'Populationen' &&
        a[6] === 'Teil-Populationen' &&
        ['Feld-Kontrollen', 'Freiwilligen-Kontrollen'].includes(a[8])
          ? a[9]
          : null,
      )
      .filter((v) => v !== null)
      .filter((v) => isUuid.anyNonNil(v)),
  )
  const isTpopkontr =
    isTpop &&
    openNodes.some(
      (nArray) =>
        ['Feld-Kontrollen', 'Freiwilligen-Kontrollen'].includes(nArray[8]) &&
        nArray[9],
    )

  const tpopfeldkontrFilter = {
    or: [
      { typ: { notEqualTo: 'Freiwilligen-Erfolgskontrolle' } },
      { typ: { isNull: true } },
    ],
    tpopId: { in: tpop },
  }
  const tpopfeldkontrFilterValues = Object.entries(
    dataFilter.tpopfeldkontr,
  ).filter((e) => e[1] || e[1] === 0)
  tpopfeldkontrFilterValues.forEach(([key, value]) => {
    const expression =
      tpopfeldkontrType[key] === 'string' ? 'includes' : 'equalTo'
    tpopfeldkontrFilter[key] = { [expression]: value }
  })
  if (nodeLabelFilter.tpopkontr) {
    tpopfeldkontrFilter.labelEk = {
      includesInsensitive: nodeLabelFilter.tpopkontr,
    }
  }

  const tpopfreiwkontrFilter = {
    typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' },
    tpopId: { in: tpop },
  }
  const tpopfreiwkontrFilterValues = Object.entries(
    dataFilter.tpopfreiwkontr,
  ).filter((e) => e[1] || e[1] === 0)
  tpopfreiwkontrFilterValues.forEach(([key, value]) => {
    const expression =
      tpopfreiwkontrType[key] === 'string' ? 'includes' : 'equalTo'
    tpopfreiwkontrFilter[key] = { [expression]: value }
  })
  if (nodeLabelFilter.tpopkontr) {
    tpopfreiwkontrFilter.labelEkf = {
      includesInsensitive: nodeLabelFilter.tpopkontr,
    }
  }

  const tpopmassnFilter = { tpopId: { in: tpop } }
  const tpopmassnFilterValues = Object.entries(dataFilter.tpopmassn).filter(
    (e) => e[1] || e[1] === 0,
  )
  tpopmassnFilterValues.forEach(([key, value]) => {
    const expression = tpopmassnType[key] === 'string' ? 'includes' : 'equalTo'
    tpopmassnFilter[key] = { [expression]: value }
  })

  const apsFilter = apGqlFilter
  const apberuebersichtsFilter = { projId: { in: projekt } }
  if (nodeLabelFilter.apberuebersicht) {
    apberuebersichtsFilter.label = {
      includesInsensitive: nodeLabelFilter.apberuebersicht,
    }
  }
  const apbersFilter = { apId: { in: ap } }
  if (nodeLabelFilter.apber) {
    apbersFilter.label = { includesInsensitive: nodeLabelFilter.apber }
  }
  const apartsFilter = { apId: { in: ap } }
  if (nodeLabelFilter.apart) {
    apartsFilter.label = { includesInsensitive: nodeLabelFilter.apart }
  }
  const assozartFilter = { apId: { in: ap } }
  if (nodeLabelFilter.assozart) {
    assozartFilter.label = {
      includesInsensitive: nodeLabelFilter.assozart,
    }
  }
  const beobNichtBeurteiltsFilter = {
    nichtZuordnen: { equalTo: false },
    apId: { in: ap },
    tpopId: { isNull: true },
  }
  if (nodeLabelFilter.beob) {
    beobNichtBeurteiltsFilter.label = {
      includesInsensitive: nodeLabelFilter.beob,
    }
  }
  const beobNichtZuzuordnensFilter = {
    nichtZuordnen: { equalTo: true },
    apId: { in: ap },
  }
  if (nodeLabelFilter.beob) {
    beobNichtZuzuordnensFilter.label = {
      includesInsensitive: nodeLabelFilter.beob,
    }
  }
  const beobZugeordnetsFilter = { tpopId: { in: tpop } }
  if (nodeLabelFilter.beob) {
    beobZugeordnetsFilter.label = {
      includesInsensitive: nodeLabelFilter.beob,
    }
  }
  const ekfrequenzsFilter = { apId: { in: ap } }
  if (nodeLabelFilter.ekfrequenz) {
    ekfrequenzsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekfrequenz,
    }
  }
  const ekzaehleinheitsFilter = { apId: { in: ap } }
  if (nodeLabelFilter.ekzaehleinheit) {
    ekzaehleinheitsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekzaehleinheit,
    }
  }
  const erfkritsFilter = { apId: { in: ap } }
  if (nodeLabelFilter.erfkrit) {
    erfkritsFilter.label = {
      includesInsensitive: nodeLabelFilter.erfkrit,
    }
  }
  const popbersFilter = { popId: { in: pop } }
  if (nodeLabelFilter.popber) {
    popbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popber,
    }
  }
  const popmassnbersFilter = { popId: { in: pop } }
  if (nodeLabelFilter.popmassnber) {
    popmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.popmassnber,
    }
  }
  const popsFilter = popGqlFilter.filtered
  const tpopbersFilter = { tpopId: { in: tpop } }
  if (nodeLabelFilter.tpopber) {
    tpopbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopber,
    }
  }
  const tpopfeldkontrsFilter = { ...tpopfeldkontrFilter }
  const tpopfreiwkontrsFilter = { ...tpopfreiwkontrFilter }

  const tpopkontrzaehlsFilter = {
    tpopkontrId: { in: tpopkontr },
  }
  if (nodeLabelFilter.tpopkontrzaehl) {
    tpopkontrzaehlsFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopkontrzaehl,
    }
  }
  const tpopmassnbersFilter = { tpopId: { in: tpop } }
  if (nodeLabelFilter.tpopmassnber) {
    tpopmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassnber,
    }
  }
  const tpopmassnsFilter = { ...tpopmassnFilter }
  if (nodeLabelFilter.tpopmassn) {
    tpopmassnsFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassn,
    }
  }
  const tpopsFilter = tpopGqlFilter.filtered
  const usersFilter = { id: { isNull: false } }
  if (nodeLabelFilter.user) {
    usersFilter.label = {
      includesInsensitive: nodeLabelFilter.user,
    }
  }
  const adressesFilter = nodeLabelFilter.adresse
    ? { label: { includesInsensitive: nodeLabelFilter.adresse } }
    : { id: { isNull: false } }
  const apberrelevantGrundWertesFilter = nodeLabelFilter.apberrelevantGrundWerte
    ? {
        label: {
          includesInsensitive: nodeLabelFilter.apberrelevantGrundWerte,
        },
      }
    : { id: { isNull: false } }
  const tpopkontrzaehlEinheitWertesFilter =
    nodeLabelFilter.tpopkontrzaehlEinheitWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.tpopkontrzaehlEinheitWerte,
          },
        }
      : { id: { isNull: false } }
  const ekAbrechnungstypWertesFilter = nodeLabelFilter.ekAbrechnungstypWerte
    ? {
        label: { includesInsensitive: nodeLabelFilter.ekAbrechnungstypWerte },
      }
    : { id: { isNull: false } }
  const zielbersFilter = { zielId: { in: ziel } }
  if (nodeLabelFilter.zielber) {
    zielbersFilter.label = {
      includesInsensitive: nodeLabelFilter.zielber,
    }
  }
  const zielsFilter = { apId: { in: ap } }
  if (nodeLabelFilter.ziel) {
    zielsFilter.label = {
      includesInsensitive: nodeLabelFilter.ziel,
    }
  }
  return {
    isProjekt,
    isAp,
    isPop,
    isTpop,
    isTpopkontr,
    isWerteListen,
    isZiel,
    apartsFilter,
    apbersFilter,
    apberuebersichtsFilter,
    apsFilter,
    assozartFilter,
    beobNichtBeurteiltsFilter,
    beobNichtZuzuordnensFilter,
    beobZugeordnetsFilter,
    ekfrequenzsFilter,
    ekzaehleinheitsFilter,
    erfkritsFilter,
    popbersFilter,
    popmassnbersFilter,
    popsFilter,
    tpopbersFilter,
    tpopfeldkontrsFilter,
    tpopfreiwkontrsFilter,
    tpopkontrzaehlsFilter,
    tpopmassnbersFilter,
    tpopmassnsFilter,
    tpopsFilter,
    usersFilter,
    adressesFilter,
    apberrelevantGrundWertesFilter,
    tpopkontrzaehlEinheitWertesFilter,
    ekAbrechnungstypWertesFilter,
    zielbersFilter,
    zielsFilter,
  }
}

export default buildTreeQueryVariables
