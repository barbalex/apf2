import { PropTypes } from 'react'

const TabTemplate = ({ selected, children }) => {
  if (!selected) {
    return null
  }
  return children
}

TabTemplate.propTypes = {
  selected: PropTypes.bool,
  children: PropTypes.any,
}

TabTemplate.defaultProps = {
  selected: false,
  children: null,
}

export default TabTemplate
