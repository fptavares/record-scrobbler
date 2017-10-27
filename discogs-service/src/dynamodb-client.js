const https = require('https');
const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
import config from './config';

AWS.config.update({
  region: config.AWS_REGION,
  httpOptions: {
    agent: new https.Agent({
      rejectUnauthorized: true,
      keepAlive: true
    })
  }
});
//AWS.config.loadFromPath('./aws-config.json');

var dynamodb = new AWS.DynamoDB.DocumentClient();

/*const toDB = {
  id: 'id',
  releaseId: 'rd',
  artist: 'a',
  title: 't',
  year: 'y',
  thumb: 'i',
  rating: 'r',
  dateAdded: 'd',
  folderId: 'f',
};
const fromDB = Object.keys(toDB).reduce((acc, key) => acc[toDB[key]] = key, {}); // inverse object
*/

function getOne(tableName, key) {
  const params = {
    TableName: tableName,
    Key: key
  };

  console.time('getOne');
  return new Promise(
    (resolve, reject) => dynamodb.get(params, function(err, data) {
      console.timeEnd('getOne');
      if (err) {
        return reject(err);
      }
      resolve(data.Item);
    })
  );
}

function getMany(tableName, keys) {
  const params = {
    RequestItems: {
      [tableName]: {
        Keys: keys
      }
    }
  };

  console.time('getMany');
  return new Promise(
    (resolve, reject) => dynamodb.batchGet(params, function(err, data) {
      console.timeEnd('getMany');
      if (err) {
        return reject(err);
      }
      resolve(data.Responses.CollectionAlbum);
    })
  );
}

function put(tableName, values, ttl, timeRef) {
  const now = timeRef || Math.floor(Date.now() / 1000);
  const item = {
    ttl: now + ttl,
    ...values,
  };
  const params = {
    TableName: tableName,
    Item: item
  };

  return new Promise(
    (resolve, reject) => dynamodb.put(params, function(err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    })
  );
}

function putUserCollection(username, user, collection) {
  const timeRef = Math.floor(Date.now() / 1000); // make sure all expire at the same time
  const putOps = [];
  // Add user
  user.username = username;
  putOps.push(put('User', user, config.COLLECTION_TTL, timeRef));
  // Add collection
  collection.forEach(album  => {
    album.username = username;
    album.search = album.artist.toLowerCase() + ' ' + album.title.toLowerCase();
    putOps.push(put('CollectionAlbum', album, config.COLLECTION_TTL, timeRef));
  });

  return Promise.all(putOps);
}

function queryCollection(username, folder, search, after, size) {
  const params = {
    TableName: 'CollectionAlbum',
    ReturnConsumedCapacity: 'TOTAL'
  };

  const filters = [];
  const values = {};

  if (folder) {
    filters.push('folderId = :folder');
    values[':folder'] = parseInt(folder);
  }

  if (search) {
    filters.push('contains (#search, :q)');
    values[':q'] = search.toLowerCase();
    params.ExpressionAttributeNames = { "#search": "search" };
  }

  if (after) {
    params.ExclusiveStartKey = {
      username,
      id: parseInt(after)
    };
  }

  values[':username'] = username;
  params.ExpressionAttributeValues = values;

  function generateReturn(data) {
    return {
      albums: data.Items,
      endCursor: data.LastEvaluatedKey != null ? data.LastEvaluatedKey.id : 0,
      moreAlbums: data.LastEvaluatedKey != null
    };
  }

  return new Promise((resolve, reject) => {
    if (filters.length > 0) {
      filters.unshift('username = :username');
      params.FilterExpression = filters.join(' and ');

      console.time('scan');
      dynamodb.scan(params, function(err, data) {
        console.timeEnd('scan');
        if (err) {
          return reject(err);
        }
        resolve(generateReturn(data));
      });
    } else {
      params.KeyConditionExpression = 'username = :username';
      params.ScanIndexForward = false;
      params.Limit = parseInt(size);

      console.time('query');
      dynamodb.query(params, function(err, data) {
        console.timeEnd('query');
        if (err) {
          return reject(err);
        }
        resolve(generateReturn(data));
      });
    }
  });
}

const methods = {
  // get
  getCollectionAlbums: (username, albumIds) => getMany(
    "CollectionAlbum",
    albumIds.map(id => ({ username, id }))
  ),
  getUser: (username) => getOne(
    "User",
    { username }
  ),
  getReleases: (releaseIds) => getMany(
    "Release",
    { releaseIds }
  ),
  // put
  putUserCollection,
  putRelease: values => put(
    "Release",
    values,
    config.RELEASE_TTL
  ),
  // query
  queryCollection,
};

export default methods;
