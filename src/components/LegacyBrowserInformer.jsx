const LegacyBrowserInformer = () => {
  // inform users of old browsers
  const browserUpdateConfiguration = {
    required: { e: -2, f: -2, o: -2, s: -2, c: -2 },
    text: {
      msg: 'Ihr Browser ({brow_name}) ist veraltet.',
      msgmore:
        'Aktualisieren Sie ihn für mehr Sicherheit, Geschwindigkeit und weil apflora einen aktuellen Browser voraussetzt.',
      bupdate: 'Browser aktualisieren',
      bignore: 'Ignorieren',
    },
    style: 'bottom',
    // test: true,
  }
  import('browser-update').then((module) =>
    module.default(browserUpdateConfiguration),
  )

  return null
}

export default LegacyBrowserInformer
