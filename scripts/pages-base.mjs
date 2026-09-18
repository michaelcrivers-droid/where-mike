/**
 * Prints the base path a GitHub Pages build needs, worked out from the git
 * remote. Used by `npm run build:pages`.
 *
 * A project site is served from `https://<user>.github.io/<repo>/`, so the
 * built asset paths need that `<repo>/` prefix. Hard-coding it meant renaming
 * or forking the repository produced a deployment that fetched its JavaScript
 * from a path that did not exist — a blank page, with nothing on it to suggest
 * why. A user or organisation site (`<user>.github.io`) is served from the
 * domain root and needs no prefix, which is detected here too.
 */

import { execFileSync } from 'node:child_process'

function remoteUrl() {
  try {
    return execFileSync('git', ['remote', 'get-url', 'origin'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

const match = /[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/.exec(remoteUrl())
const owner = match?.[1] ?? ''
const repo = match?.[2] ?? ''

const base = !repo || repo.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '/' : `/${repo}/`

process.stdout.write(base)
