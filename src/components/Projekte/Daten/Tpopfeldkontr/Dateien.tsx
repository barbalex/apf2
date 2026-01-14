import { useParams } from 'react-router'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

export const Component = () => {
  const { tpopkontrId } = useParams()

  return (
    <>
      <FormTitle title="Dateien" />
      <FilesRouter
        parentId={tpopkontrId}
        parent="tpopkontr"
      />
    </>
  )
}
