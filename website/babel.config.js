module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/plugin-proposal-private-methods',            { loose: false }], // Lines added in order to
    ['@babel/plugin-proposal-private-property-in-object', { loose: false }], // silence Babel warnings.
  ],
};
