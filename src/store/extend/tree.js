// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

export default (store: Object, tree: Object): void => {
  extendObservable(tree, {
    activeNodes: computed(() => ({}), {
      name: 'activeNodes',
    }),
  })
}