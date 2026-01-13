import { Row } from './Row.tsx'
import { nodeFromMenu } from './nodeFromMenu.js'

export const Node = ({ menu }) => <Row node={nodeFromMenu(menu)} />
