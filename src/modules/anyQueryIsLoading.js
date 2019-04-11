/**
 * Gets an array of query results passed
 * returns true if any of them returns loading === true
 */
export default queryArray => queryArray.some(loading => loading)
