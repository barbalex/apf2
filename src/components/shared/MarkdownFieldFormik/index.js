import React, { lazy, Suspense } from 'react'

const MarkdownFieldFormik = lazy(() => import('./MarkdownFieldFormik'))

// need to lazy import because react-markdown-editor-lite calls navigator which busts gatsby build
const MdFieldFormik = (props) => (
  <Suspense fallback={<div>Lade...</div>}>
    <MarkdownFieldFormik {...props} />
  </Suspense>
)

export default MdFieldFormik
