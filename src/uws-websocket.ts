import type { WebSocket as UwsWebSocket } from 'uWebSockets.js';

/**
 * uWebSockets.js >= 20.11 made WebSocket generic over UserData and dropped the
 * `[key: string]: any` index signature. Soketi attaches its own fields directly
 * on the socket object (id, app, presence, subscribedChannels, sendJson, ...),
 * which is still valid at runtime. This alias keeps the pre-20.11 typing.
 * Type-only: emits no runtime code.
 */
export type WebSocket = UwsWebSocket<any> & { [key: string]: any };
