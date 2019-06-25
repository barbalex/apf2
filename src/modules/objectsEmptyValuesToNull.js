export default o => {
  const object = { ...o }
  for (const [key, value] of Object.entries(object)) {
    if (value === '' || value === undefined) {
      object[key] = null
    }
  }
  return object
}
