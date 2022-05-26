const plugin = require('tailwindcss/plugin');

exports.plugin = plugin(function({ addVariant, e }) {
    addVariant('hover/focus', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
            return `.${e(`hover\/focus${separator}${className}`)}:hover, .${e(`hover\/focus${separator}${className}`)}:focus`
        })
    })
})