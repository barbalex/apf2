import React, { Component } from 'react'
import { signature, expire } from '../../utils/uploadcareSignature'

if (typeof window !== 'undefined') {
  window.GATSBY_UPLOADCARE_PUBLIC_KEY = process.env.GATSBY_UPLOADCARE_PUBLIC_KEY
  window.UPLOADCARE_LOCALE = 'de'
  window.UPLOADCARE_TABS =
    'file camera url gdrive gphotos dropbox onedrive box instagram'
  window.UPLOADCARE_EFFECTS = 'crop'
  window.UPLOADCARE_IMAGE_SHRINK = '2056x2056'
  window.UPLOADCARE_IMAGES_ONLY = true
  window.UPLOADCARE_PREVIEW_STEP = true
  window.UPLOADCARE_IMAGES_ONLY = false
  window.UPLOADCARE_LOCALE_TRANSLATIONS = {
    buttons: {
      choose: {
        files: {
          one: 'Neue Datei hochladen',
          other: 'Neue Dateien hochladen',
        },
        images: {
          one: 'Neues Bild hochladen',
          other: 'Neue Bilder hochladen',
        },
      },
    },
  }
  window.UPLOADCARE_SECURE_SIGNATURE = signature
  window.UPLOADCARE_SECURE_EXPIRE = expire
}

const uploadcare = require('uploadcare-widget')

class Uploader extends Component {
  componentDidMount() {
    const widget = uploadcare.Widget(this.uploader)
    const { value, onChange, onUploadComplete } = this.props

    if (typeof value !== 'undefined') {
      widget.value(value)
    }
    if (typeof onChange === 'function') {
      widget.onChange(files => {
        if (files) {
          this.files =
            this.files && this.files.files ? this.files.files() : [this.files]
        } else {
          this.files = null
        }

        onChange(files)
      })
    }
    if (typeof onUploadComplete === 'function') {
      widget.onUploadComplete(onUploadComplete)
    }
    widget.onDialogOpen(dialog => (this.dialog = dialog))
    // reset widget after upload
    widget.onUploadComplete(function() {
      widget.value(null)
    })
  }

  componentWillUnmount() {
    if (this.dialog) {
      this.dialog.reject()
    }
    if (this.files) {
      uploadcare.jQuery.when.apply(null, this.files).cancel()
    }

    const widgetElement = uploadcare
      .jQuery(this.uploader)
      .next('.uploadcare--widget')
    const widget = widgetElement.data('uploadcareWidget')

    if (widget && widget.inputElement === this.uploader) {
      widgetElement.remove()
    }
  }

  getInputAttributes() {
    const attributes = Object.assign({}, this.props)

    delete attributes.value
    delete attributes.onChange
    delete attributes.onUploadComplete

    return attributes
  }

  render() {
    const attributes = this.getInputAttributes()

    return (
      <input
        type="hidden"
        ref={input => (this.uploader = input)}
        data-image-shrink="2400x1600"
        //data-multiple="true"
        //data-multiple-min="1"
        {...attributes}
      />
    )
  }
}

export default Uploader
