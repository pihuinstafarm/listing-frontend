const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ['./src/**/**/*.{js,ts,jsx,tsx}'],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            fontFamily: {
                // Setting gilroy as the default font: https://stackoverflow.com/a/62437811/2971900
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#224957',
            },
            boxShadow: {
                '3xl': '0 0 32px 0 rgba(136, 152, 170, 0.15)',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                },
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite',
            },
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },
        screens: {
            md: { max: '1000px' },
            sm: { max: '875px' },
            vsm: { max: '675px' },
        },
    },
    plugins: [],
}
