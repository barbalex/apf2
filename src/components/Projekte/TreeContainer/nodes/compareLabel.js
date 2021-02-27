const compareLabel = (a, b) => {
  if (a.label.toLowerCase() < b.label.toLowerCase()) {
    return -1
  } else if (a.label.toLowerCase() > b.label.toLowerCase()) {
    return 1
  }
  return 0
}

export default compareLabel
