// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import upperFirst from 'lodash/upperFirst'
import Button from '@material-ui/core/Button'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from '../Karte'
import ErrorBoundary from '../../shared/ErrorBoundary'
import queryAdresses from './adresses'
import queryUsers from './users'
import queryProjekts from './projekts'
import queryApberuebersichts from './apberuebersichts'
import queryAps from './aps'
import queryPops from './pops'
import queryPopbers from './popbers'
import queryPopmassnbers from './popmassnbers'
import queryTpops from './tpops'
import queryTpopmassns from './tpopmassns'
import queryTpopmassnbers from './tpopmassnbers'
import queryTpopfeldkontrs from './tpopfeldkontrs'
import queryTpopfreiwkontrs from './tpopfreiwkontrs'
import queryTpopkontrzaehls from './tpopkontrzaehls'
import queryTpopbers from './tpopbers'
import queryBeobZugeordnets from './beobZugeordnets'
import queryZiels from './ziels'
import queryZielbers from './zielbers'
import queryErfkrits from './erfkrits'
import queryApbers from './apbers'
import queryBers from './bers'
import queryIdealbiotops from './idealbiotops'
import queryAparts from './aparts'
import queryAssozarts from './assozarts'
import queryEkfzaehleinheits from './ekfzaehleinheits'
import queryBeobNichtBeurteilts from './beobNichtBeurteilts'
import queryBeobNichtZuzuordnens from './beobNichtZuzuordnens'
import TreeContainer from '../TreeContainer'
import Daten from '../Daten'
import Exporte from '../Exporte'
import buildNodes from '../TreeContainer/nodes'
import logout from '../../../modules/logout'
import buildVariables from './buildVariables'
import anyQueryReturnsPermissionError from '../../../modules/anyQueryReturnsPermissionError'
import anyQueryIsLoading from '../../../modules/anyQueryIsLoading'
import anyQueryReturnsError from '../../../modules/anyQueryReturnsError'
import mobxStoreContext from '../../../mobxStoreContext'
import idbContext from '../../../idbContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
  @media print {
    display: block;
    height: auto !important;
  }
`
const ErrorContainer = styled.div`
  padding: 15px;
`
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`

const enhance = compose(observer)

const ProjekteContainer = ({
  treeName,
  tabs: tabsPassed,
  projekteTabs,
}: {
  treeName: String,
  tabs: Array<String>,
  projekteTabs: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { nodeFilter, user, isPrint, setRefetchKey } = mobxStore
  const { setNodes } = mobxStore[treeName]
  const { idb } = useContext(idbContext)

  const {
    projekt,
    isProjekt,
    apFilter,
    //apFilterSet,
    ap,
    isAp,
    ziel,
    isZiel,
    pop,
    isPop,
    popFilter,
    tpop,
    isTpop,
    tpopFilter,
    tpopkontr,
    isTpopkontr,
    isWerteListen,
    isAdresse,
  } = buildVariables({
    treeName,
    mobxStore,
  })

  // use var to enable calling window['variable_name']
  var {
    data: dataAdresses,
    error: errorAdresses,
    loading: loadingAdresses,
  } = useQuery(queryAdresses, {
    suspend: false,
    variables: { isWerteListen, isAdresse },
  })
  var { data: dataUsers, error: errorUsers, loading: loadingUsers } = useQuery(
    queryUsers,
    {
      suspend: false,
    },
  )
  var {
    data: dataProjekts,
    error: errorProjekts,
    loading: loadingProjekts,
  } = useQuery(queryProjekts, {
    suspend: false,
  })
  var {
    data: dataApberuebersichts,
    error: errorApberuebersichts,
    loading: loadingApberuebersichts,
  } = useQuery(queryApberuebersichts, {
    suspend: false,
    variables: { isProjekt, projekt },
  })
  var { data: dataAps, error: errorAps, loading: loadingAps } = useQuery(
    queryAps,
    {
      suspend: false,
      variables: { isProjekt, apFilter },
    },
  )
  var { data: dataPops, error: errorPops, loading: loadingPops } = useQuery(
    queryPops,
    {
      suspend: false,
      variables: { isAp, popFilter },
    },
  )
  var {
    data: dataPopbers,
    error: errorPopbers,
    loading: loadingPopbers,
  } = useQuery(queryPopbers, {
    suspend: false,
    variables: { isPop, pop },
  })
  var {
    data: dataPopmassnbers,
    error: errorPopmassnbers,
    loading: loadingPopmassnbers,
  } = useQuery(queryPopmassnbers, {
    suspend: false,
    variables: { isPop, pop },
  })
  var { data: dataTpops, error: errorTpops, loading: loadingTpops } = useQuery(
    queryTpops,
    {
      suspend: false,
      variables: { isPop, tpopFilter },
    },
  )
  var {
    data: dataTpopmassns,
    error: errorTpopmassns,
    loading: loadingTpopmassns,
  } = useQuery(queryTpopmassns, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  var {
    data: dataTpopmassnbers,
    error: errorTpopmassnbers,
    loading: loadingTpopmassnbers,
  } = useQuery(queryTpopmassnbers, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  var {
    data: dataTpopfeldkontrs,
    error: errorTpopfeldkontrs,
    loading: loadingTpopfeldkontrs,
  } = useQuery(queryTpopfeldkontrs, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  var {
    data: dataTpopfreiwkontrs,
    error: errorTpopfreiwkontrs,
    loading: loadingTpopfreiwkontrs,
  } = useQuery(queryTpopfreiwkontrs, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  var {
    data: dataTpopkontrzaehls,
    error: errorTpopkontrzaehls,
    loading: loadingTpopkontrzaehls,
  } = useQuery(queryTpopkontrzaehls, {
    suspend: false,
    variables: { isTpopkontr, tpopkontr },
  })
  var {
    data: dataTpopbers,
    error: errorTpopbers,
    loading: loadingTpopbers,
  } = useQuery(queryTpopbers, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  var {
    data: dataBeobZugeordnets,
    error: errorBeobZugeordnets,
    loading: loadingBeobZugeordnets,
  } = useQuery(queryBeobZugeordnets, {
    suspend: false,
    variables: { isTpop, tpop },
  })
  var { data: dataZiels, error: errorZiels, loading: loadingZiels } = useQuery(
    queryZiels,
    {
      suspend: false,
      variables: { isAp, ap },
    },
  )
  var {
    data: dataZielbers,
    error: errorZielbers,
    loading: loadingZielbers,
  } = useQuery(queryZielbers, {
    suspend: false,
    variables: { isZiel, ziel },
  })
  var {
    data: dataErfkrits,
    error: errorErfkrits,
    loading: loadingErfkrits,
  } = useQuery(queryErfkrits, {
    suspend: false,
    variables: { isAp, ap },
  })
  var {
    data: dataApbers,
    error: errorApbers,
    loading: loadingApbers,
  } = useQuery(queryApbers, {
    suspend: false,
    variables: { isAp, ap },
  })
  var { data: dataBers, error: errorBers, loading: loadingBers } = useQuery(
    queryBers,
    {
      suspend: false,
      variables: { isAp, ap },
    },
  )
  var {
    data: dataIdealbiotops,
    error: errorIdealbiotops,
    loading: loadingIdealbiotops,
  } = useQuery(queryIdealbiotops, {
    suspend: false,
    variables: { isAp, ap },
  })
  var {
    data: dataAparts,
    error: errorAparts,
    loading: loadingAparts,
  } = useQuery(queryAparts, {
    suspend: false,
    variables: { isAp, ap },
  })
  var {
    data: dataAssozarts,
    error: errorAssozarts,
    loading: loadingAssozarts,
  } = useQuery(queryAssozarts, {
    suspend: false,
    variables: { isAp, ap },
  })
  var {
    data: dataEkfzaehleinheits,
    error: errorEkfzaehleinheits,
    loading: loadingEkfzaehleinheits,
  } = useQuery(queryEkfzaehleinheits, {
    suspend: false,
    variables: { isAp, ap },
  })
  var {
    data: dataBeobNichtBeurteilts,
    error: errorBeobNichtBeurteilts,
    loading: loadingBeobNichtBeurteilts,
    refetch: refetchBeobNichtBeurteilts,
  } = useQuery(queryBeobNichtBeurteilts, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'beobNichtBeurteilts',
    value: refetchBeobNichtBeurteilts,
  })
  var {
    data: dataBeobNichtZuzuordnens,
    error: errorBeobNichtZuzuordnens,
    loading: loadingBeobNichtZuzuordnens,
    refetch: refetchBeobNichtZuzuordnens,
  } = useQuery(queryBeobNichtZuzuordnens, {
    suspend: false,
    variables: { isAp, ap },
  })
  setRefetchKey({
    key: 'beobNichtZuzuordnens',
    value: refetchBeobNichtZuzuordnens,
  })

  const queryLoadingArray = [
    loadingAdresses,
    loadingUsers,
    loadingProjekts,
    loadingApberuebersichts,
    loadingAps,
    loadingPops,
    loadingPopbers,
    loadingPopmassnbers,
    loadingTpops,
    loadingTpopmassns,
    loadingTpopmassnbers,
    loadingTpopfeldkontrs,
    loadingTpopfreiwkontrs,
    loadingTpopkontrzaehls,
    loadingTpopbers,
    loadingBeobZugeordnets,
    loadingZiels,
    loadingZielbers,
    loadingErfkrits,
    loadingApbers,
    loadingBers,
    loadingIdealbiotops,
    loadingAparts,
    loadingAssozarts,
    loadingEkfzaehleinheits,
    loadingBeobNichtBeurteilts,
    loadingBeobNichtZuzuordnens,
  ]

  const queryErrorArray = [
    errorAdresses,
    errorUsers,
    errorProjekts,
    errorApberuebersichts,
    errorAps,
    errorPops,
    errorPopbers,
    errorPopmassnbers,
    errorTpops,
    errorTpopmassns,
    errorTpopmassnbers,
    errorTpopfeldkontrs,
    errorTpopfreiwkontrs,
    errorTpopkontrzaehls,
    errorTpopbers,
    errorBeobZugeordnets,
    errorZiels,
    errorZielbers,
    errorErfkrits,
    errorApbers,
    errorBers,
    errorIdealbiotops,
    errorAparts,
    errorAssozarts,
    errorEkfzaehleinheits,
    errorBeobNichtBeurteilts,
    errorBeobNichtZuzuordnens,
  ].filter(e => !!e)

  const loading = anyQueryIsLoading(queryLoadingArray)

  const refetch = query => {
    if (query && window[`data${upperFirst(query)}`]) {
      window[`data${upperFirst(query)}`].refetch()
    }
  }
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  //consoleconsole.log('ProjektContainer', { loading })

  const data = {
    ...dataAdresses,
    ...dataUsers,
    ...dataProjekts,
    ...dataApberuebersichts,
    ...dataAps,
    ...dataPops,
    ...dataPopbers,
    ...dataPopmassnbers,
    ...dataTpops,
    ...dataTpopmassns,
    ...dataTpopmassnbers,
    ...dataTpopfeldkontrs,
    ...dataTpopfreiwkontrs,
    ...dataTpopkontrzaehls,
    ...dataTpopbers,
    ...dataBeobZugeordnets,
    ...dataZiels,
    ...dataZielbers,
    ...dataErfkrits,
    ...dataApbers,
    ...dataBers,
    ...dataIdealbiotops,
    ...dataAparts,
    ...dataAssozarts,
    ...dataEkfzaehleinheits,
    ...dataBeobNichtBeurteilts,
    ...dataBeobNichtZuzuordnens,
  }
  // TODO: useMemo?
  const nodes = buildNodes({
    data,
    treeName,
    role,
    nodeFilter,
    dataAdresses,
    dataUsers,
    dataProjekts,
    dataApberuebersichts,
    dataAps,
    dataPops,
    dataPopbers,
    dataPopmassnbers,
    dataTpops,
    dataTpopmassns,
    dataTpopmassnbers,
    dataTpopfeldkontrs,
    dataTpopfreiwkontrs,
    dataTpopkontrzaehls,
    dataTpopbers,
    dataBeobZugeordnets,
    dataZiels,
    dataZielbers,
    dataErfkrits,
    dataApbers,
    dataBers,
    dataIdealbiotops,
    dataAparts,
    dataAssozarts,
    dataEkfzaehleinheits,
    dataBeobNichtBeurteilts,
    dataBeobNichtZuzuordnens,
    mobxStore,
  })
  setNodes(nodes)
  // remove 2 to treat all same
  const tabs = [...tabsPassed].map(t => t.replace('2', ''))
  const treeFlex =
    projekteTabs.length === 2 && tabs.length === 2
      ? 0.33
      : tabs.length === 0
      ? 1
      : 1 / tabs.length

  // TODO: which query to check for error?
  if (anyQueryReturnsPermissionError(queryErrorArray)) {
    // during login don't show permission error
    if (!token) return null
    // if token is not accepted, ask user to logout
    return (
      <ErrorContainer>
        <div>Ihre Anmeldung ist nicht mehr gültig.</div>
        <div>Bitte melden Sie sich neu an.</div>
        <LogoutButton
          variant="outlined"
          onClick={() => {
            logout(idb)
          }}
        >
          Neu anmelden
        </LogoutButton>
      </ErrorContainer>
    )
  }
  const error = anyQueryReturnsError(queryErrorArray)
  if (error) {
    return <ErrorContainer>{`Fehler: ${error.message}`}</ErrorContainer>
  }

  if (isPrint) {
    return <Daten treeName={treeName} refetchTree={refetch} role={role} />
  }

  return (
    <Container data-loading={loading}>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          {tabs.includes('tree') && (
            <ReflexElement flex={treeFlex}>
              <TreeContainer
                treeName={treeName}
                data={data}
                loading={loading}
                refetchTree={refetch}
              />
            </ReflexElement>
          )}
          {tabs.includes('tree') && tabs.includes('daten') && (
            <ReflexSplitter />
          )}
          {tabs.includes('daten') && (
            <ReflexElement
              propagateDimensions={true}
              renderOnResizeRate={100}
              renderOnResize={true}
            >
              <Daten treeName={treeName} refetchTree={refetch} role={role} />
            </ReflexElement>
          )}
          {tabs.includes('karte') &&
            (tabs.includes('tree') || tabs.includes('daten')) && (
              <ReflexSplitter />
            )}
          {tabs.includes('karte') && (
            <ReflexElement
              className="karte"
              propagateDimensions={true}
              renderOnResizeRate={200}
              renderOnResize={true}
            >
              <Karte
                treeName={treeName}
                data={data}
                refetchTree={refetch}
                loading={loading}
              />
            </ReflexElement>
          )}
          {tabs.includes('exporte') &&
            (tabs.includes('tree') ||
              tabs.includes('daten') ||
              tabs.includes('karte')) && <ReflexSplitter />}
          {tabs.includes('exporte') && (
            <ReflexElement>
              <Exporte />
            </ReflexElement>
          )}
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(ProjekteContainer)
