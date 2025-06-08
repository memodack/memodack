import { IManifestService } from './manifest.service';
import { IVaultService } from './vault.service';

export interface IPathsService {
  getCacheDirPath(): string;
}

export class PathsService implements IPathsService {
  private manifestService: IManifestService;
  private vaultService: IVaultService;

  constructor(manifestService: IManifestService, vaultService: IVaultService) {
    this.manifestService = manifestService;
    this.vaultService = vaultService;
  }

  getCacheDirPath(): string {
    const manifestId = this.manifestService.getId();
    const manifestDir = this.manifestService.getDir();
    const configDir = this.vaultService.getConfigDir();

    return manifestDir
      ? `${manifestDir}/cache`
      : `${configDir}/plugins/${manifestId}/cache`;
  }
}
