import { memo, useRef } from 'react'
import { Menu } from './Menu/index.jsx'
import styled from '@emotion/styled'
import { Transition } from 'react-transition-group'

import { LabelWrapper } from './LabelWrapper.jsx'
const OuterContainer = styled.div`
  position: relative;
  &::after,
  &::before {
    background: rgb(255, 253, 231);
    bottom: 0;
    clip-path: polygon(50% 50%, -50% -50%, 0 100%);
    content: '';
    left: 100%;
    position: absolute;
    top: 0;
    transition: background 700ms linear;
    width: 2em;
    z-index: 1;
  }
  padding-left: 25px;
  &:last-of-type {
    padding-left: 10px;
  }
  &:first-of-type {
    margin-right: 15px;
  }
`
const Container = styled.div`
  margin-right: -10px;
  position: relative;
  border-collapse: collapse;
  transition: background 700ms linear;
  max-width: 45vw;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  &::after,
  &::before {
    background: rgb(46, 125, 50);
    bottom: 0;
    clip-path: polygon(50% 50%, -50% -50%, 0 100%);
    content: '';
    left: calc(100% - 8.3px);
    position: absolute;
    top: 0.5px;
    transition: background 700ms linear;
    width: 2em;
    z-index: 1;
  }
  &::before {
    background: rgb(255, 253, 231);
    margin-left: 1px;
  }
`
const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const Bookmark = memo(({ navData, in: inProp }) => {
  const outerContainerRef = useRef(null)
  const labelRef = useRef(null)

  console.log('Bookmark, inProp:', { inProp, labelRef })

  // don't add tooltip on mobile as longpress opens menu
  return (
    <Transition
      in={inProp}
      timeout={700}
      nodeRef={labelRef}
    >
      {(state) => {
        console.log('Bookmark, state:', state)
        return (
          <OuterContainer ref={outerContainerRef}>
            <Container>
              <LabelWrapper
                navData={navData}
                outerContainerRef={outerContainerRef}
                labelStyle={transitionStyles[state]}
                ref={labelRef}
              />
              {!!navData.menus && <Menu navData={navData} />}
            </Container>
          </OuterContainer>
        )
      }}
    </Transition>
  )
})
