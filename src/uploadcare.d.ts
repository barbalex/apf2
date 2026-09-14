import type * as React from 'react'

// uploadcare's uploader context custom element, used without their react wrapper
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'uc-upload-ctx-provider': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'ctx-name'?: string
      }
    }
  }
}
