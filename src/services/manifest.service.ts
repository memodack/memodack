import { PluginManifest } from 'obsidian';

export interface IManifestService {
  getId(): string;
  getDir(): string | undefined;
}

export class ManifestService implements IManifestService {
  private manifest: PluginManifest;

  constructor(manifest: PluginManifest) {
    this.manifest = manifest;
  }

  getId(): string {
    return this.manifest.id;
  }

  getDir(): string | undefined {
    return this.manifest.dir;
  }
}
