// This is the entry file for the application
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  font: 20px Helvetica, sans-serif;
  color: #333;
  text-align: center;
  padding: 150px;
  height: calc(100vh - 64px);
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

const App = ({ element }) => (
  <Container>
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

export default App
