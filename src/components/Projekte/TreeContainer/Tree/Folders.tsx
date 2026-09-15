import { useRef } from 'react'
import { Transition } from 'react-transition-group'
import type { TransitionStatus } from 'react-transition-group'
import type { ComponentType } from 'react'

import type { TreeMenu } from './types.ts'

import styles from './Folders.module.css'

const transitionStyles: Partial<
  Record<TransitionStatus, { opacity: number }>
> = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

interface FoldersProps {
  // callers pass the navData as the menu prop
  menu?: TreeMenu | undefined
  navData?: TreeMenu | undefined
  in?: boolean | undefined
}

export const Folders = ({ navData, in: inProp }: FoldersProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  // self menu has no component
  const menus = (navData?.menus ?? []).filter(
    (m): m is TreeMenu & { component: ComponentType<{ menu: TreeMenu }> } =>
      !!m.component,
  )

  return (
    <Transition
      in={inProp}
      timeout={300}
      mountOnEnter
      unmountOnExit
      nodeRef={ref}
    >
      {(state) => (
        <div
          className={styles.container}
          ref={ref}
          style={transitionStyles[state]}
        >
          {menus.map((menu) => (
            <menu.component
              menu={menu}
              key={menu.id}
            />
          ))}
        </div>
      )}
    </Transition>
  )
}
