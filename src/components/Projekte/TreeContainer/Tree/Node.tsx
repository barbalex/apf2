import { Row } from './Row.tsx'
import { nodeFromMenu } from './nodeFromMenu.ts'
import type { TreeMenu } from './types.ts'

export const Node = ({ menu }: { menu: TreeMenu }) => (
  <Row node={nodeFromMenu(menu)} />
)
