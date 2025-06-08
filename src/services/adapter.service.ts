import { DataAdapter, DataWriteOptions, ListedFiles, Stat } from 'obsidian';

export interface IAdapterService {
  exists(normalizedPath: string, sensitive?: boolean): Promise<boolean>;
  write(
    normalizedPath: string,
    data: string,
    options?: DataWriteOptions,
  ): Promise<void>;
  list(normalizedPath: string): Promise<ListedFiles>;
  stat(normalizedPath: string): Promise<Stat | null>;
  read(normalizedPath: string): Promise<string>;
  rmdir(normalizedPath: string, recursive: boolean): Promise<void>;
}

export class AdapterService implements IAdapterService {
  private adapter: DataAdapter;

  constructor(adapter: DataAdapter) {
    this.adapter = adapter;
  }

  async exists(normalizedPath: string, sensitive?: boolean): Promise<boolean> {
    return this.adapter.exists(normalizedPath, sensitive);
  }

  async write(
    normalizedPath: string,
    data: string,
    options?: DataWriteOptions,
  ): Promise<void> {
    await this.adapter.write(normalizedPath, data, options);
  }

  async list(normalizedPath: string): Promise<ListedFiles> {
    return this.adapter.list(normalizedPath);
  }

  async stat(normalizedPath: string): Promise<Stat | null> {
    return this.adapter.stat(normalizedPath);
  }

  async read(normalizedPath: string): Promise<string> {
    return this.adapter.read(normalizedPath);
  }

  async rmdir(normalizedPath: string, recursive: boolean): Promise<void> {
    await this.adapter.rmdir(normalizedPath, recursive);
  }
}
