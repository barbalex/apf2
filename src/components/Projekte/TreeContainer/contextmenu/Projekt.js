// @flow
import React, { PropTypes } from 'react'
import { ContextMenu } from 'react-contextmenu'

const Projekt = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu id={`${treeName}projekt`} >
    <div className="react-contextmenu-title">Projekt</div>
    // TODO: add MenuItem for admins to add new projekt
  </ContextMenu>

Projekt.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Projekt
