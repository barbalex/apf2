import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'

import { initial as pop } from '../../../../store/Tree/DataFilter/pop'
import { MobxContext } from '../../../../mobxContext.js'

const Row = styled.div``
const Title = styled.div`
  margin-top: -8px;
  margin-bottom: -8px;
  font-size: 0.75em;
  padding-left: 10px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
`
const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const StyledTab = styled(Tab)`
  min-width: 70px !important;
  text-transform: none !important;
`

export const PopOrTabs = observer(({ activeTab, setActiveTab, dataFilter }) => {
  const store = useContext(MobxContext)
  const { dataFilterAddOr } = store.tree

  const lastFilterIsEmpty =
    Object.values(dataFilter[dataFilter.length - 1] ?? {}).filter(
      (v) => v !== null,
    ).length === 0

  const onChangeTab = (event, value) => {
    if (value > dataFilter.length - 1) {
      dataFilterAddOr({ table: 'pop', val: pop })
      setTimeout(() => setActiveTab(value), 0)
      return
    }
    setActiveTab(value)
  }

  return (
    <Row>
      <Title>Filter-Kriterien:</Title>
      <StyledTabs
        value={activeTab}
        onChange={onChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {dataFilter.map((filter, index) => (
          <StyledTab
            key={index}
            label={index + 1}
            value={index}
          />
        ))}
        <StyledTab
          key={dataFilter.length}
          label="oder"
          value={dataFilter.length}
          disabled={lastFilterIsEmpty}
        />
      </StyledTabs>
    </Row>
  )
})
