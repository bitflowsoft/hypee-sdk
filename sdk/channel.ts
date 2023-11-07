
export interface ChannelEmitter {
  send: (channelName: string, argv: any[]) => void;
}

const channelRegistry: {[key: string]: (channel: ChannelEmitter, argv: any[]) => void} = {};

export const channelRegister = {
  subscribe: (channelName: string, subscriber: (channel: ChannelEmitter, argv: any[]) => void) => {
    if (channelName in channelRegistry) {
      return;
    }
    channelRegistry[channelName] = subscriber;
  },
  remove: (channelName: string) => {
    if (channelName in channelRegistry) {
      delete channelRegistry[channelName];
    }
  }
}

export const emitter: ChannelEmitter = {
  send: (channelName: string, argv: any[]) => {
    if (!(channelName in channelRegistry)) {
      return;
    }
    channelRegistry[channelName](emitter, argv);
  }
}