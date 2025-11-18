import type { TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import { inject, singleton } from "tsyringe";

export interface IVaultService {
  read(file: TFile): Promise<string>;
  getConfigDir(): string;
  createFolder(path: string): Promise<TFolder>;
  getAbstractFileByPath(path: string): TAbstractFile | null;
  getResourcePath(file: TFile): string;
}

@singleton()
export class VaultService implements IVaultService {
  constructor(@inject("Vault") private readonly vault: Vault) {}

  async read(file: TFile): Promise<string> {
    return this.vault.read(file);
  }

  getConfigDir(): string {
    return this.vault.configDir;
  }

  createFolder(path: string): Promise<TFolder> {
    return this.vault.createFolder(path);
  }

  getAbstractFileByPath(path: string): TAbstractFile | null {
    return this.vault.getAbstractFileByPath(path);
  }

  getResourcePath(file: TFile): string {
    return this.vault.getResourcePath(file);
  }
}
