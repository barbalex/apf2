import React, { lazy, Suspense } from 'react'

const MarkdownField = lazy(() => import('./MarkdownField'))

// need to lazy import because react-markdown-editor-lite calls navigator which busts gatsby build
const MdFieldFormik = (props) => (
  <Suspense fallback={<div>Lade...</div>}>
    <MarkdownField {...props} />
  </Suspense>
)

export default MdFieldFormik
