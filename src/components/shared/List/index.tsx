import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router'
import Highlighter from 'react-highlight-words'

import { FormTitle } from '../FormTitle/index.tsx'
import { ErrorBoundary } from '../ErrorBoundary.tsx'
import { navData } from '../../Bookmarks/NavTo/Navs/Projects.tsx'
import { MobxContext } from '../../../mobxContext.ts'
import { prefetchRouteData } from '../../../modules/prefetchRouteData.ts'

import styles from './index.module.css'

export const List = ({
  navData,
  MenuBarComponent = null,
  menuBarProps = {},
  highlightSearchString,
}) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const store = useContext(MobxContext)

  const onClickRow = async (item) => {
    const path = `./${item.id}${search}`
    // Prefetch before navigating (in case user didn't hover)
    await prefetchRouteData({ path, store })
    navigate(path)
  }

  const onMouseEnterRow = (item) => {
    const path = `./${item.id}${search}`
    // Prefetch on hover
    prefetchRouteData({ path, store })
  }

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
                onMouseEnter={onMouseEnterRow.bind(this, item)}
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
