import { memo, useState, useCallback, useMemo, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Collapse from '@mui/material/Collapse'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'
import isUuid from 'is-uuid'
import { useResizeDetector } from 'react-resize-detector'
import { FilterInput } from './FilterInput.jsx'
import { ApFilter } from '../../../../Projekte/TreeContainer/ApFilter/index.jsx'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
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
  overflow: hidden;
  flex-shrink: 0;
`
const Filters = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 1;
`
const StyledTooltip = styled(Tooltip)`
  ${(props) => (props.show === 'true' ? '' : 'display: none;')}
`
const ApFilterFitter = styled.div`
  margin-top: -14px;
  margin-left: 15px;
  margin-right: -15px;
  width: 58px;
`

export const Title = memo(
  ({
    navData,
    width: parentWidth,
    filterInputIsVisible,
    toggleFilterInput,
    setTitleWidth,
    ref: filterInputRef,
  }) => {
    const isUuidList = useMemo(
      () => navData.menus.some((menu) => isUuid.anyNonNil(menu.id)),
      [navData.menus],
    )

    // if is Aps, need to add ApFilter
    const isAps = navData.id === 'Arten'

    const { width: titleWidth, ref } = useResizeDetector({
      handleHeight: false,
      refreshMode: 'debounce',
      refreshRate: 300,
      refreshOptions: { leading: false, trailing: true },
    })
    useEffect(() => {
      setTitleWidth(
        (titleWidth ?? 40) +
          (isUuidList ?
            isAps ? 40 + 58
            : 40
          : 0) +
          32 +
          8,
      )
    }, [titleWidth, setTitleWidth, isUuidList])

    // minWidth is the larger of parentWidth and width
    const minWidth = Math.max(parentWidth ?? 0, (titleWidth ?? 40) + 40, 80)

    return (
      <Container minwidth={minWidth}>
        <ContentWrapper minwidth={minWidth}>
          <MenuTitle>
            <TitleDiv ref={ref}>{navData.label}</TitleDiv>
            {!!parentWidth && (
              <Filters>
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
                {isAps && (
                  <ApFilterFitter>
                    <ApFilter />
                  </ApFilterFitter>
                )}
              </Filters>
            )}
          </MenuTitle>
          <Collapse in={filterInputIsVisible}>
            <FilterInput
              width={parentWidth}
              filterInputIsVisible={filterInputIsVisible}
              toggleFilterInput={toggleFilterInput}
              ref={filterInputRef}
            />
          </Collapse>
        </ContentWrapper>
      </Container>
    )
  },
)
