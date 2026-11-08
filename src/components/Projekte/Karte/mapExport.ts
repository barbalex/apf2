import { toPng } from 'html-to-image'
import type { Map as LeafletMap } from 'leaflet'

// first-party replacement for leaflet-easyprint (unmaintained, Leaflet-1
// only): easyprint internally captured the map's DOM with dom-to-image and,
// for printing, opened a popup with the image and @page CSS. This does the
// same with the maintained html-to-image.

// wait until all visible tiles have loaded (or errored) so the capture
// doesn't show grey placeholders — replaces easyprint's tileWait: 2000
const waitForTiles = async (container: HTMLElement, timeoutMs = 4000) => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const pending = container.querySelectorAll(
      'img.leaflet-tile:not(.leaflet-tile-loaded)',
    ).length
    if (!pending) return
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}

/**
 * Captures the map as a PNG data URL, with the leaflet controls hidden.
 * Tiles must be CORS-enabled (all tile servers this app uses are — the old
 * easyprint capture required the same).
 */
export const captureMap = async (map: LeafletMap): Promise<string> => {
  const container = map.getContainer()
  await waitForTiles(container)

  // hide the control containers during the capture: leaflet's own one plus
  // the ones rendered by the self-built Control component
  const controlContainers = [
    ...container.querySelectorAll<HTMLElement>('.leaflet-control-container'),
  ]
  const previousDisplays = controlContainers.map((c) => c.style.display)
  controlContainers.forEach((c) => (c.style.display = 'none'))

  try {
    return await toPng(container, { cacheBust: true })
  } finally {
    controlContainers.forEach(
      (c, i) => (c.style.display = previousDisplays[i] ?? ''),
    )
  }
}

/**
 * Prints the captured map in a popup window, sized for the given @page
 * size ('' = current size) — easyprint's print flow.
 *
 * The image is constrained to one page: percentage max-heights only work
 * against a definite height, so html/body get height 100% (easyprint's
 * "max-height: 98%" without it was dead CSS — a map taller than the page
 * was sliced across pages, preceded by an empty page).
 */
export const printMap = async (map: LeafletMap, pageSize: string) => {
  const dataUrl = await captureMap(map)

  const printWindow = window.open('', '_blank', 'width=800,height=600')
  if (!printWindow) {
    throw new Error(
      'Das Druckfenster wurde vom Browser blockiert. Bitte Popups für diese Seite erlauben.',
    )
  }
  const pageRule = pageSize ? `size: ${pageSize}; margin: 0;` : 'margin: 0;'
  printWindow.document.write(`<!DOCTYPE html><html><head>
    <title>AP-Flora</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
      @media print {
        @page { ${pageRule} }
      }
    </style>
  </head><body>
    <img src="${dataUrl}"
      onload="setTimeout(() => { window.print(); window.close() }, 100)">
  </body></html>`)
  printWindow.document.close()
}
