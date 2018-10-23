import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink } from 'apollo-link';

import { apiPath, wssPath } from './apiPath';

const client = new ApolloClient({
	link: ApolloLink.from([ // FIXME: upload link is not working
		new WebSocketLink({
     		uri: `${ wssPath }/graphql`,
      		options: { reconnect: true }
    	}),
		createUploadLink({ uri: `${ apiPath }/graphql` })
	]),
	cache: new InMemoryCache()
});

export default client;