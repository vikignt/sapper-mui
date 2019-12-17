/*eslint-env node*/
import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';

import root from 'rollup-plugin-root-import';
import md from './build/rollup-plugin-markdown';
import hljs from 'highlight.js';
import sveltePreprocess from 'svelte-preprocess';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import autoprefixer from 'autoprefixer';
import properties from 'postcss-custom-properties';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);
const dedupe = importee => importee === 'svelte' || importee.startsWith('svelte/');

const preprocess = sveltePreprocess({ postcss: true });

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			root({
				root: path.resolve(__dirname, './src'),
				useEntry: 'prepend',

				// If we don't find the file verbatim, try adding these extensions
				extensions: ['.mjs', '/index.mjs', '.js', '/index.js'],
			}),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				extensions: ['.svelte', '.svg'],
				dev,
				hydratable: true,
				preprocess,
				emitCss: true
			}),
			md({
				marked: {
					highlight: function(code) {
						return hljs.highlightAuto(code, ['bash', 'html', 'css']).value;
					},
				},
			}),
			resolve({
				browser: true,
				dedupe
			}),
			commonjs(),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			root({
				root: path.resolve(__dirname, './src'),
				useEntry: 'prepend',

				// If we don't find the file verbatim, try adding these extensions
				extensions: ['.mjs', '/index.mjs', '.js', '/index.js'],
			}),
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				extensions: ['.svelte', '.svg'],
				generate: 'ssr',
				dev,
				preprocess,
			}),
			md({
				marked: {
					highlight: function(code) {
						return hljs.highlightAuto(code, ['bash', 'html', 'css']).value;
					},
				},
			}),
			postcss({
				extract: true,
				minimize: !dev,
				sourceMap: false,
				plugins: [
					autoprefixer(),
					properties({
						importFrom: path.resolve(__dirname, './static/global.css'),
					}),
				],
			}),
			resolve({
				dedupe
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		onwarn,
	},

	// serviceworker: {
	// 	input: config.serviceworker.input(),
	// 	output: config.serviceworker.output(),
	// 	plugins: [
	// 		resolve(),
	// 		replace({
	// 			'process.browser': true,
	// 			'process.env.NODE_ENV': JSON.stringify(mode)
	// 		}),
	// 		commonjs(),
	// 		!dev && terser()
	// 	],

	// 	onwarn,
	// }
};
