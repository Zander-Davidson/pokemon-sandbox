// given a guid and an array of items with guid properties,
// return the item with matching guid if one exists. else return null
const getCacheItemByGuid = (array, guid) => {
    let matchingIndex = array.findIndex(item => item.guid === guid);

    if (matchingIndex !== -1) {
        return array[matchingIndex];
    } else {
        return null;
    }
}

// given a cache of any size and an array of items, return a new array of the same size
// as the cache. The new cache will have the given items at the front, and will have 
// lost the same number of items from the end.
const cachePush = (cache, items) => {
    return [...items, ...cache.splice(cache.length - items.length, 1)];
}

// given a cache of items with guids as keys, search the cache by guid.
// if there is a match, return the cache with that item moved to the front.
// else, return null. 
const cacheSearchAndSplice = (cache, guid) => {
    // since we have global ids, this array should always have 1 or 0 matching items
    let matchingIndex = cache.findIndex(item => item.guid === guid);

    // if a match is found, move it to the front of the array
    if (matchingIndex !== -1) {
        return [cache[matchingIndex], ...cache.splice(matchingIndex, 1)];
    } else {
        return null;
    }
}


export {
    getCacheItemByGuid,
    cachePush,
    cacheSearchAndSplice,
}