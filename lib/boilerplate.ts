export interface Boilerplate {
  repo: string;
  dir: string;
  branch: string;
  removeFiles?: string[];
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

export const GoZeroBoilerplate: Boilerplate = {
  repo: 'arklnk/ark-admin-zero',
  dir: 'zero',
  branch: 'main',
  removeFiles: [...CommonRemoveFiles],
};

export const NestJsBoilerplate: Boilerplate = {
  repo: 'arklnk/ark-admin-nest',
  dir: 'nest',
  branch: 'main',
  removeFiles: [...CommonRemoveFiles],
};

export const VueNextBoilerplate: Boilerplate = {
  dir: 'vue',
  repo: 'arklnk/ark-admin-vuenext',
  branch: 'main',
  removeFiles: [...CommonRemoveFiles],
};

export const PureVueNextBoilerplate: Boilerplate = {
  dir: 'pure',
  repo: 'arklnk/ark-admin-vuenext-pure',
  branch: 'main',
  removeFiles: [...CommonRemoveFiles],
};

// Project Preset
export const ProjPreset: Preset[] = [
  // zero
  {
    name: 'Go-Zero + Vue3',
    boilerplates: [GoZeroBoilerplate, VueNextBoilerplate],
  },
  // nest
  {
    name: 'Nestjs + Vue3',
    boilerplates: [NestJsBoilerplate, VueNextBoilerplate],
  },
  // pure
  {
    name: 'Vue pure template (no server)',
    boilerplates: [PureVueNextBoilerplate],
  },
];
