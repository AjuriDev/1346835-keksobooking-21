const path = require('path');

module.exports = {
  entry: [
    './js/util.js',
    './js/pin.js',
    './js/card.js',
    './js/load.js',
    './js/move.js',
    './js/map.js',
    './js/filter.js',
    './js/form.js',
    './js/preview.js',
    './js/main.js',
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
