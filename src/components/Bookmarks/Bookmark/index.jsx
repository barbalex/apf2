import { memo, useRef } from 'react'
import { Menu } from './Menu/index.jsx'
import styled from '@emotion/styled'

import { Label } from './Label.jsx'

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
    transition: background 0.2s linear;
    width: 2em;
    z-index: 1;
  }
  // TODO: change calculations if padding was changed (was 9+9)
  // now: per menu 7px more padding plus 15px on right
  padding-left: 25px;
  &:last-of-type {
    // border-left: 1.5px solid rgb(46, 125, 50);
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
  transition: background 0.2s linear;
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
    transition: background 0.2s linear;
    width: 2em;
    z-index: 1;
  }
  &::before {
    background: rgb(255, 253, 231);
    margin-left: 1px;
  }
`

export const Bookmark = memo(({ navData }) => {
  const ref = useRef(null)

  // don't add tooltip on mobile as longpress opens menu
  return (
    <OuterContainer ref={ref}>
      <Container>
        <Label
          navData={navData}
          outerContainerRef={ref}
        />
        {!!navData.menus && <Menu navData={navData} />}
      </Container>
    </OuterContainer>
  )
})
