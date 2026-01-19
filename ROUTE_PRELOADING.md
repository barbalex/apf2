# Route Data Preloading Implementation

## Overview

Implemented comprehensive route data preloading to eliminate loading states when navigating between routes. Data is prefetched both on hover and before navigation, providing instant transitions.

## Components Created

### 1. prefetchRouteData.ts

**Location**: `src/modules/prefetchRouteData.ts`

**Purpose**: Maps route patterns to GraphQL queries and prefetches data before navigation.

**Features**:

- 22 route patterns covering all major entity types
- Regex-based route matching
- Parameter extraction from URLs
- Cache checking to avoid redundant fetches
- Error handling

**Supported Routes**:

- Art (AP)
- Population (Pop)
- Teilpopulation (Tpop)
- Berichte (Tpopber, Popber, Apber)
- Massnahmen (Tpopmassn, Tpopmassnber, Popmassnber)
- Kontrollen (Feldkontr, Freiwkontr, Kontrzaehl)
- Idealbiotop
- Taxonomie (Apart)
- Adresse
- EK-Zähleinheit
- Benutzer
- Erfolgskriterium
- Ziel
- Assoziierte Art
- Projekt
- Beobachtungen

**Usage**:

```typescript
await prefetchRouteData({ path: '/Daten/Projekte/...', store })
```

### 2. PrefetchLink Component

**Location**: `src/components/shared/PrefetchLink.tsx`

**Purpose**: A Link wrapper that automatically prefetches route data on hover.

**Features**:

- Drop-in replacement for React Router's Link
- Prefetches on `onMouseEnter`
- Passes through all Link props
- Observer pattern for MobX integration

**Usage**:

```tsx
<PrefetchLink to="/some/route">Navigate</PrefetchLink>
```

## Components Updated

### 1. Nav.tsx (Bookmarks Navigation)

**Changed**: `Link` → `PrefetchLink`
**Benefit**: Breadcrumb navigation now prefetches on hover

### 2. Label.tsx (Bookmark Labels)

**Changed**: `Link` → `PrefetchLink`
**Benefit**: Bookmark links now prefetch on hover

### 3. List Component

**Enhanced with**:

- `onMouseEnter` handler for hover prefetch
- `await prefetchRouteData()` before `navigate()` call
  **Benefit**: List items prefetch on hover and before click

### 4. Home Menu Components

**Changed**: `Link` → `PrefetchLink` in:

- `AppBar/Bar/Home/index.tsx`
- `AppBar/Bar/Home/Dokumentation.tsx`
  **Benefit**: Main navigation menu prefetches on hover

## Performance Strategy

### Two-Level Prefetching

1. **Hover Prefetch** (Optimistic)
   - Triggered on `onMouseEnter`
   - Non-blocking
   - Happens 200-500ms before click (typical hover time)
   - Most common case for desktop users

2. **Pre-Navigation Prefetch** (Guaranteed)
   - Triggered before `navigate()` call
   - Ensures data is loaded even without hover
   - Fallback for touch devices
   - Only runs if not already cached

### Cache Strategy

- Checks `tsQueryClient.getQueryData()` before prefetching
- Avoids redundant network requests
- Leverages React Query's cache
- Data persists across navigations

## Route Pattern Matching

Routes are matched using regex patterns with parameter extraction:

```typescript
{
  pattern: /\/Daten\/Projekte\/[^/]+\/Arten\/([^/]+)$/,
  extractParams: (match) => ({ apId: match[1] }),
  getQueryConfig: ({ apId }) => ({
    query: apQuery,
    queryKey: ['ap', apId],
    variables: { id: apId },
  }),
}
```

**Benefits**:

- Flexible URL matching
- Type-safe parameter extraction
- Handles URL-encoded characters
- Supports nested routes

## Implementation Details

### Error Handling

- Try-catch wrapper prevents prefetch failures from breaking navigation
- Console errors for debugging
- Graceful degradation (navigation works even if prefetch fails)

### MobX Integration

- Uses `store.apolloClient` and `store.tsQueryClient`
- Observer pattern for reactivity
- Consistent with existing hover prefetch pattern

### React Router Compatibility

- Works with both string and object `to` props
- Preserves search params
- Supports relative paths

## Testing Recommendations

1. **Hover Test**: Hover over links and verify network tab shows prefetch
2. **Cache Test**: Navigate away and back, verify no duplicate fetches
3. **Touch Test**: On touch device, verify data loads before navigation completes
4. **Error Test**: Temporarily break a query, verify navigation still works

## Performance Impact

**Expected Improvements**:

- ~200-500ms faster perceived navigation (hover time saved)
- Zero loading states for already-prefetched routes
- Reduced time-to-interactive after navigation
- Better user experience on slower connections

**Network Considerations**:

- Slightly increased network usage (prefetch on hover)
- Mitigated by cache checking
- Worth the tradeoff for better UX
- Only prefetches data user is likely to need

## Future Enhancements

1. **Preload on Router Level**: Use React Router loaders for route-level prefetch
2. **Intelligent Prefetch**: Track navigation patterns and prefetch predicted routes
3. **Background Prefetch**: Prefetch common routes in idle time
4. **Priority Prefetch**: Use Intersection Observer for visible links
5. **Analytics**: Track prefetch hit rate and adjust strategy

## Related Files

All files in this implementation:

- `src/modules/prefetchRouteData.ts` (new)
- `src/components/shared/PrefetchLink.tsx` (new)
- `src/components/Bookmarks/NavTo/Nav.tsx` (updated)
- `src/components/Bookmarks/Bookmark/Label.tsx` (updated)
- `src/components/shared/List/index.tsx` (updated)
- `src/components/AppBar/Bar/Home/index.tsx` (updated)
- `src/components/AppBar/Bar/Home/Dokumentation.tsx` (updated)

## Compatibility with Existing Prefetch

This route preloading works alongside the existing tree node hover prefetch:

- **Tree nodes**: Prefetch via `prefetchNodeData` (already implemented)
- **Route navigation**: Prefetch via `prefetchRouteData` (this implementation)
- Both share the same cache (React Query)
- No conflicts or redundant fetches
