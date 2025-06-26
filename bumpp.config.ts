import { defineConfig } from 'bumpp';

export default defineConfig({
  files: ['package.json'],
  commit: 'release: v%s',
  tag: 'v%s',
  push: true,
  // Default to patch releases - be conservative!
  release: 'patch',
  // Confirm before releasing
  confirm: true,
});
