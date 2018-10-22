import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
// import Retry from 'apollo-link-retry';
import { ApolloLink } from 'apollo-link'

import { apiPath, wssPath } from './apiPath';

const client = new ApolloClient({
  link: ApolloLink.from([
  	// new Retry(),
  	new WebSocketLink({
      uri: `${ wssPath }/graphql`,
      options: { reconnect: true }
    }),
    createUploadLink({ uri: `${ apiPath }/graphql` })
  ]),
  cache: new InMemoryCache()
});

export default client;

// new WebSocketLink({
//   uri: `${ wssPath }/graphql`,
//   options: { reconnect: true }
// }),
// createUploadLink({ uri: `${ apiPath }/graphql` })