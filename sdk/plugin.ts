interface PluginImageBase64 {
  imageBase64: string
}

interface PluginImageLink {
  imageLink: string
}

export interface Plugin {
  pluginTitle: string;
  pluginDescription: string;
  pluginImage: PluginImageBase64 | PluginImageLink;
  author: string;
  onInitiaize: () => void;
}