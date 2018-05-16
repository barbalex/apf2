import React from 'react'
import 'leaflet'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import app from 'ampersand-app'
import get from 'lodash/get'

import dataGql from './data.graphql'

const StyledDiv = styled.div`
  background-color: transparent;
  color: rgb(48, 48, 48);
  font-weight: 700;
  text-shadow: 0 1px 0 white, -0 -1px 0 white, 1px 0 0 white, -1px 0 0 white,
    0 2px 1px white, -0 -2px 1px white, 2px 0 1px white, -2px 0 1px white,
    0 3px 2px white, -0 -3px 2px white, 3px 0 2px white, -3px 0 2px white;
  cursor: pointer;
  margin-bottom: 2px !important;
  margin-right: 5px !important;
`

const enhance = compose(
  withState('panToMarker', 'changePanToMarker', null),
  withHandlers({
    onClickCoordinates: props => () => {
      const { changeControlType } = props
      changeControlType('goto')
    },
  })
)

const ShowCoordinates = ({
  onClickCoordinates,
}: {
  onClickCoordinates: () => void,
}) => 
  <ApolloProvider client={app.client}>
    <Query query={dataGql} >
      {({ loading, error, data }) => {
        console.log('ShowCoordinates:', { loading, error, data, app })
        if (error) return `Fehler: ${error.message}`

        const x = get(data, 'mapMouseCoordinates.x').toLocaleString('de-ch')
        const y = get(data, 'mapMouseCoordinates.y').toLocaleString('de-ch')
        const coord = `${x}, ${y}`

        return (
          <StyledDiv
            onClick={onClickCoordinates}
            title="Klicken um Koordinaten zu suchen"
          >
            {coord}
          </StyledDiv>
        )
      }}
    </Query>
  </ApolloProvider>

export default enhance(ShowCoordinates)
