import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import ApAppBar from './Ap'
import EkPlanAppBar from './EkPlan'
import EkfPlanAppBar from './EKF'

const ProjekteAppBar = () => {
  const store = useContext(storeContext)
  const { view, tree } = store
  const { activeNodeArray } = tree

  const isEkPlan =
    activeNodeArray.length === 3 &&
    activeNodeArray[0] === 'Projekte' &&
    activeNodeArray[2] === 'EK-Planung'

  if (isEkPlan) return <EkPlanAppBar />
  if (view === 'ekf') return <EkfPlanAppBar />
  return <ApAppBar />
}

export default observer(ProjekteAppBar)
