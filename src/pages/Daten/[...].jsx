import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'

import Layout from '../../components/Layout'
import storeContext from '../../storeContext'
import Unterhalt from '../../components/Unterhalt'
import ErrorBoundary from '../../components/shared/ErrorBoundary'
import getActiveNodeArrayFromPathname from '../../modules/getActiveNodeArrayFromPathname'
import Header from '../../components/Head'
import DatenPageRouter from './_Router'

const DatenPage = ({ location }) => {
  const store = useContext(storeContext)
  const { setIsPrint, setEkfIds } = store
  const { activeNodeArray, setActiveNodeArray, setLastTouchedNode } = store.tree

  useEffect(() => {
    // set last touched node in case project is directly opened on it
    setLastTouchedNode(getSnapshot(activeNodeArray))
  }, [activeNodeArray, setLastTouchedNode])

  // when pathname changes, update activeNodeArray
  // seems no more needed?
  const { pathname } = location
  useEffect(() => {
    const newAna = getActiveNodeArrayFromPathname(pathname)
    if (!isEqual(newAna, activeNodeArray.slice())) {
      // user pushed back button > update activeNodeArray
      setActiveNodeArray(newAna, 'nonavigate')
    }
  }, [activeNodeArray, pathname, setActiveNodeArray])

  /**
   * In Firefox this does not work! Bug is open since 7 years:
   * see: https://bugzilla.mozilla.org/show_bug.cgi?id=774398
   * TODO: seems to have been solved 8.2022
   * BUT: regression: https://bugzilla.mozilla.org/show_bug.cgi?id=1800897
   */
  useEffect(() => {
    window.matchMedia('print').addListener((mql) => {
      setIsPrint(mql.matches)
      if (!mql.matches) setEkfIds([])
    })
    return () => {
      window.matchMedia('print').removeListener((mql) => {
        setIsPrint(mql.matches)
      })
    }
  }, [setEkfIds, setIsPrint])

  console.log('DatenPage rendering')

  // set unterhalt to true to show this page when servicing
  const unterhalt = false
  if (unterhalt) {
    return (
      <Layout>
        <Unterhalt />
      </Layout>
    )
  }

  // using render props on Layout to pass down appbarheight without using store
  return (
    <ErrorBoundary>
      <Layout>
        <DatenPageRouter />
      </Layout>
    </ErrorBoundary>
  )
}

export default observer(DatenPage)

export const Head = () => <Header />
