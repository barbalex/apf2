import React, { useRef, useContext, useCallback } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'
import { withStyles } from '@material-ui/core/styles'

import ApList from './ApList'
import Table from './Table'
import queryAps from './queryAps'
import storeContext from '../../storeContext'

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100vw;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  padding: 5px 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`
const ChooseContainer = styled.div`
  position: relative;
  flex-basis: 225px;
  flex-shrink: 0;
  flex-grow: 0;
  align-self: flex-start;
  justify-self: end;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 90px;
`
const ChooseTitle = styled.h5`
  position: relative;
  left: 4px;
  margin-bottom: 10px;
`
const Label = styled(FormControlLabel)`
  float: right;
  span {
    font-size: 0.75rem;
  }
`

// placing mateiral-ui checkboxes denser
// see: https://github.com/mui-org/material-ui/issues/6098#issuecomment-380451242
const DenserPrimaryAction = withStyles(theme => ({
  root: { margin: '-8px 2px -8px -4px' },
}))(props => <div className={props.classes.root}>{props.children}</div>)

const EkPlan = () => {
  const store = useContext(storeContext)
  const {
    aps,
    showEk,
    setShowEk,
    showEkf,
    setShowEkf,
    showCount,
    setShowCount,
    showEkCount,
    setShowEkCount,
    showMassn,
    setShowMassn,
  } = store.ekPlan

  const headerRef = useRef(null)

  const queryApsResult = useQuery(queryAps, {
    variables: {
      ids: aps.map(ap => ap.value),
    },
  })
  const einheitsByAp = groupBy(
    get(queryApsResult, 'data.allAps.nodes', []),
    'id',
  )
  Object.keys(einheitsByAp).forEach(
    apId =>
      (einheitsByAp[apId] = get(
        einheitsByAp[apId][0],
        'ekzaehleinheitsByApId.nodes',
        [],
      ).map(o => o.tpopkontrzaehlEinheitWerteByZaehleinheitId.code)),
  )
  const onChangeShowEk = useCallback(() => setShowEk(!showEk), [showEk])
  const onChangeShowEkf = useCallback(() => setShowEkf(!showEkf), [showEkf])
  const onChangeShowCount = useCallback(() => setShowCount(!showCount), [
    showCount,
  ])
  const onChangeShowEkCount = useCallback(() => setShowEkCount(!showEkCount), [
    showEkCount,
  ])
  const onChangeShowMassn = useCallback(() => setShowMassn(!showMassn), [
    showMassn,
  ])

  return (
    <ErrorBoundary>
      <Container>
        <Header ref={headerRef}>
          <ApList queryApsResult={queryApsResult} />
          <ChooseContainer>
            <ChooseTitle>anzeigen:</ChooseTitle>
            <Label
              control={
                <DenserPrimaryAction>
                  <Checkbox
                    checked={showEk}
                    onChange={onChangeShowEk}
                    color="primary"
                  />
                </DenserPrimaryAction>
              }
              label="EK"
              labelPlacement="start"
            />
            <Label
              control={
                <DenserPrimaryAction>
                  <Checkbox
                    checked={showEkf}
                    onChange={onChangeShowEkf}
                    color="primary"
                  />
                </DenserPrimaryAction>
              }
              label="EKF"
              labelPlacement="start"
            />
            <Label
              control={
                <DenserPrimaryAction>
                  <Checkbox
                    checked={showCount}
                    onChange={onChangeShowCount}
                    color="primary"
                  />
                </DenserPrimaryAction>
              }
              label="Zählungen"
              labelPlacement="start"
            />
            <Label
              control={
                <DenserPrimaryAction>
                  <Checkbox
                    checked={showMassn}
                    onChange={onChangeShowMassn}
                    color="primary"
                  />
                </DenserPrimaryAction>
              }
              label="Massnahmen"
              labelPlacement="start"
            />
            <Label
              control={
                <DenserPrimaryAction>
                  <Checkbox
                    checked={showEkCount}
                    onChange={onChangeShowEkCount}
                    color="primary"
                  />
                </DenserPrimaryAction>
              }
              label="mehrmals ausgeführt"
              labelPlacement="start"
            />
          </ChooseContainer>
        </Header>
        <Table einheitsByAp={einheitsByAp} />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
