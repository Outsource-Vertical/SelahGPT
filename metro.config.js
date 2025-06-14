const path = require("path");
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  "@components": path.resolve(__dirname, "src/components"),
  "@screens": path.resolve(__dirname, "src/screens"),
  "@services": path.resolve(__dirname, "src/services"),
  "@utils": path.resolve(__dirname, "src/utils"),
  "@types": path.resolve(__dirname, "types"),
  "@hooks": path.resolve(__dirname, "src/hooks"),
  "@context": path.resolve(__dirname, "src/context"),
};

config.resolver.sourceExts.push("cjs");
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
