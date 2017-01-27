import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import clone from 'lodash/clone'
import styled from 'styled-components'
import compose from 'recompose/compose'

import StrukturbaumContainer from './StrukturbaumContainer'
import DeleteDatasetModal from './DeleteDatasetModal'
import Daten from './Daten'
import Karte from './Karte'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Content = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
`
const KarteContainer = styled.div`
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
  flex-basis: 600px;
  flex-grow: 6;
  flex-shrink: 1;
  height: 100%;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Projekte = ({ store }) => {
  const projekteTabs = clone(store.urlQuery.projekteTabs)
  const strukturbaumIsVisible = projekteTabs && projekteTabs.includes(`strukturbaum`)
  const datenIsVisible = projekteTabs && projekteTabs.includes(`daten`)
  const karteIsVisible = projekteTabs && projekteTabs.includes(`karte`)
  const deleteDatasetModalIsVisible = !!store.datasetToDelete.id

  return (
    <Container>
      <Content>
        {
          strukturbaumIsVisible
            && <StrukturbaumContainer />
        }
        {
          datenIsVisible
            && <Daten />
        }
        {
          karteIsVisible &&
          <KarteContainer>
            <Karte />
          </KarteContainer>
        }
        {
          deleteDatasetModalIsVisible &&
          <DeleteDatasetModal />
        }
      </Content>
    </Container>
  )
}

Projekte.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Projekte)
