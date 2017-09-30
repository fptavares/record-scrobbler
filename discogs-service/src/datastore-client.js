import Datastore from '@google-cloud/datastore';
import { normalizeResults } from './utils';
import { GCLOUD_PROJECT } from './config';

// Instantiates a client
const datastore = Datastore({
  projectId: GCLOUD_PROJECT
});

async function getMany(kind, ids, parent=[], missingCallback, idField='id') {
  console.time('getMany');
  const data = await datastore.get(ids.map(id => datastore.key([...parent, kind, id])));
  console.timeEnd('getMany');
  return normalizeResults(
    data[0], // the results are wrapped around an array of 1 - https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/1.1.0/datastore?method=get
    ids,
    idField,
    missingCallback
  );
}

async function getOne(kind, id, parent=[]) {
  console.time('getOne');
  const data = await datastore.get(datastore.key([...parent, kind, id]));
  console.timeEnd('getOne');
  return data[0];
}

function put(kind, id, data) {
  data.created = Date.now();

  const item = {
    key: datastore.key([kind, id]),
    data
  };

  return datastore.save(item);
}

async function queryCollection(username, folder, search, after, size) {
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
  if (after) {
    query = query.start(after);
  }

  console.time('query');
  const [ albums, { endCursor, moreResults } ] = await query.run();
  console.timeEnd('query');

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
      key: datastore.key(["User", username, "CollectionAlbum", album.id]),
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
    [],
    missingCallback),
  getUser: username => getOne("User", username),
  // put
  putRelease: (releaseId, release) => put("Release", releaseId, release),
  putUserCollection,
  // query
  queryCollection,
};

export default methods;
