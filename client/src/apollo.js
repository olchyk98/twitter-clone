import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { RetryLink } from 'apollo-link-retry';
import { getMainDefinition } from 'apollo-utilities';

import { apiPath, wssPath } from './apiPath';

const client = new ApolloClient({
	link: new RetryLink().split( // YOHOOOOOO!!! FIXED
		sys => {
			let { operation } = getMainDefinition(sys.query);
			console.log(operation);
			return operation === "subscription";
		},
		new WebSocketLink({
     		uri: `${ wssPath }/graphql`,
      		options: { reconnect: true }
    	}),
		createUploadLink({ uri: `${ apiPath }/graphql` })
	),
	cache: new InMemoryCache()
});

export default client;