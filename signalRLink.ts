import { ApolloLink, FetchResult, NextLink, Observable, Operation } from "@apollo/client";
import { SignalRClient } from "./SignalRClient";
import { print } from "graphql";

export class SignalRLink extends ApolloLink {
    constructor(public readonly cleint: SignalRClient) {
        super();
    }

    public request(operation: Operation, forward?: NextLink | undefined): Observable<FetchResult>{
        return new Observable((ob) => {
            return this.cleint.subscribe(
                {...operation, query: print(operation.query) }, 
                {
                    next : ob.next.bind(ob),
                    complete: ob.complete.bind(ob),
                    error : (err) => {}
                })
        });
    }
}