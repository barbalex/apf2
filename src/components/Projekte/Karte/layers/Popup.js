import React from 'react'
import styled from 'styled-components'
import Linkify from 'react-linkify'

const Container = styled.div`
  overflow: auto;
  max-height: ${(props) => `${props.maxheight}px`};
  max-width: ${(props) => `${props.maxwidth}px`};
  margin-right: -5px;
`
const Row = styled.div`
  display: grid;
  grid-template-columns: 85px 1fr;
  font-size: x-small !important;
  &:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.05);
    color: black;
  }
`
const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 8px;
  &:not(:first-of-type) {
    margin-top: 8px;
  }
`
const Label = styled.div`
  color: rgba(0, 0, 0, 0.6);
  overflow-wrap: anywhere;
`
const Value = styled.div`
  overflow-wrap: anywhere;
`

const Popup = ({ layersData, mapSize = { x: 1000, y: 1000 } }) => {
  // console.log('Popup', { mapSize, x: mapSize.x, y: mapSize.y })

  return (
    <Container maxheight={mapSize.y - 40} maxwidth={mapSize.x - 60}>
      {layersData.map((ld) => (
        <div key={ld.label}>
          <Title>{ld.label}</Title>
          {ld.properties.map(([key, value], index) => (
            <Row key={`${key}/${index}`}>
              <Label>{`${key}:`}</Label>
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <a target="blank" href={decoratedHref} key={key}>
                    {decoratedText}
                  </a>
                )}
              >
                <Value>{value}</Value>
              </Linkify>
            </Row>
          ))}
        </div>
      ))}
    </Container>
  )
}

export default Popup
