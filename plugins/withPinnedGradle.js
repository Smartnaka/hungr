const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TARGET_GRADLE_VERSION = '8.13';
const TARGET_DISTRIBUTION_URL = `https\\://services.gradle.org/distributions/gradle-${TARGET_GRADLE_VERSION}-bin.zip`;
const TARGET_KOTLIN_VERSION = '2.0.21';

module.exports = function withPinnedGradle(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const platformRoot = config.modRequest.platformProjectRoot;

      // Pin the Gradle wrapper version
      const wrapperPath = path.join(
        platformRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );

      if (fs.existsSync(wrapperPath)) {
        const current = fs.readFileSync(wrapperPath, 'utf8');
        const next = current.replace(
          /^distributionUrl=.*$/m,
          `distributionUrl=${TARGET_DISTRIBUTION_URL}`
        );
        if (next !== current) {
          fs.writeFileSync(wrapperPath, next);
        }
      }

      // Pin the Kotlin version in the top-level build.gradle
      // React Native 0.83 requires Kotlin 2.0+
      const buildGradlePath = path.join(platformRoot, 'build.gradle');
      if (fs.existsSync(buildGradlePath)) {
        const current = fs.readFileSync(buildGradlePath, 'utf8');
        const next = current.replace(
          /kotlinVersion\s*=\s*["'][^"']*["']/,
          `kotlinVersion = "${TARGET_KOTLIN_VERSION}"`
        );
        if (next !== current) {
          fs.writeFileSync(buildGradlePath, next);
        }
      }

      return config;
    },
  ]);
};
