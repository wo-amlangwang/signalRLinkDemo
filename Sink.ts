export interface Sink<T = unknown> {
    /** Next value arriving. */
    next(value: T): void;
    /**
     * An error that has occured. Calling this function "closes" the sink.
     * Besides the errors being `Error` and `readonly GraphQLError[]`, it
     * can also be a `CloseEvent`, but to avoid bundling DOM typings because
     * the client can run in Node env too, you should assert the close event
     * type during implementation.
     */
    error(error: unknown): void;
    /** The sink has completed. This function "closes" the sink. */
    complete(): void;
  }