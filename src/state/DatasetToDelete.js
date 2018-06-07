// @flow
import { Container } from 'unstated'

type DatasetToDeleteState = {
  datasetToDelete: Array<Object>
}

class DatasetToDeleteContainer extends Container<DatasetToDeleteState> {
  state = {
    table: null,
    id: null,
    label: null,
    url: null,
  }
  set({ table, id, label, url }) {
    this.setState(state => ({ table, id, label, url }))
  }
  empty() {
    this.setState(state => ({
      table: null,
      id: null,
      label: null,
      url: null,
    }))
  }
}

export default DatasetToDeleteContainer