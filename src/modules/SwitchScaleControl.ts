// original source:
// https://github.com/Flexberry/leaflet-switch-scale-control
// due to semantic ui requirement using this instead:
// https://github.com/victorzinho/leaflet-switch-scale-control via this in package.json:
// "leaflet-switch-scale-control": "https://github.com/victorzinho/leaflet-switch-scale-control"
// and this import:
// import SwitchScaleControl from 'leaflet-switch-scale-control'
// internalized because git started having issues importing from github directly:
// also: this module was 8 years old at the time
import L from 'leaflet'

interface SwitchScaleControlOptions extends L.ControlOptions {
  dropdownDirection: string
  className: string
  updateWhenIdle: boolean
  ratio: boolean
  ratioPrefix: string
  ratioCustomItemText: string
  customScaleTitle: string
  ratioMenu: boolean
  recalcOnPositionChange: boolean
  recalcOnZoomChange: boolean
  scales: number[]
  roundScales: number[] | null
  adjustScales: boolean
  pixelsInMeterWidth: () => number
  getMapWidthForLanInMeters: (currentLan: number) => number
  render: (ratio: number | string) => string
}

interface SwitchScaleControlInstance extends L.Control {
  options: SwitchScaleControlOptions
  _map: L.Map
  _pixelsInMeterWidth: number
  dropdown: HTMLElement
  text: HTMLElement
  _setScale: (ratio: number) => void
  _toggleDropdown: () => void
  _addScale: (ratio: number) => void
  _addScales: (
    options: SwitchScaleControlOptions,
    className: string,
    container: HTMLElement,
  ) => void
  _updateRound: () => void
  _update: () => void
  _updateFunction: (isRound: boolean) => void
  _updateRatio: (physicalScaleRatio: number, isRound: boolean) => void
  _roundScale: (physicalScaleRatio: number) => number
}

declare module 'leaflet' {
  interface Control {
    SwitchScaleControl: new (
      options?: Partial<SwitchScaleControlOptions>,
    ) => SwitchScaleControlInstance
  }
}

const SwitchScaleControl = L.Control.extend({
  options: {
    position: 'bottomleft',
    dropdownDirection: 'upward',
    className: 'map-control-scalebar',
    updateWhenIdle: false,
    ratio: true,
    ratioPrefix: '1:',
    ratioCustomItemText: '1: другой...',
    customScaleTitle: 'Задайте свой масштаб и нажмите Enter',
    ratioMenu: true,

    // If recalcOnZoomChange is false, then recalcOnPositionChange is always false.
    recalcOnPositionChange: false,
    recalcOnZoomChange: false,
    scales: [
      500, 1000, 2000, 5000, 10000, 25000, 50000, 100000, 200000, 500000,
      1000000, 2500000, 5000000, 10000000,
    ],
    roundScales: null,
    adjustScales: false,

    // Returns pixels per meter; needed if ratio: true.
    pixelsInMeterWidth: function () {
      const div = document.createElement('div')
      div.style.cssText =
        'position: absolute;  left: -100%;  top: -100%;  width: 100cm;'
      document.body.appendChild(div)
      const px = div.offsetWidth
      document.body.removeChild(div)
      return px
    },

    // Returns width of map in meters on specified latitude.
    getMapWidthForLanInMeters: function (currentLan: number) {
      return 6378137 * 2 * Math.PI * Math.cos((currentLan * Math.PI) / 180)
    },

    render: function (ratio: number | string): string {
      let scaleRatioText = ratio.toString()
      // 1500000 -> 1'500'000
      if (scaleRatioText.length > 3) {
        const joinerChar = "'"
        scaleRatioText = scaleRatioText
          .split('')
          .reverse()
          .join('')
          .replace(/([0-9]{3})/g, '$1' + joinerChar)
        if (scaleRatioText[scaleRatioText.length - 1] === joinerChar) {
          scaleRatioText = scaleRatioText.slice(0, -1)
        }

        scaleRatioText = scaleRatioText.split('').reverse().join('')
      }

      return this.options.ratioPrefix + scaleRatioText
    },
  },

  onAdd: function (map: L.Map) {
    this._map = map
    this._pixelsInMeterWidth = this.options.pixelsInMeterWidth()

    const className = this.options.className
    const container = L.DomUtil.create(
      'div',
      'leaflet-control-scale ' + className,
    )
    const options = this.options

    this._addScales(options, className, container)

    if (options.recalcOnZoomChange) {
      if (options.recalcOnPositionChange) {
        map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this)
      } else {
        map.on(options.updateWhenIdle ? 'zoomend' : 'zoom', this._update, this)
      }
    } else {
      map.on(
        options.updateWhenIdle ? 'zoomend' : 'zoom',
        this._updateRound,
        this,
      )
    }

    map.whenReady(
      options.recalcOnZoomChange ? this._update : this._updateRound,
      this,
    )

    L.DomEvent.disableClickPropagation(container)

    return container
  },

  onRemove: function (map: L.Map) {
    if (this.options.recalcOnZoomChange) {
      if (this.options.recalcOnPositionChange) {
        map.off(
          this.options.updateWhenIdle ? 'moveend' : 'move',
          this._update,
          this,
        )
      } else {
        map.off(
          this.options.updateWhenIdle ? 'zoomend' : 'zoom',
          this._update,
          this,
        )
      }
    } else {
      map.off(
        this.options.updateWhenIdle ? 'zoomend' : 'zoom',
        this._updateRound,
        this,
      )
    }
  },

  _setScale: function (ratio: number) {
    const map = this._map
    const bounds = map.getBounds()
    const centerLat = bounds.getCenter().lat
    const crsScale =
      (this._pixelsInMeterWidth *
        this.options.getMapWidthForLanInMeters(centerLat)) /
      ratio
    const crs = map.options.crs
    if (crs) this._map.setZoom(crs.zoom(crsScale))
    this._toggleDropdown()
  },

  _toggleDropdown: function () {
    const style = this.dropdown.style as CSSStyleDeclaration &
      Record<string, string | null>
    const height =
      style['max-height'] === '0em' ? this.options.scales.length * 2 : 0
    style['max-height'] = height + 'em'
    style.border = height ? '' : '0'
  },

  _addScale: function (ratio: number) {
    const menuitem = L.DomUtil.create(
      'div',
      this.options.className + '-scale-item',
      this.dropdown,
    )
    menuitem.innerHTML = this.options.render(ratio)
    const setScale = this._setScale.bind(this)
    menuitem.addEventListener('click', function () {
      setScale(ratio)
    })
  },

  _addScales: function (
    options: SwitchScaleControlOptions,
    className: string,
    container: HTMLElement,
  ) {
    if (!options.ratio) return

    if (options.ratioMenu) {
      this.dropdown = L.DomUtil.create(
        'div',
        className + '-dropdown',
        container,
      )
      this._toggleDropdown()
    }
    this.text = L.DomUtil.create('div', className + '-text', container)

    if (!options.ratioMenu) return

    const scales = options.scales

    this.text.addEventListener('click', this._toggleDropdown.bind(this))

    scales.forEach(this._addScale.bind(this))

    // the DOM handlers below need the input element as their own this
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: SwitchScaleControlInstance = this
    const customScaleInput = L.DomUtil.create(
      'input',
      className + '-custom-scale',
      this.dropdown,
    )
    customScaleInput.type = 'text'
    customScaleInput.setAttribute('value', options.ratioCustomItemText)
    customScaleInput.addEventListener('focus', function (this: HTMLInputElement, e) {
      if (this.value === options.ratioCustomItemText) {
        this.value = options.ratioPrefix

        // IE fix.
        const ieInput = this as HTMLInputElement & {
          createTextRange?: () => {
            moveStart: (unit: string, count: number) => void
            select: () => void
          }
        }
        if (ieInput.createTextRange) {
          const r = ieInput.createTextRange()
          r.moveStart('character', this.value.length)
          r.select()
        }
      }

      e.stopPropagation()
    })

    customScaleInput.addEventListener('keydown', function (this: HTMLInputElement, e) {
      if (e.which !== 13) return

      const scaleRatioFound = this.value
        .replace(' ', '')
        .replace("'", '')
        .match(/^(1:){0,1}([0-9]*)$/)
      if (scaleRatioFound && scaleRatioFound[2]) {
        const maxScale = Math.max(...scales)

        if (self.options.adjustScales && +scaleRatioFound[2] > maxScale) {
          self._setScale(scales[scales.length - 1] as number)
        } else {
          self._setScale(+scaleRatioFound[2])
        }
      }

      e.preventDefault()
    })

    customScaleInput.addEventListener('keypress', function (e) {
      if (e.charCode && (e.charCode < 48 || e.charCode > 57)) e.preventDefault()
    })
  },

  _updateRound: function () {
    this._updateFunction(true)
  },

  _update: function () {
    this._updateFunction(false)
  },

  _updateFunction: function (isRound: boolean) {
    if (this._map.getSize().x > 0 && this.options.ratio) {
      const bounds = this._map.getBounds()
      const centerLat = bounds.getCenter().lat
      const mapWidth = this.options.getMapWidthForLanInMeters(centerLat)
      const crs = this._map.options.crs
      if (!crs) return
      const ratio =
        (this._pixelsInMeterWidth * mapWidth) / crs.scale(this._map.getZoom())
      this._updateRatio(ratio, isRound)
    }
  },

  _updateRatio: function (physicalScaleRatio: number, isRound: boolean) {
    const scaleText =
      isRound ?
        this._roundScale(physicalScaleRatio)
      : Math.round(physicalScaleRatio)
    this.text.innerHTML = this.options.render.call(this, scaleText)
  },

  _roundScale: function (physicalScaleRatio: number): number {
    const scales = this.options.roundScales || this.options.scales

    if (physicalScaleRatio < (scales[0] as number)) {
      return scales[0] as number
    }

    if (physicalScaleRatio > (scales[scales.length - 1] as number)) {
      return scales[scales.length - 1] as number
    }

    for (let i = 0; i < scales.length - 1; i++) {
      if (
        physicalScaleRatio < (scales[i + 1] as number) &&
        physicalScaleRatio >= (scales[i] as number)
      ) {
        return (scales[i + 1] as number) + (scales[i] as number) - 2 * physicalScaleRatio >= 0 ?
            (scales[i] as number)
          : (scales[i + 1] as number)
      }
    }

    return Math.round(physicalScaleRatio)
  },
} as ThisType<SwitchScaleControlInstance> &
  Record<string, unknown>)

;(L.Control as unknown as Record<string, unknown>).SwitchScaleControl =
  SwitchScaleControl

export default SwitchScaleControl
