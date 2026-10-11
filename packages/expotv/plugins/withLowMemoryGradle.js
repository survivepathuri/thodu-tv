// Keeps the Android build gentle on low-memory PCs. Applied at prebuild, so the
// generated (git-ignored) android/gradle.properties gets the same settings on
// every machine. It sets no local paths: point JAVA_HOME at a JDK 17.
const {withGradleProperties} = require('expo/config-plugins');

const SETTINGS = {
  'org.gradle.parallel': 'false',
  'org.gradle.workers.max': '2',
  'kotlin.daemon.jvm.options': '-Xmx1024m',
};

module.exports = function withLowMemoryGradle(config) {
  return withGradleProperties(config, cfg => {
    for (const [key, value] of Object.entries(SETTINGS)) {
      cfg.modResults = cfg.modResults.filter(i => !(i.type === 'property' && i.key === key));
      cfg.modResults.push({type: 'property', key, value});
    }
    return cfg;
  });
};
