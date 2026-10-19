import * as migration_20261014_130319_ilk_kurulum from './20261014_130319_ilk_kurulum';
import * as migration_20261014_132305_dosya_deposu_alanlari from './20261014_132305_dosya_deposu_alanlari';
import * as migration_20261019_161542_cok_dil from './20261019_161542_cok_dil';

export const migrations = [
  {
    up: migration_20261014_130319_ilk_kurulum.up,
    down: migration_20261014_130319_ilk_kurulum.down,
    name: '20261014_130319_ilk_kurulum',
  },
  {
    up: migration_20261014_132305_dosya_deposu_alanlari.up,
    down: migration_20261014_132305_dosya_deposu_alanlari.down,
    name: '20261014_132305_dosya_deposu_alanlari',
  },
  {
    up: migration_20261019_161542_cok_dil.up,
    down: migration_20261019_161542_cok_dil.down,
    name: '20261019_161542_cok_dil'
  },
];
