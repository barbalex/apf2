import { Row } from './Row.jsx'
import { nodeFromMenu } from './nodeFromMenu.js'

export const Node = ({ menu }) => <Row node={nodeFromMenu(menu)} />
