/*eslint-env node*/
'use strict';

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-custom-properties')({importFrom: 'static/global.css'})
  ],
};
