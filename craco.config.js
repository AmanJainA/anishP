module.exports = {
  webpack: {
    configure: (config) => {
      // CRA 5 + modern ESM packages such as framer-motion.
      config.module.rules.unshift({
        test: /\.m?js$/,
        include: /node_modules[\\/]framer-motion/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false
        }
      });

      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOfRule) => {
            if (oneOfRule.test && oneOfRule.test.toString().includes("js")) {
              oneOfRule.resolve = {
                ...(oneOfRule.resolve || {}),
                fullySpecified: false
              };
            }
          });
        }
      });

      config.resolve = {
        ...(config.resolve || {}),
        fullySpecified: false
      };

      return config;
    }
  }
};
