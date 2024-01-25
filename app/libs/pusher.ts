import PusherServer from 'pusher'
import PusherClient from 'pusher-js'


export const pusherServer = new PusherServer({
  appId: "1706898",
  key: "e784e350360f46b8c242",
  secret: "308ac4a49601c2524957",
  cluster: 'mt1',
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    channelAuthorization: {
      endpoint: '/api/pusher/auth',
      transport: 'ajax',
    },
    cluster: 'mt1',
  }
);
