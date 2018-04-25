// @flow

export default () => {
  const refDate = new Date()
  refDate.setMonth(refDate.getMonth() - 6)
  return refDate.getFullYear()
}
