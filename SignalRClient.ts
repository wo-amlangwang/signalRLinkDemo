import { HubConnection, HubConnectionBuilder, MessageHeaders } from "@microsoft/signalr";
import { Sink } from "./Sink";
import { SubscribePayload } from "./SubscribePayload";
import { FetchResult } from "@apollo/client";
import { Subject, filter } from "rxjs";
import * as uuid from "uuid";

export interface SignalRClientOptions {
    customHeaders?: MessageHeaders
    keepAliveIntervalInMilliseconds?: number
    serverTimeoutInMilliseconds?: number
}

export class SignalRClient {
    private connection: HubConnection

    private connecting: Promise<void>

    private subject: Subject<any>

    constructor(url: string, opt?: SignalRClientOptions) {
        this.connection = new HubConnectionBuilder()
            .withUrl(url, {
                headers: opt?.customHeaders
            }).build();

        this.connection.keepAliveIntervalInMilliseconds = opt?.keepAliveIntervalInMilliseconds ?? 2.5 * 60 * 1000;
        this.connection.serverTimeoutInMilliseconds = opt?.serverTimeoutInMilliseconds ?? 5 * 60 * 1000;

        this.connection.on("Message", (message) => {
            const obj = JSON.parse(message);
            this.subject.next(obj);
        });

        this.connecting = this.connection.start()
    }

    public subscribe(payload: SubscribePayload, sink: Sink<FetchResult>): () => void {
        (async () => {
            const id = uuid.v4();
            await this.connecting;
            var payloadToSend = {
                id,
                type: "start", // Todo change subscribe maybe https://github.com/enisdenjo/graphql-ws/blob/master/src/client.ts#L926
                payload
            }
            
            await this.connection.invoke("GraphQL", JSON.stringify(payloadToSend));
            this.subject.pipe(filter(n => n.id === id))
        })().then(() => {
            // call complete but why? https://github.com/enisdenjo/graphql-ws/blob/master/src/client.ts#L962
        }).catch(e => sink.error(e));
        return () => { };// Todo add disposable
    }
}