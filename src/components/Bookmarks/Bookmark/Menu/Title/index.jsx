import {
  memo,
  useState,
  useCallback,
  useMemo,
  useEffect,
  forwardRef,
} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'
import isUuid from 'is-uuid'
import { useResizeDetector } from 'react-resize-detector'

import { FilterInput } from './FilterInput.jsx'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
  margin-top: -8px;
  border-radius: 4px;
  min-width: ${(props) => props.minwidth}px;
`
const ContentWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  min-width: ${(props) => props.minwidth}px;
  background-color: white;
`
const MenuTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.6666667px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  font-weight: bold;
  min-height: 40px;
`
const TitleDiv = styled.div`
  padding: 0 16px;
  user-select: none;
  cursor: default;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
const StyledTooltip = styled(Tooltip)`
  margin-right: 16px;
  ${(props) => (props.show === 'true' ? '' : 'display: none;')}
`
const FilterWrapper = styled.div``

export const Title = memo(
  forwardRef(
    (
      {
        navData,
        width: parentWidth,
        filterInputIsVisible,
        toggleFilterInput,
        setTitleWidth,
      },
      inputRef,
    ) => {
      const isUuidList = useMemo(
        () => navData.menus.some((menu) => isUuid.anyNonNil(menu.id)),
        [navData.menus],
      )

      console.log('Title, inputRef:', inputRef.current)

      const { width: titleWidth, ref } = useResizeDetector({
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 300,
        refreshOptions: { leading: false, trailing: true },
      })
      useEffect(() => {
        setTitleWidth((titleWidth ?? 40) + 40 + 32 + 16)
      }, [titleWidth, setTitleWidth])

      // minWidth is the larger of parentWidth and width
      const minWidth = Math.max(parentWidth ?? 0, (titleWidth ?? 40) + 40, 80)

      return (
        <Container minwidth={minWidth}>
          <ContentWrapper minwidth={minWidth}>
            <MenuTitle>
              <TitleDiv ref={ref}>{navData.label}</TitleDiv>
              <StyledTooltip
                title="Filtern"
                show={isUuidList.toString()}
              >
                <IconButton
                  aria-label="Filtern"
                  onClick={toggleFilterInput}
                >
                  <MdFilterAlt />
                </IconButton>
              </StyledTooltip>
            </MenuTitle>
            <FilterInput
              width={parentWidth}
              filterInputIsVisible={filterInputIsVisible}
              ref={inputRef}
            />
          </ContentWrapper>
        </Container>
      )
    },
  ),
)
