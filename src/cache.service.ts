import { Vault } from 'obsidian';

export interface ICacheService {
  add(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  getSize(): Promise<number>;
  clear(): Promise<void>;
}

export class CacheService implements ICacheService {
  private vault: Vault;
  private directoryPath: string;

  constructor(vault: Vault, directoryPath: string) {
    this.vault = vault;
    this.directoryPath = directoryPath;
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
      const errorMessage = `Failed to add cache for key ${key}.`;

      if (e instanceof Error) {
        console.error(e.message || errorMessage);
        return;
      }

      console.error(errorMessage);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!(await this.vault.adapter.exists(`${this.directoryPath}/${key}`))) {
        console.error(`Cache with key ${key} doesn't exist.`);
        return null;
      }

      return await this.vault.adapter.read(`${this.directoryPath}/${key}`);
    } catch (e) {
      const errorMessage = `Failed to get a cache by ${key} key.`;

      if (e instanceof Error) {
        console.error(e.message || errorMessage);
        return null;
      }

      console.error(errorMessage);
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
      const errorMessage = 'Failed to retrieve the cache directory size.';

      if (e instanceof Error) {
        console.error(e.message || errorMessage);
        return 0;
      }

      console.error(errorMessage);
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
      const errorMessage = 'Failed to clear the cache.';

      if (e instanceof Error) {
        console.error(e.message || errorMessage);
        return;
      }

      console.error(errorMessage);
    }
  }
}
