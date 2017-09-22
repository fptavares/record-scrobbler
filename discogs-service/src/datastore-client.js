import Datastore from '@google-cloud/datastore';
import { normalizeResults } from './utils';

// Instantiates a client
const datastore = Datastore({
  projectId: 'record-scrobbler'
});

async function getMany(kind, ids, parent=[], missingCallback, idField = 'id') {
  return normalizeResults(
    await datastore.get(ids.map(id => datastore.key([...parent, kind, id]))),
    ids,
    idField,
    missingCallback
  );
}
function getOne(kind, id, parent=[]) {
  return datastore.get(datastore.key([...parent, kind, id]));
}

function put(kind, id, data) {
  data.created = Date.now();

  const item = {
    key: datastore.key([kind, id]),
    data
  };

  return datastore.save(item);
}

async function queryCollection(username, folder, search, from, size) {
  let query = datastore.createQuery('CollectionAlbum');

  query = query.hasAncestor(datastore.key(['User', username]))
    .order('dateAdded', { descending: true })
    .limit(size);

  if (folder) {
    query = query.filter('folderId', '=', folder);
  }
  if (search) {
    query = query.filter('artist', '=', search);
    // TODO: replace with proper solution for full text search
  }
  if (from) {
    query = query.start(from);
  }

  const [ albums, { endCursor, moreResults } ] = await query.run();

  console.log("searchCollection moreResults:", moreResults);

  return {
    albums,
    endCursor,
    moreAlbums: moreResults !== datastore.NO_MORE_RESULTS
  };
}

function putUserCollection(username, user, collection) {
  const items = [];
  // Add user
  user.created = Date.now();
  items.push({
    key: datastore.key(["User", username]),
    data: user
  });
  // Add collection
  collection.forEach(album  => {
    items.push({
      key: datastore.key(["User", username, "CollectionAlbum", album.albumId]),
      data: album
    });
  });

  return datastore.save(items);
}

const methods = {
  // get
  getCollectionAlbums: (username, albumIds) => getMany(
    "CollectionAlbum",
    albumIds,
    ["User", username]),
  getReleases: (releaseIds, missingCallback) => getMany(
    "Release",
    releaseIds,
    null,
    missingCallback),
  getUser: username => getOne("User", username),
  // put
  putRelease: (releaseId, release) => put("Release", releaseId, release),
  putUserCollection,
  // query
  queryCollection,
};

export default methods;
