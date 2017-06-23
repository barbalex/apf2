// @flow
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'
import withState from 'recompose/withState'

import TextFieldNonUpdatable from '../../shared/TextFieldNonUpdatable'
import constants from '../../../modules/constants'

const Container = styled(({ width, ...rest }) => <div {...rest} />)`
  padding: 0 10px 0 10px;
  column-width: ${props =>
    props.width > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(
  inject('store'),
  withState('width', 'changeWidth', 0),
  observer
)

class Beob extends Component {
  props: {
    store: Object,
    tree: Object,
    width: number,
    changeWidth: () => {},
  }

  updateWidth = () => {
    console.log('updateWidth')
    if (this.container && this.container.offsetWidth) {
      this.props.changeWidth(this.container.offsetWidth)
    }
  }

  componentDidMount() {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth)
  }

  render() {
    const { store, tree, width } = this.props
    const { row } = tree.activeDataset
    const beob = store.table.beob.get(row.BeobId || row.id)
    if (!beob) return null
    const beobFields = Object.entries(beob.data).filter(
      ([key, value]) => value || value === 0
    )

    return (
      <div
        ref={c => {
          // $FlowIssue
          this.container = c
        }}
      >
        <Container width={width}>
          {beobFields.map(([key, value]) =>
            <div key={key}>
              <TextFieldNonUpdatable label={key} value={value} />
            </div>
          )}
        </Container>
      </div>
    )
  }
}

export default enhance(Beob)
