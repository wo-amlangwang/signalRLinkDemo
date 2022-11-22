export interface SubscribePayload {
    readonly operationName?: string | null;
    readonly query: string;
    readonly variables?: Record<string, unknown> | null;
    readonly extensions?: Record<string, unknown> | null;
}