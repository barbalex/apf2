import { useLocation, useParams } from 'react-router'
import styled from '@emotion/styled'

import { ErrorBoundary } from '../../ErrorBoundary.jsx'
import { MenuBar } from '../../MenuBar/index.jsx'
import { Title } from './Title.jsx'
import { ListMenus } from './ListMenus.jsx'
import { PreviewMenus } from './PreviewMenus.jsx'

export const MenuTitle = styled.h3`
  padding-top: 2px;
  padding-left: 15px;
  padding-right: 16px;
  padding-bottom: 0;
  margin-bottom: 3px;
  &:focus {
    outline: none;
  }
`

export const Menu = ({ parent, files, refetch, containerRef }) => {
  const { fileId } = useParams()
  const { pathname } = useLocation()
  // also show preview if Vorschau is omitted (until that rout is used for something else)
  const isPreview = pathname.endsWith('Vorschau') || pathname.includes(fileId)

  const file = files.find((f) => f.fileId === fileId)
  const fileIndex = files.findIndex((f) => f.fileId === fileId)

  const numbers = file ? `${fileIndex + 1}/${files.length}` : files.length
  const titleComponentWidth = 60

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${isPreview}`}
        titleComponent={
          <Title
            file={file}
            numbers={numbers}
            titleComponentWidth={titleComponentWidth}
          />
        }
        titleComponentWidth={titleComponentWidth}
        color="rgba(0, 0, 0, 0.54)"
        bgColor="rgb(255, 253, 231)"
      >
        {isPreview ?
          <PreviewMenus
            parent={parent}
            files={files}
            refetch={refetch}
            containerRef={containerRef}
          />
        : <ListMenus files={files} />}
      </MenuBar>
    </ErrorBoundary>
  )
}
