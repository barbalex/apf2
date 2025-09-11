import { memo } from 'react'
import { useQuery } from "@apollo/client/react";
import { Link } from 'react-router'
import { useParams, useLocation } from 'react-router'
import { useResizeDetector } from 'react-resize-detector'

import { EkfYear } from './EkfYear.jsx'
import { User } from './User/index.jsx'
import { query } from './query.js'
import { SiteTitle, MenuDiv } from '../Bar/index.jsx'
import { Container } from '../Bar/index.jsx'
import { Menus } from './Menus.jsx'

const minWidthToShowTitle = 800

export const EkfBar = memo(() => {
  const { userId } = useParams()
  const { search } = useLocation()

  // if no ekfAdresseId
  // need to fetch adresse.id for this user
  // and use that instead
  const { data: userData } = useQuery(query, {
    variables: { userId: userId ?? '99999999-9999-9999-9999-999999999999' },
  })

  const userName = userData?.userById?.name ?? null

  const { width, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 500,
    refreshOptions: { leading: false, trailing: true },
  })
  const showTitle = width >= minWidthToShowTitle

  return (
    <Container
      ref={ref}
      alignFlexEnd={(width < minWidthToShowTitle).toString()}
    >
      {showTitle && (
        <SiteTitle
          variant="outlined"
          component={Link}
          to={`/${search}`}
          title="Home"
        >
          {userName ?
            `AP Flora: EKF von ${userName}`
          : 'AP Flora: Erfolgs-Kontrolle Freiwillige'}
        </SiteTitle>
      )}
      <MenuDiv>
        <Menus />
      </MenuDiv>
    </Container>
  )
})
