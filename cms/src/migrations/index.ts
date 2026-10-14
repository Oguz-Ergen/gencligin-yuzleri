import * as migration_20261014_130319_ilk_kurulum from './20261014_130319_ilk_kurulum';

export const migrations = [
  {
    up: migration_20261014_130319_ilk_kurulum.up,
    down: migration_20261014_130319_ilk_kurulum.down,
    name: '20261014_130319_ilk_kurulum'
  },
];
