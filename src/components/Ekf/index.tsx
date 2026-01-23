import { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
import { sortBy } from 'es-toolkit'
import { useAtomValue } from 'jotai'
import { SplitPane, Pane } from 'react-split-pane'

import { isPrintAtom, isEkfSinglePrintAtom } from '../../store/index.ts'

import type { UserId } from '../../models/apflora/User.ts'
import type { AdresseId } from '../../models/apflora/Adresse.ts'
import type { TpopkontrId } from '../../models/apflora/Tpopkontr.ts'
import type { TpopId } from '../../models/apflora/Tpop.ts'
import type { PopId } from '../../models/apflora/Pop.ts'
import type { ApId } from '../../models/apflora/Ap.ts'
import type { ProjektId } from '../../models/apflora/Projekt.ts'
import type { AeTaxonomyId } from '../../models/apflora/AeTaxonomy.ts'

// when Karte was loaded async, it did not load,
// but only in production!
import { EkfList } from './List/index.tsx'
import { Component as Tpopfreiwkontr } from '../Projekte/Daten/Tpopfreiwkontr/index.tsx'
import { dataByUserId as dataByUserIdGql } from './dataByUserId.ts'
import { dataWithDateByUserId as dataWithDateByUserIdGql } from './dataWithDateByUserId.ts'

import styles from './index.module.css'

interface AeTaxonomyNode {
  id: AeTaxonomyId
  artname: string | null
}

interface ProjektNode {
  id: ProjektId
  name: string | null
}

interface ApNode {
  id: ApId
  aeTaxonomyByArtId: AeTaxonomyNode | null
  projektByProjId: ProjektNode | null
}

interface PopNode {
  id: PopId
  nr: number | null
  name: string | null
  apByApId: ApNode | null
}

interface TpopNode {
  id: TpopId
  nr: number | null
  flurname: string | null
  gemeinde: string | null
  popByPopId: PopNode | null
}

interface TpopkontrNode {
  id: TpopkontrId
  datum: string | null
  tpopByTpopId: TpopNode | null
}

interface AdresseNode {
  id: AdresseId
  tpopkontrsByBearbeiter: {
    nodes: TpopkontrNode[]
  } | null
}

interface UserNode {
  id: UserId
  adresseByAdresseId: AdresseNode | null
}

interface EkfQueryResult {
  userById: UserNode | null
}

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

export const Component = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { userId, ekfId, ekfYear } = useParams()
  const isPrint = useAtomValue(isPrintAtom)
  const isEkfSinglePrint = useAtomValue(isEkfSinglePrintAtom)
  const apolloClient = useApolloClient()

  const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
  const ekfRefYear = new Date(ekfRefDate).getFullYear()

  const query =
    ekfRefYear === ekfYear ? dataByUserIdGql : dataWithDateByUserIdGql

  const { data } = useQuery({
    queryKey: ['ekf', userId, ekfYear],
    queryFn: async () => {
      const result = await apolloClient.query<EkfQueryResult>({
        query,
        variables: { id: userId, jahr: +ekfYear },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const ekf = getEkfFromData({ data: data?.data })

  useEffect(() => {
    // navigate to first kontrId so form is shown for first ekf
    // IF none is choosen yet
    if (ekf.length > 0 && !ekfId) {
      navigate(`/Daten/Benutzer/${userId}/EKF/${ekfYear}/${ekf[0].id}${search}`)
    }
    // adding ekf as dependency causes infinite loop
    // https://github.com/barbalex/apf2/issues/629
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ekfYear, ekfId, navigate, userId, search])

  if (ekf.length === 0) {
    return (
      <div className={styles.noDataContainer}>
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
          <Tpopfreiwkontr
            id={e.id}
            key={e.id}
          />
        ))}
      </>
    )
  }

  return (
    <div className={styles.container}>
      <SplitPane split="vertical">
        <Pane
          size="350px"
          minSize={100}
        >
          <EkfList ekf={ekf} />
        </Pane>
        {ekfId ?
          <Pane>
            <Tpopfreiwkontr id={ekfId} />
          </Pane>
        : <Pane>
            <div className={styles.innerContainer} />
          </Pane>
        }
      </SplitPane>
    </div>
  )
}
