import { useContext, lazy, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

const LabelFilter = lazy(async () => ({
  default: (await import('./LabelFilter.jsx')).LabelFilter,
}))
const ApFilter = lazy(async () => ({
  default: (await import('./ApFilter/index.jsx')).ApFilter,
}))
const TreeComponent = lazy(async () => ({
  default: (await import('./Tree/index.jsx')).TreeComponent,
}))
const Menus = lazy(async () => ({
  default: (await import('./Menus.jsx')).Menus,
}))
const DeleteDatasetModal = lazy(async () => ({
  default: (await import('./DeleteDatasetModal/index.jsx')).DatasetDeleteModal,
}))
const ErrorBoundary = lazy(async () => ({
  default: (await import('../../shared/ErrorBoundary.jsx')).ErrorBoundary,
}))
const Spinner = lazy(async () => ({
  default: (await import('../../shared/Spinner.jsx')).Spinner,
}))

import { MobxContext } from '../../../mobxContext.js'
import { container, labelFilterContainer } from './index.module.css'

export const TreeContainer = observer(() => {
  const params = useParams()
  const { projId } = params

  const store = useContext(MobxContext)
  const { toDeleteId } = store

  //console.log('TreeContainer',{data})
  // console.log('TreeContainer rendering')

  return (
    <ErrorBoundary>
      <div
        className={container}
        data-id="tree-container1"
      >
        {!!toDeleteId && (
          <Suspense fallback={null}>
            <DeleteDatasetModal />
          </Suspense>
        )}
        <div className={labelFilterContainer}>
          <Suspense fallback={null}>
            <LabelFilter />
          </Suspense>
          {!!projId && (
            <Suspense fallback={null}>
              <ApFilter />
            </Suspense>
          )}
        </div>
        <Suspense fallback={<Spinner />}>
          <TreeComponent />
        </Suspense>
        {!matchMedia('(pointer: coarse)').matches && (
          <Suspense fallback={null}>
            <Menus />
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  )
})
