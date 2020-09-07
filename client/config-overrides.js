const { override, addBabelPlugin } = require("customize-cra");
const { addReactRefresh } = require("customize-cra-react-refresh");

module.exports = override(
  addBabelPlugin("babel-plugin-macros"),
  addBabelPlugin([
    "babel-plugin-styled-components",
    {
      displayName: true,
      // any extra config from babel-plugin-styled-components
    },
  ]),
  addReactRefresh()
);
