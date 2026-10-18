// Sets the Android versionName at prebuild as "<app.json version>+<git sha>", or
// "...+<sha>-<label>" when THODU_BUILD_LABEL is set (for example "judge").
// versionCode is left alone. If git is not available the plain version is used.
const {withAppBuildGradle} = require('expo/config-plugins');
const {execSync} = require('child_process');

function shortSha() {
  try {
    return execSync('git rev-parse --short HEAD', {stdio: ['ignore', 'pipe', 'ignore']})
      .toString()
      .trim();
  } catch {
    return '';
  }
}

module.exports = function withGitVersionName(config) {
  return withAppBuildGradle(config, cfg => {
    const base = config.version || '1.0.0';
    const sha = shortSha();
    const label = process.env.THODU_BUILD_LABEL;
    const name = `${base}${sha ? `+${sha}` : ''}${label ? `-${label}` : ''}`;
    cfg.modResults.contents = cfg.modResults.contents.replace(
      /versionName\s+"[^"]*"/,
      `versionName "${name}"`,
    );
    return cfg;
  });
};
