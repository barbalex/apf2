import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

const Container = styled.div`
  padding: 0.2cm 0;
  break-inside: avoid;
`
const Title = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  font-weight: 600;
`
const Row = styled.div`
  display: flex;
  padding: 0.15cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const ZielColumn = styled.div`
  width: 100%;
`
const TitleRow = styled(Row)`
  color: grey;
`
const Typ = styled.div`
  width: 5.5cm;
  padding-right: 0.5cm;
`
const Goal = styled.div`
  width: 100%;
`
const Opinion = styled.div`
  width: 100%;
  padding-top: 0.1cm;
`

const Ziele = ({ ziele }) => (
  <Container>
    <Title>Ziele im Berichtsjahr:</Title>
    <TitleRow>
      <Typ>Typ</Typ>
      <Goal>Ziel</Goal>
    </TitleRow>
    {ziele.map(z => {
      const zielBer = get(z, 'zielbersByZielId.nodes', [])[0]

      return (
        <Row key={z.id}>
          <Typ>{get(z, 'zielTypWerteByTyp.text', '')}</Typ>
          <ZielColumn>
            <Goal>{z.bezeichnung || ''}</Goal>
            {zielBer && (
              <Opinion>{`Beurteilung: ${zielBer.erreichung || '(keine)'}${
                zielBer.bemerkungen ? '; ' : ''
              }${zielBer.bemerkungen || ''}`}</Opinion>
            )}
          </ZielColumn>
        </Row>
      )
    })}
  </Container>
)

export default Ziele
