import ApolloClient from "apollo-client";

// Setup the network "links"
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

import { InMemoryCache } from 'apollo-cache-inmemory';

export const HASURA_GRAPHQL_ENGINE_HOSTNAME = process.env.REACT_APP_HGE_URL || 'serverless-demo.hasura.app/hge';

const wsurl = `wss://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1alpha1/graphql`;
const httpurl = `https://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1alpha1/graphql`;

const wsLink = new WebSocketLink({
  uri: wsurl,
  options: {
    reconnect: true,
  }
});

const httpLink = new HttpLink({
  uri: httpurl,
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default client;
