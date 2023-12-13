import axios from "axios";
import decompress from "decompress";
import path from "path";
import fs from "fs";

let pluginRootPath: string;
let pluginDirectoryPath: string;
let isRootPathInitialized: boolean = false;
const PLUGIN_STORAGE_URL = "https://hypee.s3.ap-northeast-2.amazonaws.com";

export enum DownloadState {
  PATH_NOT_INITIALIZED,
  DOWNLOAD_FAILED,
  SUCCESS,
}

export interface PluginDownloadResult {
  state: DownloadState;
  preloadPath: string | null;
  indexHtmlPath: string | null;
}

const mkdirPluginDirectory = (pluginDirectoryPath: string) => {
  if (!fs.existsSync(pluginDirectoryPath)) {
    fs.mkdirSync(pluginDirectoryPath);
  }
};

export const initializeRootPath = (rootPath: string) => {
  pluginRootPath = rootPath;
  pluginDirectoryPath = path.join(rootPath, "plugins");
  isRootPathInitialized = true;
  mkdirPluginDirectory(pluginDirectoryPath);
};

export const downloadPlugin = async (pluginName: string): Promise<PluginDownloadResult> => {
  if (!isRootPathInitialized) {
    return {
      state: DownloadState.PATH_NOT_INITIALIZED,
      preloadPath: null,
      indexHtmlPath: null,
    };
  }
  try {
    const fileName = `${pluginName}.zip`;
    const response = await axios({
      method: "get",
      url: `${PLUGIN_STORAGE_URL}/${fileName}`,
      responseType: "stream",
    });
    const writer = fs.createWriteStream(path.join(pluginDirectoryPath, fileName));
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        const downloadedPluginZipFilePath = path.join(pluginDirectoryPath, fileName);
        const unzipOutput = pluginDirectoryPath;

        decompress(downloadedPluginZipFilePath, unzipOutput)
          .then(files => {
            const writedPluginPath = path.join(pluginDirectoryPath, pluginName);
            resolve({
              state: DownloadState.SUCCESS,
              preloadPath: path.join(writedPluginPath, "preload.js"),
              indexHtmlPath: path.join(writedPluginPath, "view/dist/index.html"),
            });
          })
          .catch(reject);
      });
      writer.on("error", reject);
    });
  } catch (e) {
    console.error(e);
    return {
      state: DownloadState.DOWNLOAD_FAILED,
      preloadPath: null,
      indexHtmlPath: null,
    };
  }
};
