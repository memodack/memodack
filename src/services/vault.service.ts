import type { TFile, TFolder, Vault } from "obsidian";
import { inject, singleton } from "tsyringe";

export interface IVaultService {
  read(file: TFile): Promise<string>;
  getConfigDir(): string;
  createFolder(path: string): Promise<TFolder>;
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
}
