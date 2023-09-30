// Needed to get the solidjs router to test properly
// https://github.com/solidjs/solid-router/issues/111#issuecomment-1129279527
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  // Needed to get the vite.env variables to work:
  // https://github.com/OpenSourceRaidGuild/babel-vite/tree/main/packages/babel-plugin-transform-vite-meta-env
  plugins: ['babel-plugin-transform-vite-meta-env'],
}
