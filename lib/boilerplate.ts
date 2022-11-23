export interface Boilerplate {
  repo: string;
  dir: string;
  branch: string;
  removeFiles?: string[];
  startCommand?: string[];
}

export interface Preset {
  name: string;
  boilerplates: Boilerplate[];
}

const CommonRemoveFiles: string[] = [
  '.github',
  '.git',
  'README-cn.md',
  'README.md',
  'LICENSE',
];

const NodeStartCommand = ['pnpm i', 'pnpm dev'];

export const GoZeroBoilerplate: Boilerplate = {
  repo: 'arklnk/ark-admin-zero',
  dir: 'zero',
  branch: 'main',
  removeFiles: [...CommonRemoveFiles],
  startCommand: [
    'docker-compose -f docker-compose-dev.yml up -d',
    'docker exec -it api /bin/sh',
    'go mod tidy && modd',
  ],
};

export const NestJsBoilerplate: Boilerplate = {
  repo: 'arklnk/ark-admin-nest',
  dir: 'nest',
  branch: 'main',
  removeFiles: [...CommonRemoveFiles],
  startCommand: NodeStartCommand,
};

export const VueNextBoilerplate: Boilerplate = {
  dir: 'vue',
  repo: 'arklnk/ark-admin-vuenext',
  branch: 'main',
  removeFiles: [...CommonRemoveFiles],
  startCommand: NodeStartCommand,
};

export const PureVueNextBoilerplate: Boilerplate = {
  dir: 'pure',
  repo: 'arklnk/ark-admin-vuenext-pure',
  branch: 'main',
  removeFiles: [...CommonRemoveFiles],
  startCommand: NodeStartCommand,
};

// Project Preset
export const ProjPreset: Preset[] = [
  // zero
  {
    name: 'Go-Zero + Vue3 - Ark admin application boilerplate with zero(Go)',
    boilerplates: [GoZeroBoilerplate, VueNextBoilerplate],
  },
  // nest
  {
    name: 'Nestjs + Vue3 - Ark admin application boilerplate with nest(TS)',
    boilerplates: [NestJsBoilerplate, VueNextBoilerplate],
  },
  // pure
  {
    name: 'Vue3 pure - A modern vue admin boilerplate(Vue)',
    boilerplates: [PureVueNextBoilerplate],
  },
];
