import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { RetryLink } from 'apollo-link-retry';

import { apiPath, wssPath } from './apiPath';

const client = new ApolloClient({
  link: new RetryLink().split(
    operation => operation.getContext().version === 1,
    new WebSocketLink({
      uri: `${ wssPath }/graphql`,
      options: { reconnect: true }
    }),
    createUploadLink({ uri: `${ apiPath }/graphql` })
  ),
  cache: new InMemoryCache()
});

export default client;
