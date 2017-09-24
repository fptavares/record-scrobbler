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
  getDiscogsRequestToken,
  authenticateDiscogs,
} from '../discogs-client';

import config from '../../config';

const {
  JWT_SECRET,
  JWT_EXPIRES,
} = config;


const GraphQLDiscogsRequestTokenMutation = mutationWithClientMutationId({
  name: 'DiscogsRequestToken',
  inputFields: {
    callbackUrl: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    token: { type: GraphQLString },
    discogsAuthorizeUrl: { type: GraphQLString },
  },
  mutateAndGetPayload: async({callbackUrl}) => {
    try {
      const {
        discogsRequestToken,
        discogsAuthorizeUrl,
      } = await getDiscogsRequestToken(callbackUrl);

      const payload = { discogsRequestToken };
      const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return { token, discogsAuthorizeUrl };
    } catch(err) {
      console.error(err);
      throw err;
    }
  },
});

const GraphQLAuthenticateDiscogsMutation = mutationWithClientMutationId({
  name: 'AuthenticateDiscogs',
  inputFields: {
    oauthVerifier: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: {
      type: GraphQLViewer,
      resolve: obj => obj,
    },
    token: { type: GraphQLString },
  },
  mutateAndGetPayload: async({oauthVerifier}, {user}) => {
    if (!user || !user.discogsRequestToken) {
      throw Error('discogsRequestToken missing')
    }

    const {
      username,
      discogsToken
    } = await authenticateDiscogs(user.discogsRequestToken, oauthVerifier);

    const payload = { username, discogsToken };
    const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { username, token };
  },
});

export {
  GraphQLDiscogsRequestTokenMutation,
  GraphQLAuthenticateDiscogsMutation
};
