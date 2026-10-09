import { useRef, type CSSProperties } from 'react'
import type { TransitionStatus } from 'react-transition-group'

import type { NavData } from '../types.ts'
import { Menu } from './Menu/index.tsx'
import { Transition } from 'react-transition-group'
import { useAtomValue } from 'jotai'

import { Label } from './Label.tsx'
import { showBookmarksMenuAtom } from '../../../store/index.ts'

import styles from './index.module.css'

const transitionStyles: Record<Exclude<TransitionStatus, 'unmounted'>, CSSProperties> = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const Bookmark = ({
  navData,
  in: inProp,
}: {
  navData: NavData
  in: boolean
}) => {
  const showBookmarksMenu = useAtomValue(showBookmarksMenuAtom)

  const outerContainerRef = useRef<HTMLDivElement | null>(null)
  const labelRef = useRef<HTMLDivElement | null>(null)

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
              labelStyle={state === 'unmounted' ? undefined : transitionStyles[state]}
            />
            {!!navData.menus && showBookmarksMenu && <Menu navData={navData} />}
          </div>
        </div>
      )}
    </Transition>
  )
}
