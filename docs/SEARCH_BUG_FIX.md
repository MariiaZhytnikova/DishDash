# Search Bug Fix

## Issue
When searching for recipes (e.g., "miso soup") and then clearing the search box, the filtered results remained on screen instead of showing all recipes again.

## Steps to Reproduce
1. Go to the Recipes page
2. Type "miso soup" in the search box
3. Press Enter or click Search button
4. See only miso soup recipe displayed
5. Delete the search text (empty search box)
6. Press Enter or click Search button
7. **BUG**: No recipes shown, screen remains empty or shows only previous filtered results

## Expected Behavior
When the search box is cleared and search is triggered, all recipes should be displayed again.

## Root Cause
The `handleSearch` function in `Recipes.tsx` had an early return when the search query was empty:

```tsx
const handleSearch = async () => {
  console.log("handleSearch called with query:", searchQuery);
  
  if (!searchQuery.trim()) {
    return;  // ← BUG: Just returns, doesn't reload recipes
  }

  setLoading(true);
  try {
    setError(null);
    const res = await searchRecipes({ settings: { query: searchQuery } });
    console.log("Search results:", res);
    setData(res);
  } catch (e) {
    console.error("Search error:", e);
    setError((e as Error).message ?? "Unknown error");
  } finally {
    setLoading(false);
  }
};
```

When the search query was empty, the function simply returned without updating the recipe list, leaving the previous filtered results on screen.

## Solution
Modified the `handleSearch` function to reload all recipes when the search query is empty:

```tsx
const handleSearch = async () => {
  console.log("handleSearch called with query:", searchQuery);
  
  setLoading(true);
  try {
    setError(null);
    
    // If search query is empty, load all recipes
    if (!searchQuery.trim()) {
      const res = await getRecipes();
      setData(res);
    } else {
      // Otherwise, search for recipes
      const res = await searchRecipes({ settings: { query: searchQuery } });
      console.log("Search results:", res);
      setData(res);
    }
  } catch (e) {
    console.error("Search error:", e);
    setError((e as Error).message ?? "Unknown error");
  } finally {
    setLoading(false);
  }
};
```

## Changes Made
- **File**: `/frontend/src/pages/Recipes.tsx`
- **Function**: `handleSearch`
- **Change**: Instead of returning early when search is empty, now calls `getRecipes()` to reload all recipes

## Testing
### Test Case 1: Search and Clear
1. Navigate to Recipes page
2. Type "miso soup" in search box
3. Press Enter → Should show only miso soup recipe
4. Clear the search box (delete all text)
5. Press Enter → Should show all recipes ✅

### Test Case 2: Empty Search on Page Load
1. Navigate to Recipes page
2. Without typing anything, click Search button
3. Should show all recipes (same as initial state) ✅

### Test Case 3: Multiple Searches
1. Search for "chicken" → Shows chicken recipes
2. Search for "soup" → Shows soup recipes
3. Clear and search → Shows all recipes ✅

## Notes
- The Favorites page (`Favorites.tsx`) already had correct handling for empty search queries, so no changes were needed there
- The fix maintains loading states and error handling
- Console logs remain for debugging purposes

## Related Files
- `/frontend/src/pages/Recipes.tsx` - Fixed
- `/frontend/src/pages/Favorites.tsx` - Already correct (no changes needed)
- `/frontend/src/api/recipesApi.ts` - API functions used (no changes)

## Impact
- **User Experience**: Much improved - users can now easily return to browsing all recipes after searching
- **Performance**: Minimal - only calls API when search is triggered
- **Backward Compatibility**: Fully compatible - existing search functionality still works

## Status
✅ Fixed and tested locally
⚠️ Needs deployment to production (GitHub Pages)
