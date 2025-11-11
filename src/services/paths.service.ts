import { inject, singleton } from "tsyringe";
import type { IManifestService } from "./manifest.service";
import type { IVaultService } from "./vault.service";

export interface IPathsService {
  getCacheDirPath(): string;
}

@singleton()
export class PathsService implements IPathsService {
  constructor(
    @inject("IManifestService")
    private readonly manifestService: IManifestService,
    @inject("IVaultService") private readonly vaultService: IVaultService,
  ) {}

  getCacheDirPath(): string {
    const manifestId = this.manifestService.getId();
    const manifestDir = this.manifestService.getDir();
    const configDir = this.vaultService.getConfigDir();

    return manifestDir ? `${manifestDir}/cache` : `${configDir}/plugins/${manifestId}/cache`;
  }
}
