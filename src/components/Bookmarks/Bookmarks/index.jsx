import { useEffect, useState } from 'react'
import { useMatches } from 'react-router'
import { TransitionGroup } from 'react-transition-group'

import { FetcherImporter } from './FetcherImporter.jsx'
import styles from './index.module.css'

const matchesFromAllMatches = (allMatches) =>
  allMatches
    .filter((m) => m.handle?.bookmarkFetcher && m.handle?.bookmarkFetcherName)
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
