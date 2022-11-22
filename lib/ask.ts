import * as inquirer from 'inquirer';
import { ProjPreset } from './boilerplate';

export async function shouldAskProjectName(): Promise<string> {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What name would you like to use for the new project',
      default: 'ark-admin',
    },
  ]);

  return projectName;
}

export async function shouldAskUsePreset(): Promise<string> {
  const { preset } = await inquirer.prompt([
    {
      type: 'list',
      name: 'preset',
      choices: ProjPreset.map((e) => e.name),
      message: 'Which template do you like',
    },
  ]);

  return preset;
}

export async function shouldAskOverwriteDest(): Promise<boolean> {
  const { ok } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'ok',
      message: 'Whether to overwrite the existing file',
    },
  ]);

  return ok;
}
