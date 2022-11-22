import * as chalk from 'chalk';
import * as validate from 'validate-npm-package-name';
import * as readline from 'readline';
import { exec, execSync } from 'child_process';

export function checkAppName(appName: string) {
  const result = validate(appName);
  if (!result.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${appName}"`,
        )} (npm naming restrictions):\n`,
      ),
    );
    [...(result.errors || []), ...(result.warnings || [])].forEach((error) => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red('\nPlease choose a different project name.'));
    process.exit(1);
  }
}

export function checkGitEnv() {
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch {
    console.error(chalk.red('Cli requires git, Please install git'));
    process.exit(1);
  }
}

export function checkCloneSource(source: string) {
  const sources = ['github', 'gitee'];
  if (!sources.includes(source)) {
    console.error(
      chalk.red('\nCli only support ' + sources.join(', ') + ' source option'),
    );
    process.exit(1);
  }
}

/**
 * like this: git clone https://github.com/arklnk/ark-admin-nest.git --depth 1
 */
export async function gitclone(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    exec(`git clone ${url}.git ${dest} --depth 1`, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

export function clearConsole(title?: string) {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    console.log(chalk.bold.blue(`CLI v${process.env.CLI_VERSION}`));
    if (title) {
      console.log(title);
    }
  }
}
