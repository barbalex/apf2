import Row from '../../Row'
import ApberuebersichtFolder from './ApberuebersichtFolder'
import ApFolder from './ApFolder'

const ProjektNode = ({ projekt, projectIsOpen, apberuebersichtsFilter }) => {
  const node = {
    nodeType: 'table',
    menuType: 'projekt',
    id: projekt.id,
    urlLabel: projekt.id,
    label: projekt.label,
    url: ['Projekte', projekt.id],
    hasChildren: true,
  }

  return (
    <>
      <Row key={`${projekt.id}Project`} node={node} />
      {projectIsOpen && (
        <>
          <ApFolder
            key={`${projekt.id}ApFolderContainer`}
            projekt={projekt}
            count={projekt?.apsByProjId?.totalCount ?? 0}
          />
          <ApberuebersichtFolder
            key={`${projekt.id}ApberuebersichtFolderContainer`}
            projekt={projekt}
            count={projekt?.apberuebersichtsByProjId?.totalCount ?? 0}
            apberuebersichtsFilter={apberuebersichtsFilter}
          />
        </>
      )}
    </>
  )
}

export default ProjektNode
