/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Webflow Designer Design System
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'wf-sm': ['11.5px', { letterSpacing: '-0.115px', lineHeight: '1.4' }],
        'wf-base': ['12.5px', { lineHeight: '1.4' }],
      },
      colors: {
        // Webflow Background Colors
        'wf-bg-primary': '#1E1E1E',
        'wf-bg-secondary': '#2E2E2E',
        'wf-bg-tertiary': '#383838',
        'wf-bg-input': 'rgba(0, 0, 0, 0.15)',

        // Webflow Action Colors
        'wf-action-primary': '#006ACC',
        'wf-action-hover': '#187CD9',

        // Webflow Text Colors
        'wf-text-primary': '#F5F5F5',
        'wf-text-secondary': '#BDBDBD',
        'wf-text-tertiary': '#A3A3A3',
        'wf-text-inactive': '#757575',

        // Webflow Status Colors
        'wf-success-bg': '#007A41',
        'wf-success-text': '#63D489',
        'wf-warning-bg': '#946B00',
        'wf-warning-text': '#F3C831',
        'wf-error-bg': '#CF313B',
        'wf-error-text': '#FF8A8A',
        'wf-info-bg': '#734CE0',
        'wf-info-text': '#B89EFF',

        // Webflow Border Colors
        'wf-border': 'rgba(255, 255, 255, 0.13)',
        'wf-border-subtle': 'rgba(255, 255, 255, 0.19)',
      },
      borderRadius: {
        'wf': '4px',
      },
      spacing: {
        'wf-1': '4px',
        'wf-2': '8px',
        'wf-3': '12px',
        'wf-4': '16px',
        'wf-5': '20px',
        'wf-6': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}