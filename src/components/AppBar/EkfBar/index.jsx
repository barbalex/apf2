import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router'
import { useParams, useLocation } from 'react-router'
import { useResizeDetector } from 'react-resize-detector'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'

import { EkfYear } from './EkfYear.jsx'
import { User } from './User/index.jsx'
import { query } from './query.js'
import { Menus } from './Menus.jsx'

const minWidthToShowTitle = 800

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.alignflexend === 'true' ? 'flex-end' : 'space-between'};
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
`
export const SiteTitle = styled(Button)`
  display: ${(props) => (props.hide === 'true' ? 'none' : 'block')} !important;
  max-width: 110px;
  flex-grow: 0;
  flex-shrink: 1;
  color: white !important;
  font-size: 1em !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  white-space: nowrap !important;
  transform: ${(props) =>
    props.hide === 'true' ? 'translateX(-9999px)' : 'none'};
  // need to take hidden elements out of flow
  position: ${(props) => (props.hide === 'true' ? 'absolute' : 'unset')};

  :hover {
    border-width: 1px !important;
  }
`
export const MenuDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-grow: 1;
  justify-content: flex-end;
  overflow: hidden;
`

export const EkfBar = () => {
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
}
