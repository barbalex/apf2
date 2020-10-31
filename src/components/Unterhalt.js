// This is the entry file for the application
import React, { useContext } from 'react'
import styled from 'styled-components'

import storeContext from '../storeContext'

const Container = styled.div`
  font: 20px Helvetica, sans-serif;
  color: #333;
  text-align: center;
  padding: 150px;
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  background-color: #fffde7;
`
const Article = styled.article`
  display: block;
  text-align: left;
  width: 650px;
  margin: 0 auto;
`
const Titel = styled.h1`
  font-size: 50px;
`
const A = styled.a`
  color: #dc8100;
  text-decoration: none;
  &:hover {
    color: #333;
    text-decoration: none;
  }
`

const App = ({ element }) => {
  const store = useContext(storeContext)
  const { appBarHeight } = store

  return (
    <Container data-appbar-height={appBarHeight}>
      <Article>
        <Titel>Wir sind bald zurück!</Titel>
        <div>
          <p>
            Bitte entschuldigen Sie den Unterbruch. apflora.ch wird gerade
            unterhalten. Wenn nötig sind wir{' '}
            <A href="mailto:alex@gabriel-software.ch">erreichbar</A>, ansonsten
            sind wir bald wieder online!
          </p>
          <p>&mdash; Das apflora-Team</p>
        </div>
      </Article>
    </Container>
  )
}

export default App
