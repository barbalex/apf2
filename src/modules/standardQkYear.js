const standardQkYear = () => {
  const refDate = new Date()
  refDate.setMonth(refDate.getMonth() - 2)
  return refDate.getFullYear()
}

export default standardQkYear
