const { colors, icons, typography, shadows } = require('./stallion');
const { plugin: hoverFocusPlugin } = require('./plugins/hoverFocus');
const { generateScreens } = require('./plugins/screens');
const { typographyElementsList, plugin: typographyPlugin } = require('./plugins/typography');

const rootFontSize = 16;

const convertToRem = function(pixelValue) {
	let calc = pixelValue / rootFontSize;
	return calc.toFixed(10) + 'rem';
};

const generateSteps = function(start, end, multiple = 1, callback) {
	let steps = {};
	const values = Array.from(new Array(end - start + 1), (v, k) => k + start).filter((n) => n % multiple === 0);
	values.forEach((val) => {
		steps[val] = callback(val);
	});
	return steps;
};

const generateIconSpacingValues = () => Object.entries(icons).reduce((acc, [name, { size }]) => ({
	...acc,
	[`icon-${name}`]: size
}), {})

const generateIconSafelist = () => Object.keys(generateIconSpacingValues()).reduce((acc, iconName) => [`w-${iconName}`, `h-${iconName}`, ...acc], [])

module.exports = {
	important: '#app',
	mode: 'jit',
	content: [
		"./**/*.liquid",
	],
	safelist: [
		...typographyElementsList,
		...generateIconSafelist(),
	],
	theme: {
		extend: {
			borderWidth: {
				'3': '3px',
			  }
		},
		screens: {
			...generateScreens({
				tiny:  376,
				xs:    560,
				sm:    640,
				md:    768,
				lg:    1024,
				xl:    1280,
				'2xl':  1600
			}),
		},
		maxWidth: {
			'none': 'none',
			'content': '1152px',
			'text': '800px',
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			...colors,
		},
		fontFamily: Object.keys(typography.fonts).reduce((acc, font) => ({
			...acc,
			[font]: typography.fonts[font].family
		}), {}),
		fontSize: generateSteps(8, 72, 1, (val) => {
			return convertToRem(val);
		}),
		lineHeight:{
			'100': '1',
			'120': '1.2',
			'125': '1.25',
			'140': '1.4',
			'150': '1.5',
		},
		letterSpacing: {
			'-1':  '-.01em',
			0:  '0',
			'1':  '.01em',
			'5':  '.05em',
			'10':  '.1em',
			'20': '.20em',
			'15r': '.15rem',
			'175r': '.175rem',
			'225r': '.225rem',
		},
		dropShadow: {
			...shadows,
		},
		boxShadow: {
			...shadows,
		},
		borderRadius: {
			'none': '0px',
			DEFAULT: '10px',
			'full': '50%',
		},
		spacing: (theme) => ({
			...generateIconSpacingValues(),
			'0': '0px',
			's1': '4px',
			's2': '8px',
			's3': '12px',
			's4': '16px',
			's5': '20px',
			's6': '24px',
			's7': '32px',
			's8': '40px',
			's9': '48px',
			's10': '64px',
			's11': '80px',
			's12': '96px',
			's13': '120px',
			's14': '160px',
			'30': '30px'
		}),
	},
	corePlugins: {
		container:false,
	},
	plugins: [
		require('tw-elements/dist/plugin'),
		hoverFocusPlugin,
		typographyPlugin,
	]
};
