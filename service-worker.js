"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/record-scrobbler/index.html","7124488b1458435559ec53b35dbd68a2"],["/record-scrobbler/static/css/main.26f2f064.css","333f6e12f33d2f1ed9ff8fc15691e55d"],["/record-scrobbler/static/js/main.3ee6f6fd.js","9d5983303fa619dbbec4db383c810425"],["/record-scrobbler/static/media/discogs_logo_white.93f94c3f.svg","93f94c3fa166bf85a74574ca2f02d376"],["/record-scrobbler/static/media/discogs_vinyl_record_mark.022e1ade.svg","022e1ade85b5ff4a923b2e4bb5e3a2d4"],["/record-scrobbler/static/media/github.cf7e8c13.svg","cf7e8c133eca4e1a8e411666f05863a4"],["/record-scrobbler/static/media/lastfm.8f5f860c.svg","8f5f860cf2a4f16976762a1f60796f5e"],["/record-scrobbler/static/media/loading.ec119390.svg","ec11939093d8952ae06c54bc0eaefe47"],["/record-scrobbler/static/media/logo.c2ccc92f.svg","c2ccc92fa73504558187377960e17d01"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,r){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=r),t.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(r){return new Response(r,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,r,t,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(r)+"="+encodeURIComponent(t)),c.toString()},isPathWhitelisted=function(e,r){if(0===e.length)return!0;var t=new URL(r).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,r){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return r.every(function(r){return!r.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var r=e[0],t=e[1],n=new URL(r,self.location),c=createCacheKey(n,hashParamName,t,/\.\w{8}\./);return[n.toString(),c]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(r){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!r.has(t)){var n=new Request(t,{credentials:"same-origin"});return fetch(n).then(function(r){if(!r.ok)throw new Error("Request for "+t+" returned a response with status "+r.status);return cleanResponse(r).then(function(r){return e.put(t,r)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var r=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!r.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var r,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(r=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,"index.html"),r=urlsToCacheKeys.has(t));!r&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(t=new URL("/record-scrobbler/index.html",self.location).toString(),r=urlsToCacheKeys.has(t)),r&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(r){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,r),fetch(e.request)}))}});