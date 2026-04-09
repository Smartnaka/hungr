const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TARGET_GRADLE_VERSION = '8.10.2';
const TARGET_DISTRIBUTION_URL = `https\\://services.gradle.org/distributions/gradle-${TARGET_GRADLE_VERSION}-bin.zip`;

module.exports = function withPinnedGradle(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const wrapperPath = path.join(
        config.modRequest.platformProjectRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );

      if (!fs.existsSync(wrapperPath)) {
        return config;
      }

      const current = fs.readFileSync(wrapperPath, 'utf8');
      const next = current.replace(
        /^distributionUrl=.*$/m,
        `distributionUrl=${TARGET_DISTRIBUTION_URL}`
      );

      if (next !== current) {
        fs.writeFileSync(wrapperPath, next);
      }

      return config;
    },
  ]);
};
