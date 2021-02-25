// filter by dataFilter
// 2019 03 19: not any more in use: filtering happens directly in queries

import types from '../../../store/Tree/DataFilter/simpleTypes'

const filterNodesByApFilter = ({ node, dataFilterArray, table }) => {
  if (dataFilterArray.length === 0) return true
  let type = 'string'
  return dataFilterArray.every(([key, value]) => {
    if (node[key] === null || node[key] === undefined) return false
    if (table && types[table] && types[table][key]) {
      type = types[table][key]
    }
    if (['number', 'uuid', 'boolean'].includes(type)) {
      // eslint-disable-next-line eqeqeq
      return node[key] == value
    }
    // must be string or date
    /**
     * 16.2.2019:
     * toLowerCase is obviously ignored
     * !!!!!!???????
     * filter in abies alba fro pop name züri to test
     */
    return node[key]
      .toString()
      .toLowerCase()
      .includes(value.toString().toLowerCase())
  })
}

export default filterNodesByApFilter
