#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const srcComponentsDir = path.join(__dirname, 'src', 'components')

// Recursively find all .tsx files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList)
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Analyze a single file
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')

  // Check if it imports observer
  const importsObserver =
    /import.*observer.*from.*['"]mobx-react-lite['"]/.test(content)

  if (!importsObserver) {
    return null
  }

  // Check if it uses MobxContext
  const usesMobxContext = /useContext\s*\(\s*MobxContext\s*\)/.test(content)

  if (!usesMobxContext) {
    return {
      path: filePath.replace(__dirname + '/', ''),
      usesStore: false,
      reason: 'No useContext(MobxContext)',
    }
  }

  // Extract store variable name (might not always be 'store')
  // Could be: const store = useContext(MobxContext)
  // Or: const { prop1, prop2 } = useContext(MobxContext)
  const storeMatch = content.match(
    /const\s+(\w+)\s*=\s*useContext\s*\(\s*MobxContext\s*\)/,
  )
  const destructureMatch = content.match(
    /const\s+\{[^}]+\}\s*=\s*useContext\s*\(\s*MobxContext\s*\)/,
  )

  // If destructuring directly from useContext, it's using the store
  if (destructureMatch) {
    return {
      path: filePath.replace(__dirname + '/', ''),
      usesStore: true,
      reason: 'Destructures from MobxContext',
    }
  }

  if (!storeMatch) {
    return {
      path: filePath.replace(__dirname + '/', ''),
      usesStore: false,
      reason: 'Uses MobxContext but unusual pattern',
    }
  }

  const storeName = storeMatch[1]

  // Check if it actually uses the store variable in any meaningful way:
  // 1. storeName.property
  // 2. destructuring: { ... } = storeName or = destructureStore or similar
  // 3. Used as function parameter or variable
  // 4. Used in template literals

  // Create patterns to search for store usage
  const patterns = [
    new RegExp(`\\b${storeName}\\.[a-zA-Z_]`, 'g'), // store.property
    new RegExp(`\\{[^}]+\\}\\s*=\\s*${storeName}`, 'g'), // destructuring
    new RegExp(`[^a-zA-Z0-9_]${storeName}[,\\s\\)\\}]`, 'g'), // used as param/variable
  ]

  const usesStore = patterns.some((pattern) => pattern.test(content))

  return {
    path: filePath.replace(__dirname + '/', ''),
    usesStore: usesStore,
    reason:
      usesStore ?
        'Uses store properties'
      : 'Has MobxContext but no store usage',
  }
}

// Main analysis
const allFiles = findTsxFiles(srcComponentsDir)
const results = {
  unnecessaryObserver: [],
  needsObserver: [],
  noObserver: [],
}

let analyzed = 0
allFiles.forEach((file) => {
  const result = analyzeFile(file)
  analyzed++

  if (!result) {
    // Doesn't import observer
    results.noObserver.push(file.replace(__dirname + '/', ''))
  } else if (result.usesStore) {
    results.needsObserver.push(result.path)
  } else {
    results.unnecessaryObserver.push(result.path)
  }

  // Print progress every 50 files
  if (analyzed % 50 === 0) {
    console.error(`Analyzed ${analyzed}/${allFiles.length} files...`)
  }
})

console.log(
  JSON.stringify(
    {
      unnecessaryObserver: results.unnecessaryObserver,
      needsObserver: results.needsObserver,
      totalAnalyzed: analyzed,
      totalWithObserver:
        results.unnecessaryObserver.length + results.needsObserver.length,
      totalUnnecessary: results.unnecessaryObserver.length,
      totalNeeded: results.needsObserver.length,
    },
    null,
    2,
  ),
)
