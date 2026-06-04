import { type SyntheticEvent } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import styles from './Title.module.css'

type TabValue =
  | 'ap'
  | 'pop'
  | 'tpop'
  | 'tpopmassn'
  | 'tpopfeldkontr'
  | 'tpopfreiwkontr'

const titleObject: Record<TabValue, string> = {
  ap: 'Art Filter',
  pop: 'Population Filter',
  tpop: 'Teil-Population Filter',
  tpopmassn: 'Massnahmen Filter',
  tpopfeldkontr: 'Feld-Kontrollen Filter',
  tpopfreiwkontr: 'Freiwilligen-Kontrollen Filter',
}

interface TitleProps {
  activeTab: TabValue
  setActiveTab: (tab: TabValue) => void
}

export const Title = ({ activeTab, setActiveTab }: TitleProps) => {
  const onChangeTab = (_event: SyntheticEvent, value: TabValue) =>
    setActiveTab(value)

  return (
    <div className={styles.container}>
      <div
        className={styles.title}
        data-id="form-title"
      >
        {titleObject[activeTab]}
      </div>
      <Tabs
        className={styles.tabs}
        value={activeTab}
        onChange={onChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          className={styles.tab}
          label="Art"
          value="ap"
          data-id="ap"
        />
        <Tab
          className={styles.tab}
          label="Pop"
          value="pop"
          data-id="pop"
        />
        <Tab
          className={styles.tab}
          label="T-Pop"
          value="tpop"
          data-id="tpop"
        />
        <Tab
          className={styles.tab}
          label="Massn"
          value="tpopmassn"
          data-id="tpopmassn"
        />
        <Tab
          className={styles.tab}
          label="EK"
          value="tpopfeldkontr"
          data-id="tpopfeldkontr"
        />
        <Tab
          className={styles.tab}
          label="EKF"
          value="tpopfreiwkontr"
          data-id="tpopfreiwkontr"
        />
      </Tabs>
    </div>
  )
}
