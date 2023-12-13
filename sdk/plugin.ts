import { ChannelRegister } from "./channel";

interface PluginImageBase64 {
  imageBase64: string;
}

interface PluginImageLink {
  imageLink: string;
}

interface PluginRegistry {
  register: (pluginName: string, plugin: Plugin) => void;
  remove: (pluginName: string) => void;
}

export interface Plugin {
  pluginTitle: string;
  pluginDescription: string;
  pluginImage: PluginImageBase64 | PluginImageLink;
  author: string;
  onInitialize: (channelRegister: ChannelRegister) => void;
}

const pluginStorage: { [key: string]: Plugin } = {};

export const pluginRegistry: PluginRegistry = {
  register: (pluginName: string, plugin: Plugin) => {
    if (pluginName in pluginStorage) {
      return;
    }
    pluginStorage[pluginName] = plugin;
  },
  remove: (pluginName: string) => {
    if (pluginName in pluginStorage) {
      delete pluginStorage[pluginName];
    }
  },
};
