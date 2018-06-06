// @flow
import extendStore from './extend'

function Store(): void {
  this.map = {
    beobZugeordnet: {},
    detailplaene: null,
  }
}

const MyStore = new Store()

extendStore(MyStore)

export default MyStore