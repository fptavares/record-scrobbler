import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import config from './config';

const { API_BASEURL } = config;

function fetchQuery(operation, variables) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  if (localStorage.token && typeof localStorage.token === 'string') {
    headers['Authorization'] = `Bearer ${localStorage.token}`;
  }
  return fetch(`${API_BASEURL}/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject({
        code: response.status,
        message: response.statusText,
      });
    }
  }).then(json => {
    console.log('response:', json);
    // https://github.com/facebook/relay/issues/1816
    if (operation.query.operation === 'mutation' && json.errors) {
      return Promise.reject({
        message: json.errors.map(e => e.message).join('<br/>')
      });
    }

    return Promise.resolve(json);
  }).catch((err) => {
    console.error("Error on fetch:", err);
    return Promise.reject(err);
  });
}

const network = Network.create(fetchQuery)

const store = new Store(new RecordSource())

export default new Environment({
  network,
  store,
})
