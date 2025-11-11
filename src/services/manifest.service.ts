import type { PluginManifest } from "obsidian";
import { inject, singleton } from "tsyringe";

export interface IManifestService {
  getId(): string;
  getDir(): string | undefined;
}

@singleton()
export class ManifestService implements IManifestService {
  constructor(@inject("PluginManifest") private readonly manifest: PluginManifest) {}

  getId(): string {
    return this.manifest.id;
  }

  getDir(): string | undefined {
    return this.manifest.dir;
  }
}
