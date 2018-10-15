import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { RetryLink } from 'apollo-link-retry';

const client = new ApolloClient({
  link: new RetryLink().split(
    operation => operation.getContext().version === 1,
    new WebSocketLink({
      uri: "ws://localhost:4000/graphql",
      options: { reconnect: true }
    }),
    createUploadLink({ uri: "http://localhost:4000/graphql" })
  ),
  cache: new InMemoryCache()
});

export default client;
