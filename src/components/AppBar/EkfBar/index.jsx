import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router'
import { useParams, useLocation } from 'react-router'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'

import { EkfYear } from './EkfYear.jsx'
import { User } from './User/index.jsx'
import { query } from './query.js'
import { Menus } from './Menus.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;

  @media (max-width: 800px) {
    justify-content: flex-end;
  }
`
const SiteTitle = styled(Button)`
  display: block;
  max-width: 110px;
  flex-grow: 0;
  flex-shrink: 1;
  color: white !important;
  font-size: 1em !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  white-space: nowrap !important;

  :hover {
    border-width: 1px !important;
  }

  // hide title on small screens
  @media (max-width: 800px) {
    transform: translateX(-9999px);
    position: absolute;
  }
`
const MenuDiv = styled.div`
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

  return (
    <Container>
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
      <MenuDiv>
        <Menus />
      </MenuDiv>
    </Container>
  )
}
