import type { IAdapterService } from "./adapter.service";
import type { IPathsService } from "./paths.service";
import type { IVaultService } from "./vault.service";

export interface ICacheService {
  add(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  getSize(): Promise<number>;
  clear(): Promise<void>;
}

export class CacheService implements ICacheService {
  private pathsService: IPathsService;
  private vaultService: IVaultService;
  private adapterService: IAdapterService;

  constructor(
    pathsService: IPathsService,
    vaultService: IVaultService,
    adapterService: IAdapterService,
  ) {
    this.pathsService = pathsService;
    this.vaultService = vaultService;
    this.adapterService = adapterService;
  }

  async add(key: string, value: string): Promise<void> {
    try {
      const cacheDirPath = this.pathsService.getCacheDirPath();

      if (!(await this.adapterService.exists(cacheDirPath))) {
        await this.vaultService.createFolder(cacheDirPath);
      }

      if (!(await this.adapterService.exists(`${cacheDirPath}/${key}`))) {
        await this.adapterService.write(`${cacheDirPath}/${key}`, value);
      }
    } catch (e) {
      const errorMessage = `Failed to add cache for key '${key}'.`;
      console.error(errorMessage, e instanceof Error ? e.message : "");
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const cacheDirPath = this.pathsService.getCacheDirPath();

      if (!(await this.adapterService.exists(`${cacheDirPath}/${key}`))) {
        return null;
      }

      return await this.adapterService.read(`${cacheDirPath}/${key}`);
    } catch (e) {
      const errorMessage = `Failed to get a cache by '${key}' key.`;
      console.error(errorMessage, e instanceof Error ? e.message : "");

      return null;
    }
  }

  async getSize(): Promise<number> {
    try {
      const cacheDirPath = this.pathsService.getCacheDirPath();

      let totalSize = 0;

      if (!(await this.adapterService.exists(cacheDirPath))) {
        return totalSize;
      }

      const { files } = await this.adapterService.list(cacheDirPath);

      for (const file of files) {
        const fileStat = await this.adapterService.stat(file);
        if (fileStat?.size) {
          totalSize += fileStat.size;
        }
      }

      return totalSize;
    } catch (e) {
      console.error(
        `Failed to retrieve the cache directory size. ${e instanceof Error ? e.message : ""}`,
      );

      return 0;
    }
  }

  async clear(): Promise<void> {
    try {
      const cacheDirPath = this.pathsService.getCacheDirPath();

      if (!(await this.adapterService.exists(cacheDirPath))) {
        return;
      }

      await this.adapterService.rmdir(cacheDirPath, true);
    } catch (e) {
      console.error(
        `Failed to clear the cache. ${e instanceof Error ? e.message : ""}`,
      );
    }
  }
}
