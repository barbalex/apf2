import { useRef } from 'react'
import { Menu } from './Menu/index.tsx'
import { Transition } from 'react-transition-group'
import { useAtomValue } from 'jotai'

import { Label } from './Label.tsx'
import { showBookmarksMenuAtom } from '../../../store/index.ts'

import styles from './index.module.css'

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const Bookmark = ({ navData, in: inProp }) => {
  const showBookmarksMenu = useAtomValue(showBookmarksMenuAtom)

  const outerContainerRef = useRef(null)
  const labelRef = useRef(null)

  // don't add tooltip on mobile as longpress opens menu
  return (
    <Transition
      in={inProp}
      timeout={700}
      mountOnEnter
      unmountOnExit
      nodeRef={labelRef}
    >
      {(state) => (
        <div
          className={styles.outerContainer}
          ref={outerContainerRef}
        >
          <div
            className={styles.container}
            style={{ paddingRight: showBookmarksMenu ? 'unset' : '15px' }}
          >
            <Label
              navData={navData}
              outerContainerRef={outerContainerRef}
              ref={labelRef}
              labelStyle={transitionStyles[state]}
            />
            {!!navData.menus && showBookmarksMenu && <Menu navData={navData} />}
          </div>
        </div>
      )}
    </Transition>
  )
}
