import { memo, useMemo, useRef } from 'react'
import styled from '@emotion/styled'
import { Transition } from 'react-transition-group'

import { usePopNavData } from '../../../../../../../../../../../../modules/usePopNavData.js'
import { transitionStyles } from '../../../../../../../../Row.jsx'
import { Node } from '../../../../../../../../Node.jsx'
import { NodeWithList } from '../../../../../../../../NodeWithList.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const PopFolders = memo(({ menu, in: inProp }) => {
  const { navData } = usePopNavData(menu.fetcherParams)

  const tpopMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Teil-Populationen'),
    [navData.menus],
  )
  const popberMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Kontroll-Berichte'),
    [navData.menus],
  )
  const popmassnberMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Massnahmen-Berichte'),
    [navData.menus],
  )
  const auswertungMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Auswertung'),
    [navData.menus],
  )
  const dateienMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Dateien'),
    [navData.menus],
  )
  const historienMenu = useMemo(
    () => navData.menus.find((m) => m.id === 'Historien'),
    [navData.menus],
  )

  const ref = useRef(null)

  return (
    <Transition
      in={inProp}
      timeout={300}
      mountOnEnter
      unmountOnExit
      nodeRef={ref}
    >
      {(state) => (
        <Container ref={ref} style={transitionStyles[state]}>
          <NodeWithList menu={tpopMenu} />
          <NodeWithList menu={popberMenu} />
          <NodeWithList menu={popmassnberMenu} />
          <Node menu={auswertungMenu} />
          <Node menu={dateienMenu} />
          <Node menu={historienMenu} />
        </Container>
      )}
    </Transition>
  )
})
