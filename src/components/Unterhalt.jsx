// This is the entry file for the application
import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  font: 20px Helvetica, sans-serif;
  color: #333;
  text-align: center;
  padding: 150px;
  height: 100%;
  background-color: #fffde7;
`
const Article = styled.article`
  display: block;
  text-align: left;
  max-width: 650px;
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

const App = () => (
  <Container>
    <Article>
      <Titel>Wir sind bald zurück!</Titel>
      <div>
        <p>apflora wird gerade auf neue Server gezügelt &#x1F69A;</p>
        <p>
          Wenn nötig sind wir per{' '}
          <A href="mailto:alex@gabriel-software.ch">email</A> erreichbar,
          <br />
          ansonsten sind wir bald wieder online
        </p>
      </div>
    </Article>
  </Container>
)

export default App
