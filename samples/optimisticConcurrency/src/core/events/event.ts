export type Event<
  EventType extends string = string,
  EventData extends Record<string, unknown> = Record<string, unknown>,
  EventMetadata extends Record<string, unknown> = Record<string, unknown>
> = Readonly<{
  type: Readonly<EventType>;
  data: Readonly<EventData>;
  metadata?: Readonly<EventMetadata>;
}>;

export type StreamEvent<EventType = Event> = Readonly<{
  event: EventType;
  streamRevision: bigint;
  streamName: string;
}>;

export function isEvent<
  EventType extends string = string,
  EventData extends Record<string, unknown> = Record<string, unknown>,
  EventMetadata extends Record<string, unknown> = Record<string, unknown>
>(event: unknown): event is Event<EventType, EventData, EventMetadata> {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    'data' in event
  );
}
