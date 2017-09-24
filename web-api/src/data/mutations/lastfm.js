import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import jsonwebtoken from 'jsonwebtoken';

import { GraphQLViewer } from '../types/viewer';

import {
  getLastfmAuthenticationUrl,
  authenticateLastfm,
} from '../lastfm-client';

import config from '../../config';

const {
  JWT_SECRET,
  JWT_EXPIRES,
} = config;


const GraphQLGetLastfmAuthenticationUrlMutation = mutationWithClientMutationId({
  name: 'GetLastfmAuthenticationUrl',
  inputFields: {
    callbackUrl: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    authenticationUrl: { type: GraphQLString },
  },
  mutateAndGetPayload: ({callbackUrl}) => getLastfmAuthenticationUrl(callbackUrl),
});

const GraphQLAuthenticateLastfmMutation = mutationWithClientMutationId({
  name: 'AuthenticateLastfm',
  inputFields: {
    oauthToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: {
      type: GraphQLViewer,
      resolve: obj => obj,
    },
    token: { type: GraphQLString },
  },
  mutateAndGetPayload: async({oauthToken}, {user}) => {
    if (!user) {
      throw Error('Must authenticate Discogs first!')
    }

    const {
      username: lastfmUsername,
      lastfmToken
    } = await authenticateLastfm(oauthToken);

    const payload = {
      username: user.username,
      discogsToken: user.discogsToken,
      lastfmUsername,
      lastfmToken
    };
    const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { lastfmUsername, token };
  },
});

export {
  GraphQLGetLastfmAuthenticationUrlMutation,
  GraphQLAuthenticateLastfmMutation
};
