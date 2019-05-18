import React, { Component } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"

//import dealWithError from '../../modules/dealWithError'

const Container = styled.div`
  margin: 10px;
`
const ErrorTitle = styled.div`
  margin-bottom: 10px;
`
const ReloadButton = styled(Button)`
  margin-top: 10px !important;
`

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    // Catch errors in any components below and re-render with error message
    return {
      error,
    }
  }

  render() {
    const { error } = this.state

    if (error) {
      console.log("error:", error)

      return (
        <Container>
          <ErrorTitle>
            Oh je, es ist ein Fehler aufgetreten! Bericht:
          </ErrorTitle>
          <div>{error.message}</div>
          <ReloadButton
            variant="outlined"
            onClick={() =>
              typeof window !== "undefined" && window.location.reload(false)
            }
          >
            Neu laden
          </ReloadButton>
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
