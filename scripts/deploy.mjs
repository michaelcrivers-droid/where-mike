/**
 * Publishes `dist/` to the `gh-pages` branch.
 *
 * GitHub Pages can serve a branch directly, which means deploying needs no CI
 * and no extra token scopes — a plain `git push` is enough. The branch is
 * built fresh from a temporary worktree each time and force-pushed, so its
 * history never accumulates build output.
 *
 *   npm run deploy
 */

import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BRANCH = 'gh-pages'

const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim()

const dist = join(ROOT, 'dist')
if (!existsSync(dist) || readdirSync(dist).length === 0) {
  console.error('dist/ is empty. Run `npm run build` first.')
  process.exit(1)
}

const remoteUrl = git('remote', 'get-url', 'origin')
const sourceCommit = git('rev-parse', '--short', 'HEAD')
const staging = mkdtempSync(join(tmpdir(), 'wheremike-pages-'))

try {
  console.log(`Publishing dist/ to ${BRANCH} on ${remoteUrl}`)
  cpSync(dist, staging, { recursive: true })

  // Without this, Pages runs the output through Jekyll, which silently drops
  // any file or directory whose name starts with an underscore.
  writeFileSync(join(staging, '.nojekyll'), '')

  // A fresh orphan branch: the deployed site is a snapshot, not a history.
  execFileSync('git', ['init', '-q', '-b', BRANCH], { cwd: staging, stdio: 'inherit' })
  execFileSync('git', ['add', '-A'], { cwd: staging, stdio: 'inherit' })
  execFileSync(
    'git',
    [
      '-c', 'user.name=WhereMike Deploy',
      '-c', 'user.email=deploy@wheremike.local',
      'commit', '-q', '-m', `Deploy ${sourceCommit}`,
    ],
    { cwd: staging, stdio: 'inherit' },
  )
  execFileSync('git', ['push', '-q', '--force', remoteUrl, `${BRANCH}:${BRANCH}`], {
    cwd: staging,
    stdio: 'inherit',
  })
  console.log(`Pushed ${BRANCH}. Pages will pick it up within a minute or two.`)
} finally {
  rmSync(staging, { recursive: true, force: true })
}
