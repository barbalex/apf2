// @flow
import { PropTypes } from 'react'

const TabTemplate = ({
  selected,
  children,
}:{
  selected:boolean,
  children:any,
}) => {
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
