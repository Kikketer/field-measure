module.exports = {
  preset: 'solid-jest/preset/browser',
  // Required to load css modules properly for tests:
  // https://jestjs.io/docs/webpack#mocking-css-modules
  moduleNameMapper: {
    // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    //   '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
}
