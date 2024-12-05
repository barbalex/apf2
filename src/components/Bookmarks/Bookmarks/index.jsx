import { memo, useMemo } from 'react'
import { useMatches } from 'react-router'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { FetcherImporter } from './FetcherImporter.jsx'
import { hideBookmarksAtom } from '../../../JotaiStore/index.js'

const Container = styled.nav`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  fex-grow: 1;
  flex-shrink: 0;
  padding: 0 3px;
  min-height: 40px;
  border-bottom: rgba(46, 125, 50, 0.5) solid 1px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
`

// this component extracts matches
export const Bookmarks = memo(() => {
  const allMatches = useMatches()
  const bookmarkMatches = useMemo(
    () =>
      allMatches
        .filter(
          (m) => m.handle?.bookmarkFetcher && m.handle?.bookmarkFetcherName,
        )
        .reverse(),
    [allMatches],
  )
  const [hideBookmarks] = useAtom(hideBookmarksAtom)

  if (hideBookmarks) return null

  // flex-direction row-reverse combined with reverse order of matches
  // to align bookmarks to the right, but still have them in order
  return (
    <Container>
      {bookmarkMatches.map((match) => (
        <FetcherImporter
          key={match.id}
          match={match}
        />
      ))}
    </Container>
  )
})
