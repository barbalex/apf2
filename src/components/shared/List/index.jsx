import { useNavigate, useLocation } from 'react-router'
import Highlighter from 'react-highlight-words'

import { FormTitle } from '../FormTitle/index.jsx'
import { ErrorBoundary } from '../ErrorBoundary.jsx'
import { navData } from '../../Bookmarks/NavTo/Navs/Projects.jsx'

import styles from './index.module.css'

export const List = ({
  navData,
  MenuBarComponent = null,
  menuBarProps = {},
  highlightSearchString,
}) => {
  const navigate = useNavigate()
  const { search } = useLocation()

  const onClickRow = (item) => navigate(`./${item.id}${search}`)

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title={navData.label}
          listFilter={navData.listFilter}
          MenuBarComponent={MenuBarComponent}
          menuBarProps={menuBarProps}
        />
        <div className={styles.list}>
          {navData.menus.map((item) => {
            const label = item.label ?? item.labelEkf ?? item.labelEk

            return (
              <div
                className={styles.row}
                key={item.id}
                onClick={onClickRow.bind(this, item)}
              >
                {!!item.labelLeftElements?.length &&
                  item.labelLeftElements.map((El, index) => <El key={index} />)}
                {highlightSearchString ?
                  <Highlighter
                    searchWords={[highlightSearchString]}
                    textToHighlight={label?.toString()}
                  />
                : label}
                {!!item.labelRightElements?.length &&
                  item.labelRightElements.map((El, index) => (
                    <El key={index} />
                  ))}
              </div>
            )
          })}
        </div>
      </div>
    </ErrorBoundary>
  )
}
