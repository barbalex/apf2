import { memo, useState, useCallback, useMemo } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'
import isUuid from 'is-uuid'

const MenuTitleRow = styled.div`
  position: relative;
  z-index: 1;
  margin-top: -8px;
`
const MenuTitle = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 0.6666667px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  font-weight: bold;
  opacity: 1 !important;
  width: ${(props) => props.width}px;
  min-height: 40px;
`
const TitleDiv = styled.div`
  padding-left: 16px;
  user-select: none;
  cursor: default;
`

export const Title = memo(({ navData, width }) => {
  const showFilter = useMemo(
    () => navData.menus.some((menu) => isUuid.anyNonNil(menu.id)),
    [navData.menus],
  )

  return (
    <MenuTitleRow>
      <MenuTitle width={width}>
        <TitleDiv>{navData.label}</TitleDiv>
        {showFilter && (
          <Tooltip title="Filtern">
            <IconButton
              aria-label="Filtern"
              onClick={() => {
                console.log('Filtern')
              }}
            >
              <MdFilterAlt />
            </IconButton>
          </Tooltip>
        )}
      </MenuTitle>
    </MenuTitleRow>
  )
})
