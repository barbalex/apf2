import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { tab, tabs, container, title } from './Title.module.css'

const titleObject = {
  ap: 'Art Filter',
  pop: 'Population Filter',
  tpop: 'Teil-Population Filter',
  tpopmassn: 'Massnahmen Filter',
  tpopfeldkontr: 'Feld-Kontrollen Filter',
  tpopfreiwkontr: 'Freiwilligen-Kontrollen Filter',
}

export const Title = ({ activeTab, setActiveTab }) => {
  const onChangeTab = (event, value) => setActiveTab(value)

  return (
    <div className={container}>
      <div
        className={title}
        data-id="form-title"
      >
        {titleObject[activeTab]}
      </div>
      <Tabs
        className={tabs}
        value={activeTab}
        onChange={onChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          className={tab}
          label="Art"
          value="ap"
          data-id="ap"
        />
        <Tab
          className={tab}
          label="Pop"
          value="pop"
          data-id="pop"
        />
        <Tab
          className={tab}
          label="T-Pop"
          value="tpop"
          data-id="tpop"
        />
        <Tab
          className={tab}
          label="Massn"
          value="tpopmassn"
          data-id="tpopmassn"
        />
        <Tab
          className={tab}
          label="EK"
          value="tpopfeldkontr"
          data-id="tpopfeldkontr"
        />
        <Tab
          className={tab}
          label="EKF"
          value="tpopfreiwkontr"
          data-id="tpopfreiwkontr"
        />
      </Tabs>
    </div>
  )
}
