const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: ['./src/options/*.tsx'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    variants: {},
    plugins: [require('@tailwindcss/ui')],
};
