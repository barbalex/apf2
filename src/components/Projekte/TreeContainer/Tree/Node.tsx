import { Row } from './Row.tsx'
import { nodeFromMenu } from './nodeFromMenu.ts'

export const Node = ({ menu }) => <Row node={nodeFromMenu(menu)} />
