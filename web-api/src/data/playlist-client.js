import redis from 'redis';
import config from '../config';

let client;

export function initRedisClient() {
  if (!config.REDIS_PWD) {
    throw new Error('Redis password not configured!');
  }
  client = redis.createClient(config.REDIS_URL, {
    password: config.REDIS_PWD
  });
  client.on("error", function (err) {
    console.error("Redis error:", err);
  });
}

function createRedisPlaylistItem(albumId, count) {
  return {
    albumId,
    count,
  }
}

function incrementPlaylistItem(username, albumId, increment) {
  return new Promise((resolve, reject) => {
    client.hincrby([username, albumId, increment], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(createRedisPlaylistItem(albumId, result));
    });
  });
}

export function addToPlaylist(username, albumId) {
  return incrementPlaylistItem(username, albumId, 1);
}
export function removeOneFromPlaylist(username, albumId) {
  return incrementPlaylistItem(username, albumId, -1);
}
export function removeFromPlaylist(username, albumId) {
  return new Promise((resolve, reject) => {
    client.hdel([username, albumId], (error) => {
      if (error) {
        return reject(error);
      }
      resolve(createRedisPlaylistItem(albumId, null));
    });
  });
}
export function clearPlaylist(username) {
  return new Promise((resolve, reject) => {
    client.del([username], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result ? true : false);
    });
  });
}

export function getPlaylist(username) {
  return new Promise((resolve, reject) => {
    client.hgetall(username, (error, results) => {
      if (error) {
        return reject(error);
      } else if (results === null || results.length === 0) {
        return resolve(new Map([]));
      } else {
        const playlistMap = new Map();
        Object.keys(results).forEach(key => {
          playlistMap.set(parseInt(key), parseInt(results[key]));
        });
        resolve(playlistMap);
      }
    });
  });
}
