// @flow
import { Container } from 'unstated'

type DeleteState = {
  errors: Array<Object>,
}

class ErrorContainer extends Container<DeleteState> {
  state = {
    errors: [],
  }
  add(error) {
    this.setState(state => ({ errors: [...state.errors, error] }))
    setTimeout(() => {
      const newErrors = [...this.state.errors]
      newErrors.pop()
      this.setState(state => ({ errors: newErrors }))
    }, 1000 * 10)
  }
}

export default ErrorContainer