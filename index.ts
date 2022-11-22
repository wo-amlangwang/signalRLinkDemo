import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SignalRClient } from './SignalRClient';
import { SignalRLink } from './signalRLink';

const token = "";

const client = new ApolloClient({
    link: new SignalRLink(new SignalRClient("http://localhost:62522/graphql", {
        customHeaders : {
            // Required by SignalR Transport
            "X-GraphQL-SignalR": "1",

            // GraphBridge Authorizaiton
            "Authorization": `Bearer ${token}`,

            // Other headers needed when connecting from devbox to tds
            "x-owa-sessionid": "9e4ba43f-6542-44e1-ae95-4b6ddbbb8a71",
            "ms-cv": "9e4ba43f-6542-44e1-ae95-4b6ddbbb8a71",
        }})),
    cache: new InMemoryCache(),
});