import { memo, useContext, useEffect } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useQuery } from '@apollo/client'
import sortBy from 'lodash/sortBy'

// when Karte was loaded async, it did not load,
// but only in production!
import { EkfList } from './List/index.jsx'
import { Component as Tpopfreiwkontr } from '../Projekte/Daten/Tpopfreiwkontr/index.jsx'
import { MobxContext } from '../../mobxContext.js'
import { StyledSplitPane } from '../shared/StyledSplitPane'
import { dataByUserId as dataByUserIdGql } from './dataByUserId.js'
import { dataWithDateByUserId as dataWithDateByUserIdGql } from './dataWithDateByUserId.js'
import { Error } from '../shared/Error.jsx'

const Container = styled.div`
  flex-grow: 0;
  overflow: hidden;

  .SplitPane {
    position: relative !important;
  }

  @media print {
    display: block;
    height: auto !important;
  }
`
const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
`
const NoDataContainer = styled.div`
  padding: 15px;
`

const getEkfFromData = ({ data }) => {
  const ekfNodes =
    data?.userById?.adresseByAdresseId?.tpopkontrsByBearbeiter?.nodes ?? []

  const ekf = ekfNodes.map((e) => ({
    projekt: e?.tpopByTpopId?.popByPopId?.apByApId?.projektByProjId?.name ?? '',
    projId: e?.tpopByTpopId?.popByPopId?.apByApId?.projektByProjId?.id,
    art:
      e?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
    apId: e?.tpopByTpopId?.popByPopId?.apByApId?.id,
    pop: `${e?.tpopByTpopId?.popByPopId?.nr ?? '(keine Nr)'}: ${
      e?.tpopByTpopId?.popByPopId?.name ?? '(kein Name)'
    }`,
    popId: e?.tpopByTpopId?.popByPopId?.id,
    popSort: e?.tpopByTpopId?.popByPopId?.nr ?? '(keine Nr)',
    tpop: `${e?.tpopByTpopId?.nr ?? '(keine Nr)'}: ${
      e?.tpopByTpopId?.flurname ?? '(kein Flurname)'
    }`,
    tpopId: e?.tpopByTpopId?.id,
    tpopSort: e?.tpopByTpopId?.nr ?? '(keine Nr)',
    id: e.id,
  }))

  return sortBy(ekf, ['projekt', 'art', 'popSort', 'tpopSort'])
}

export const Component = memo(
  observer(() => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const { userId, ekfId, ekfYear } = useParams()
    const { isPrint, isEkfSinglePrint } = useContext(MobxContext)

    const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
    const ekfRefYear = new Date(ekfRefDate).getFullYear()

    const query =
      ekfRefYear === ekfYear ? dataByUserIdGql : dataWithDateByUserIdGql

    const { data, loading, error } = useQuery(query, {
      variables: { id: userId, jahr: +ekfYear },
      fetchPolicy: 'network-only',
    })

    const ekf = getEkfFromData({ data })

    useEffect(() => {
      // navigate to first kontrId so form is shown for first ekf
      // IF none is choosen yet
      if (!loading && ekf.length > 0 && !ekfId) {
        console.log('Ekf, useEffect, navigating to first ekf')
        navigate(
          `/Daten/Benutzer/${userId}/EKF/${ekfYear}/${ekf[0].id}${search}`,
        )
      }
      // adding ekf as dependency causes infinite loop
      // https://github.com/barbalex/apf2/issues/629
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ekfYear, ekfId, navigate, userId, search, loading])

    if (error) {
      return <Error error={error} />
    }

    if (!loading && ekf.length === 0) {
      return (
        <NoDataContainer>
          {`Für das Jahr ${ekfYear} existieren offenbar keine Erfolgskontrollen mit Ihnen als BearbeiterIn`}
        </NoDataContainer>
      )
    }

    if (isPrint && isEkfSinglePrint) {
      return <Tpopfreiwkontr id={ekfId} />
    }

    if (isPrint && ekf.length > 0) {
      return (
        <>
          {ekf.map((e) => (
            <Tpopfreiwkontr id={e.id} key={e.id} />
          ))}
        </>
      )
    }

    return (
      <Container>
        <StyledSplitPane split="vertical" size="350px" minSize={100}>
          <EkfList ekf={ekf} />
          {ekfId ? <Tpopfreiwkontr id={ekfId} /> : <InnerContainer />}
        </StyledSplitPane>
      </Container>
    )
  }),
)
