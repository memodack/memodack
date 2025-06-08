import { TFile, TFolder, Vault } from 'obsidian';

export interface IVaultService {
  read(file: TFile): Promise<string>;
  getConfigDir(): string;
  createFolder(path: string): Promise<TFolder>;
}

export class VaultService implements IVaultService {
  private vault: Vault;

  constructor(vault: Vault) {
    this.vault = vault;
  }

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
