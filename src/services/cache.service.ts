import { Vault } from 'obsidian';

export interface ICacheService {
  setVault(vault: Vault): void;
  setDirectoryPath(directoryPath: string): void;
  add(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  getSize(): Promise<number>;
  clear(): Promise<void>;
}

export class CacheService implements ICacheService {
  private _vault: Vault | null = null;
  private _directoryPath: string | null = null;

  setVault(vault: Vault): void {
    this._vault = vault;
  }

  setDirectoryPath(directoryPath: string): void {
    this._directoryPath = directoryPath;
  }

  private get vault(): Vault {
    if (!this._vault) {
      throw new Error('The vault is not set.');
    }

    return this._vault;
  }

  private get directoryPath(): string {
    if (!this._directoryPath) {
      throw new Error('The directory path is not set.');
    }

    return this._directoryPath;
  }

  async add(key: string, value: string): Promise<void> {
    try {
      if (!(await this.vault.adapter.exists(this.directoryPath))) {
        await this.vault.createFolder(this.directoryPath);
      }

      if (!(await this.vault.adapter.exists(`${this.directoryPath}/${key}`))) {
        await this.vault.adapter.write(`${this.directoryPath}/${key}`, value);
      }
    } catch (e) {
      const errorMessage = `Failed to add cache for key '${key}'.`;
      console.error(errorMessage, e instanceof Error ? e.message : '');
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!(await this.vault.adapter.exists(`${this.directoryPath}/${key}`))) {
        return null;
      }

      return await this.vault.adapter.read(`${this.directoryPath}/${key}`);
    } catch (e) {
      const errorMessage = `Failed to get a cache by '${key}' key.`;
      console.error(errorMessage, e instanceof Error ? e.message : '');

      return null;
    }
  }

  async getSize(): Promise<number> {
    try {
      let totalSize = 0;

      if (!(await this.vault.adapter.exists(this.directoryPath))) {
        return totalSize;
      }

      const { files } = await this.vault.adapter.list(this.directoryPath);

      for (const file of files) {
        const fileStat = await this.vault.adapter.stat(file);
        if (fileStat?.size) {
          totalSize += fileStat.size;
        }
      }

      return totalSize;
    } catch (e) {
      console.error(
        `Failed to retrieve the cache directory size. ${e instanceof Error ? e.message : ''}`,
      );

      return 0;
    }
  }

  async clear(): Promise<void> {
    try {
      if (!(await this.vault.adapter.exists(this.directoryPath))) {
        return;
      }

      await this.vault.adapter.rmdir(this.directoryPath, true);
    } catch (e) {
      console.error(
        `Failed to clear the cache. ${e instanceof Error ? e.message : ''}`,
      );
    }
  }
}

export const cacheService = new CacheService();
