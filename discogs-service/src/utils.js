/* normalize results when querying multiple IDs */
function indexResults(results, indexField) {
  const indexedResults = new Map();
  results.forEach(res => indexedResults.set(res[indexField], res));
  return indexedResults;
}
export function normalizeResults(results, keys, indexField='id') {
  const indexedResults = indexResults(results, indexField);
  const normalized = keys.map(
    key => indexedResults.get(key[indexField])
      || { [indexField]: key[indexField] }
    );
  return normalized;
}
export async function normalizeResultsAndCallback(results, keys, indexField, missingCallback) {
  const indexedResults = indexResults(results, indexField);
  return Promise.all(
    keys.map(
      async(key) => indexedResults.get(key[indexField])
        || (missingCallback && await missingCallback(key))
        || { [indexField]: key[indexField] }
    ));
}
