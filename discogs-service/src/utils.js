/* normalize results when querying multiple IDs */
function indexResults(results, indexField) {
  const indexedResults = new Map();
  results.forEach(res => {
    indexedResults.set(res[indexField], res);
  });
  return indexedResults;
}
export async function normalizeResults(results, keys, indexField, missingCallback) {
  const indexedResults = indexResults(results, indexField);
  return Promise.all(
    keys.map(
      async(key) => indexedResults.get(key)
        || (missingCallback && await missingCallback(key))
        || { [indexField]: key }
    )
  );
}
