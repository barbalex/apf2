export const layerLegends = ({ apId }) => ({
  ZhSvoGrey: [
    {
      name: 'Zonen Schutzverordnungen (Raster)',
      url: 'https://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen-raster&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagernde Schutzzonen',
      url: 'https://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagernde-schutzzonen&format=image/png&STYLE=default',
    },
  ],
  ZhLrVegKartierungen: [
    {
      name: 'Übersicht',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=uebersicht&format=image/png&STYLE=default',
    },
    {
      name: 'Trockenstandorte 2003 TWW nat. Bedeutung BAFU',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken03&format=image/png&STYLE=default',
    },
    {
      name: 'Trockenstandorte 1991 ZH-Oberland Dickenmann',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken91&format=image/png&STYLE=default',
    },
    {
      name: 'Trockenstandorte 1989 ZH-Oberland BGU/AquaTerra',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=trocken89&format=image/png&STYLE=default',
    },
    {
      name: 'Hoch- und Übergangsmoore nat. Bedeutung BAFU',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=moore&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2010 Maedlesten FORNAT',
      url: 'https://www.w3.org/1999/xlink xlink:type="simple" xlink:href="https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-10&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2008 Werrikerriet',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-08&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2008 Glattaltläufe',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht08-glatt&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2007-10 Pfäffikersee topos',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-07-10&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2006 Neeracherried topos',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-06&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 2001 Drumlinlandschaft',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-01&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1991',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-91&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1986',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-86&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1976/77',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-76-77&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1964 Neeracherried Klötzli',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-64&format=image/png&STYLE=default',
    },
    {
      name: 'Feuchtgebietskartierung 1961 Flughafen Klötzli',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=feucht-61&format=image/png&STYLE=default',
    },
    {
      name: 'Auenvegetation 1993 nat. Objekte BAFU',
      url: 'https://wms.zh.ch/FnsLRKZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=auen-93&format=image/png&STYLE=default',
    },
  ],
  ZhLichteWaelder: [
    {
      name: 'Objekte',
      url: 'https://wms.zh.ch/FnsLWZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=objekte-lichte-waelder-kanton-zuerich&format=image/png&STYLE=default',
    },
  ],
  ZhWaelderVegetation: [
    {
      name: 'Waldgesellschaften',
      url: 'https://wms.zh.ch/FnsLWZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=waldgesellschaften&format=image/png&STYLE=default',
    },
  ],
  ZhSvoColor: [
    {
      name: 'Zonen Schutzverordnungen',
      url: 'https://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=zonen-schutzverordnungen&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagernde Schutzzonen',
      url: 'https://wms.zh.ch/FnsSVOZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagernde-schutzzonen&format=image/png&STYLE=default',
    },
  ],
  ZhPflegeplan: [
    {
      name: 'Pflegeplan',
      url: 'https://wms.zh.ch/FnsPflegeZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=pfpl-aktuell&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagerung 1',
      url: 'https://wms.zh.ch/FnsPflegeZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagerung1-aktuell&format=image/png&STYLE=default',
    },
    {
      name: 'Überlagerung 2',
      url: 'https://wms.zh.ch/FnsPflegeZHWMS?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=ueberlagerung2-aktuell&format=image/png&STYLE=default',
    },
  ],
  MassnahmenFlaechen: [
    {
      name: 'Flächen',
      url: `https://wms.prod.qgiscloud.com/FNS/${apId}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=flaechen&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0`,
    },
  ],
  MassnahmenLinien: [
    {
      name: 'Linien',
      url: `https://wms.prod.qgiscloud.com/FNS/${apId}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=linien&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0`,
    },
  ],
  MassnahmenPunkte: [
    {
      name: 'Punkte',
      url: `https://wms.prod.qgiscloud.com/FNS/${apId}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=punkte&FORMAT=image/png&STYLE=default&SLD_VERSION=1.1.0`,
    },
  ],
})