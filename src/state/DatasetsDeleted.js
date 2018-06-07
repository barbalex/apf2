// @flow
import { Container } from 'unstated'

type DatasetsDeletedState = {
  datasets: Array<Object>
}

class DatasetsDeletedContainer extends Container<DatasetsDeletedState> {
  state = { datasets: [] }
  add(dataset) {
    this.setState(state => ({ datasets: [...state.datasets, dataset] }))
  }
  remove(id) {
    console.log('state, DatasetsDeleted: removing dataset with id:', id)
    this.setState(state =>
      ({ datasets: state.datasets.filter(d => d.id !== id)})
    )
  }
}

export default DatasetsDeletedContainer