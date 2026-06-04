export const overlays = [
  { label: 'Markierungen', value: 'Markierungen' },
  { label: 'Detailpläne', value: 'Detailplaene' },
  {
    label: 'Massnahmenpläne der aktiven Art, Flächen',
    value: 'MassnahmenFlaechen',
  },
  {
    label: 'Massnahmenpläne der aktiven Art, Linien',
    value: 'MassnahmenLinien',
  },
  {
    label: 'Massnahmenpläne der aktiven Art, Punkte',
    value: 'MassnahmenPunkte',
  },
  { label: 'NS-Gebiete Betreuung', value: 'Betreuungsgebiete' },
  { label: 'ZH Übersichtsplan', value: 'ZhUep' },
  {
    label: 'Gemeinden',
    value: 'Gemeinden',
    // wmsUrl: '//wms.geo.admin.ch',
    // wmsVersion: '1.3.0',
    // wmsCrs: 'EPSG:4326',
    // wmsLayers: 'gemeinden',
    // wmsQueryLayers: 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
    // wmsInfoFormat: 'text/plain',
  },
  {
    label: 'SVO grau',
    value: 'ZhSvoGrey',
    // get info returns: ERR_BLOCKED_BY_ORB. Only in dev?
    name: 'ZhSvoGrey',
    wmsUrl: '//wms.zh.ch/FnsSVOZHWMS',
    wmsVersion: '1.3.0',
    wmsCrs: 'EPSG:4326',
    wmsLayers: 'ueberlagernde-schutzzonen,schutzverordnungsobjekte',
    wmsQueryLayers: 'ueberlagernde-schutzzonen,schutzverordnungsobjekte',
    wmsInfoFormat: 'application/vnd.ogc.gml',
  },
  {
    label: 'SVO farbig',
    value: 'ZhSvoColor',
    // get info returns: ERR_BLOCKED_BY_ORB
    name: 'ZhSvoColor',
    wmsUrl: '//wms.zh.ch/FnsSVOZHWMS',
    wmsVersion: '1.3.0',
    wmsCrs: 'EPSG:4326',
    wmsLayers:
      'zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte',
    wmsQueryLayers:
      'zonen-schutzverordnungen,ueberlagernde-schutzzonen,schutzverordnungsobjekte',
    wmsInfoFormat: 'application/vnd.ogc.gml',
  },
  { label: 'Pflegeplan', value: 'ZhPflegeplan' },
  {
    label: 'Lebensraum- und Vegetationskartierungen',
    value: 'ZhLrVegKartierungen',
  },
  { label: 'Wälder: lichte', value: 'ZhLichteWaelder' },
  {
    label: 'Wälder: Vegetation',
    value: 'ZhWaelderVegetation',
    // get info works, returns data
    name: 'ZhWaelderVegetation',
    wmsUrl: '//wms.zh.ch/WaldVKWMS',
    wmsVersion: '1.3.0',
    wmsCrs: 'EPSG:4326',
    wmsLayers: 'waldgesellschaften',
    wmsQueryLayers: 'waldgesellschaften',
    wmsInfoFormat: 'application/vnd.ogc.gml',
  },
  {
    label: 'Forstreviere (WMS)',
    value: 'ZhForstreviereWms',
    wmsUrl: '//wms.zh.ch/WaldEGZH',
    wmsVersion: '1.3.0',
    wmsCrs: 'EPSG:4326',
    wmsLayers: 'forstreviere',
    wmsQueryLayers: 'forstreviere',
    wmsInfoFormat: 'application/vnd.ogc.gml',
  },
  {
    label: 'Forstreviere. Stand: 2025.04.10',
    value: 'Forstreviere',
    // get info works, returns NO data
    name: 'ZhForstreviereWms',
    wmsUrl: '//wms.zh.ch/WaldVKWMS',
    wmsVersion: '1.3.0',
    wmsCrs: 'EPSG:4326',
    wmsLayers: 'waldgesellschaften',
    wmsQueryLayers: 'waldgesellschaften',
    wmsInfoFormat: 'application/vnd.ogc.gml', // application/vnd.ogc.gml
  },
]
