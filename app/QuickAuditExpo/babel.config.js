module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            "@components": "./components",
            "@screens": "./screens",
            "@assets": "./assets",
            "@utils": "./utils",
            "@theme": "./theme"
          }
        }
      ]
    ]
  };
};
