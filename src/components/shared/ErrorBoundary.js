// @flow
import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin: 10px;
`
const ErrorTitle = styled.div`
  margin-bottom: 10px;
`

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    const { errorInfo } = this.state
    if (errorInfo) {
      return (
        <Container>
          <ErrorTitle>
            Oh nein, es ist ein Fehler aufgetreten! Bericht:
          </ErrorTitle>
          {errorInfo.componentStack}
          <div />
        </Container>
      )
    }
    const { children } = this.props
    var childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { ...this.props })
    )

    // Normally, just render children
    // and pass all props
    return childrenWithProps
  }
}

export default ErrorBoundary
