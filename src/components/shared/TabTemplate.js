// @flow
const TabTemplate = (
  {
    selected = false,
    children = null,
  }:
  {
    selected?: boolean,
    children?: any,
  }
) => {
  if (!selected) {
    return null
  }
  return children
}

export default TabTemplate
