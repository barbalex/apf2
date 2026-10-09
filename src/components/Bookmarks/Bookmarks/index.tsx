import { useMatches, type UIMatch } from 'react-router'
import { TransitionGroup } from 'react-transition-group'

import { FetcherImporter } from './FetcherImporter.tsx'
import styles from './index.module.css'

interface BookmarkHandle extends Record<string, unknown> {
  bookmarkFetcher?: boolean
  bookmarkFetcherName?: string
}

const matchesFromAllMatches = (allMatches: UIMatch[]) =>
  allMatches
    .filter(
      (m) => (m.handle as BookmarkHandle | undefined)?.bookmarkFetcher && (m.handle as BookmarkHandle | undefined)?.bookmarkFetcherName,
    )
    .reverse()

// this component extracts matches
export const Bookmarks = () => {
  const allMatches = useMatches()

  const matches = matchesFromAllMatches(allMatches)

  // flex-direction row-reverse combined with reverse order of matches
  // to align bookmarks to the right, but still have them in order
  return (
    <div className={styles.container}>
      <TransitionGroup component={null}>
        {matches.map((match) => (
          <FetcherImporter
            key={match.id}
            match={match}
          />
        ))}
      </TransitionGroup>
    </div>
  )
}
