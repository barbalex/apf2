// @flow
import { Container } from 'unstated'

type DeleteState = {
  datasets: Array<Object>,
  datasetToDelete: Array<Object>,
}

class DeleteContainer extends Container<DeleteState> {
  state = {
    datasets: [],
    toDelete: {
      table: null,
      id: null,
      label: null,
      url: null,
      afterDeletionHook: null,
    },
  }
  addDataset(dataset) {
    this.setState(state => ({ datasets: [...state.datasets, dataset] }))
  }
  removeDataset(id) {
    this.setState(state => ({
      datasets: state.datasets.filter(d => d.id !== id),
    }))
  }
  setToDelete({ table, id, label, url, afterDeletionHook }) {
    this.setState(state => ({
      toDelete: { table, id, label, url, afterDeletionHook },
    }))
  }
  emptyToDelete() {
    this.setState(state => ({
      toDelete: {
        table: null,
        id: null,
        label: null,
        url: null,
        afterDeletionHook: null,
      },
    }))
  }
}

export default DeleteContainer
