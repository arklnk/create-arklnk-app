#!/usr/bin/env node
import { Command } from 'commander';
import * as chalk from 'chalk';
import {
  shouldAskOverwriteDest,
  shouldAskProjectName,
  shouldAskUsePreset,
} from '../lib/ask';
import { basename, join } from 'path';
import {
  checkAppName,
  checkCloneSource,
  checkGitEnv,
  clearConsole,
  gitclone,
} from '../lib/utils';
import { ProjPreset } from '../lib/boilerplate';
import { emptyDirSync, removeSync, pathExistsSync } from 'fs-extra';
import * as ora from 'ora';

let projectName: string;

async function bootstrap() {
  const program = new Command();

  const cliVersion = require('../package.json').version;
  // 全局变量
  process.env.CLI_VERSION = cliVersion;

  program
    .version(cliVersion, '-v, --version', 'Output the current version.')
    .argument('[project-directory]')
    .action((name) => {
      projectName = name;
    })
    .usage(`${chalk.green('[project-directory]')} [options]`)
    .option(
      '--source [source]',
      'Specify the code repository source: github/gitee',
      'gitee',
    )
    .option('--force', 'Overwrite project-directory file if it exists')
    .allowUnknownOption()
    .helpOption('--help', 'Output usage information.');

  program.parse(process.argv);

  // 询问项目名称
  if (!projectName) {
    projectName = await shouldAskProjectName();
  }

  // 如果项目名称为 . ,则判断用户使用当前目录生成项目模板而非再创建一级目录
  const useCurrentDir = projectName === '.';

  if (useCurrentDir) {
    projectName = basename(process.cwd());
  }

  // options
  const source = program.opts().source;
  const force = program.opts().force;

  // check
  checkAppName(projectName);
  checkGitEnv();
  checkCloneSource(source);

  // 项目路径
  const projectPath = useCurrentDir
    ? process.cwd()
    : join(process.cwd(), projectName);

  // 询问预设模板
  const presetName = await shouldAskUsePreset();
  const preset = ProjPreset.find((e) => e.name === presetName)!;
  const boilerplates = preset.boilerplates;

  // 如果项目路径已存在，询问是否需要覆盖
  if (!useCurrentDir && !force && pathExistsSync(projectPath)) {
    const ok = await shouldAskOverwriteDest();
    if (!ok) {
      console.log('\nNothing to do!');
      process.exit(1);
    }
  }

  // 清空内容
  emptyDirSync(projectPath);

  clearConsole();
  const spinner = ora('Prefetch boilerplate...').start();

  try {
    for (let i = 0; i < boilerplates.length; i++) {
      const boilerplate = boilerplates[i];
      const boilerplatePath = join(projectPath, boilerplate.dir);

      spinner.text =
        `Cloning boilerplate ${chalk.green(boilerplate.repo)} ` +
        `[${i + 1}/${boilerplates.length}]`;

      const clonePath = `https://${source}.com/${boilerplate.repo}`;
      await gitclone(clonePath, boilerplatePath);

      boilerplate.removeFiles?.forEach((file) => {
        removeSync(join(boilerplatePath, file));
      });
    }

    spinner.succeed(`Successfully created project ${chalk.green(projectName)}`);
    console.log('Get started with the following commands:\n');

    // start command
    for (let i = 0; i < boilerplates.length; i++) {
      const boilerplate = boilerplates[i];
      if (!boilerplate.startCommand) continue;
      const cd = useCurrentDir
        ? boilerplate.dir
        : join(projectName, boilerplate.dir);

      console.log(chalk.green(boilerplate.repo));
      console.log(chalk.gray(`$ cd ${cd}`));
      boilerplate.startCommand.forEach((c) => {
        console.log(chalk.gray(`$ ${c}`));
      });
      console.log();
    }

    console.log(`${chalk.green('Thanks for using arklnk app')}`);
    console.log();
    console.log(
      `${chalk.red('❤')}  Follow us: ${chalk.blueBright(
        'https://github.com/arklnk',
      )}`,
    );
  } catch (err) {
    if (!useCurrentDir) {
      removeSync(projectPath);
    }

    spinner.fail(chalk.red(`${err}`));
    process.exit(1);
  }
}

bootstrap();
