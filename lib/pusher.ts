import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Creating a Pusher server instance with the provided configuration
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!, // Pusher app ID from environment variables
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, // Pusher public app key from environment variables
  secret: process.env.PUSHER_SECRET!, // Pusher secret from environment variables
  cluster: "eu", // Pusher cluster
  useTLS: true, // Enabling TLS
});

// Creating a Pusher client instance with the provided configuration
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, // Pusher public app key from environment variables
  {
    channelAuthorization: {
      endpoint: "/api/pusher/auth", // Endpoint for channel authorization
      transport: "ajax", // Transport method for authorization
    },
    cluster: "eu", // Pusher cluster
  },
);
