// @flow
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import TextField from 'material-ui/TextField'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import { Card, CardText } from 'material-ui/Card'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { Scrollbars } from 'react-custom-scrollbars'

import FormTitle from '../../shared/FormTitle'
import appBaseUrl from '../../../modules/appBaseUrl'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 45px;
`
const StyledCard = styled(Card)`
  margin-bottom: 10px !important;
`
const Title = styled.div`
  font-weight: bold;
`
const FilterField = styled(TextField)`
  margin-top: -15px;
  margin-bottom: 10px;
`
const linkifyProperties = {
  target: `_blank`,
  style: {
    color: `white`,
    fontWeight: 100
  }
}

const enhance = compose(
  inject(`store`),
  withHandlers({
    onChangeBerichtjahr: props => (event, val) => {
      props.store.setQk({ tree: props.tree, berichtjahr: val })
      if ((isNaN(val) && val.length === 4) || (!isNaN(val) && val > 1000)) {
        props.store.setQk({ tree: props.tree })
        setTimeout(() => props.store.fetchQk({ tree: props.tree }))
      }
    },
  }),
  observer
)

const Qk = ({
  store,
  tree,
  onChangeBerichtjahr,
}) => {
  const { qk } = store
  const apArtId = tree.activeNodes.ap
  // need to pass value for when qk does not yet exist
  const myQk = qk.get(apArtId) || {
    berichtjahr: ``,
    filter: ``,
    messagesFiltered: [],
  }
  const { berichtjahr, filter, messagesFiltered } = myQk

  return (
    <Container>
      <FormTitle tree={tree} title="Qualitätskontrollen" />
      <Scrollbars>
        <FieldsContainer>
          <TextField
            floatingLabelText="Berichtjahr"
            type="number"
            value={berichtjahr}
            fullWidth
            onChange={onChangeBerichtjahr}
          />
          <FilterField
            floatingLabelText="nach Typ filtern"
            type="text"
            value={filter || ``}
            fullWidth
            onChange={(event, val) =>
              store.setQkFilter({ tree, filter: val })
            }
          />
          {
            messagesFiltered.map((m, index) => {
              const children = m.url.map((u, i) =>
                <div key={i}>
                  {`${appBaseUrl}/${u.join(`/`)}`}
                </div>
              )
              return (
                <StyledCard key={index}>
                  <CardText>
                    <Title>
                      {m.hw}
                    </Title>
                    <div>
                      <Linkify properties={linkifyProperties}>
                        {children}
                      </Linkify>
                    </div>
                  </CardText>
                </StyledCard>
              )
            })
          }
        </FieldsContainer>
      </Scrollbars>
    </Container>
  )
}

Qk.propTypes = {
  store: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired,
  onChangeBerichtjahr: PropTypes.func.isRequired,
}

Qk.defaultProps = {
  filter: ``,
}

export default enhance(Qk)
