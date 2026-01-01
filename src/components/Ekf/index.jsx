import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useQuery } from '@apollo/client/react'
import { sortBy } from 'es-toolkit'
import { SplitPane, Pane } from 'react-split-pane'

// when Karte was loaded async, it did not load,
// but only in production!
import { EkfList } from './List/index.jsx'
import { Component as Tpopfreiwkontr } from '../Projekte/Daten/Tpopfreiwkontr/index.jsx'
import { MobxContext } from '../../mobxContext.js'
import { dataByUserId as dataByUserIdGql } from './dataByUserId.js'
import { dataWithDateByUserId as dataWithDateByUserIdGql } from './dataWithDateByUserId.js'
import { Error } from '../shared/Error.jsx'

import { container, innerContainer, noDataContainer } from './index.module.css'

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

export const Component = observer(() => {
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
      navigate(`/Daten/Benutzer/${userId}/EKF/${ekfYear}/${ekf[0].id}${search}`)
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
      <div className={noDataContainer}>
        {`Für das Jahr ${ekfYear} existieren offenbar keine Erfolgskontrollen mit Ihnen als BearbeiterIn`}
      </div>
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
    <div className={container}>
      <SplitPane split="vertical">
        <Pane size="350px" minSize={100}>
          <EkfList ekf={ekf} />
        </Pane>
        {ekfId ? (
          <Pane>
            <Tpopfreiwkontr id={ekfId} />
          </Pane>
        ) : (
          <Pane>
            <div className={innerContainer} />
          </Pane>
        )}
      </SplitPane>
    </div>
  )
})
