# Vendored `@geoman-io/leaflet-geoman-free` for Leaflet 2

This tarball is the `leaflet-v2` branch of geoman (upstream PR
[geoman-io/leaflet-geoman#1602](https://github.com/geoman-io/leaflet-geoman/pull/1602),
head commit `661516a6bc0252a92fbd0951fc0ba49172f34828`), **plus local patches**
that make it run against `leaflet@2.0.0-beta.1` (also verified against
`2.0.0-beta.2` in this app and in ps). The PR was written against
`2.0.0-alpha.1` and is still a draft — without these patches it crashes on
startup (`initialize()` guard, see below).

The npm package name is misleading: the fork's `package.json` still says
`2.18.3`, but it implements the **v3 API** (`Geoman.initialize()`,
`map.geoman.*`, `geoman:create` events, `leaflet-geoman-*` CSS classes).

## Local patches (`leaflet-geoman-leaflet2-661516a.patch`)

1. **v1 `initialize()` → constructor dispatch.** Leaflet 2's `Class` throws when
   an instance still has `initialize`. Renaming every `initialize` to
   `constructor` is not enough: in Leaflet 1 only the *most-derived*
   `initialize` ran (e.g. `Draw`'s constructor would otherwise re-enter itself
   through `new Draw[shape](…)` for every subclass, and inherited-but-undefined
   ctors like `Edit.Polygon` would never set `_layer`). Solution: bodies live in
   a `_init()` method; only hierarchy roots (`GeomanMap`, `Draw`, `Toolbar`,
   `GeomanControl`, `Edit`, `Edit.LayerGroup`) define a
   `constructor(...args) { super(); this._init(...args) }`. Prototype dispatch
   then reproduces v1 semantics exactly.
2. `new Icon.Default()` → `new DefaultIcon()` (alias removed in Leaflet 2).
3. `CRS.Earth.R` → `EarthCRS.R` and `crs === CRS.Simple` →
   `crs instanceof SimpleCRS` (CRS instances became classes).
4. `getRenderer()` helper delegates to the new public `map.getRenderer(layer)`
   and falls back to `map._renderer` for non-Path layers in custom panes
   (Leaflet 2's `_getPaneRenderer` changed its signature from pane name to
   layer and calls `layer._createRenderer`, which markers don't have).

## Rebuilding

```bash
git clone --depth 1 --branch leaflet-v2 https://github.com/Falke-Design/leaflet.pm.git
cd leaflet.pm
git checkout 661516a6bc0252a92fbd0951fc0ba49172f34828
git apply /path/to/apf2/vendor/leaflet-geoman-leaflet2-661516a.patch
npm install --ignore-scripts
node bundle.mjs          # minified dist/ (set minify:false in bundle.mjs to debug)
npm pack --pack-destination /tmp
cp /tmp/geoman-io-leaflet-geoman-free-2.18.3.tgz /path/to/apf2/vendor/leaflet-geoman-free-leaflet2-661516a-patched.tgz
```

Watch the upstream PR: once it merges and a real Leaflet-2 release of geoman
lands on npm, drop the vendored tarball and the `file:` dependency.
