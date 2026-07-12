export default {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/sbf-binnen/index.html',
        'http://localhost/sbf-see/index.html',
        'http://localhost/faq/index.html',
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        // Kategorien
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        // Core Web Vitals
        'audits:largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'audits:cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'audits:total-blocking-time': ['warn', { maxNumericValue: 200 }],
        'audits:first-contentful-paint': ['warn', { maxNumericValue: 1800 }],

        // Kritische SEO-Checks
        'audits:document-title': ['error', { minScore: 1 }],
        'audits:meta-description': ['error', { minScore: 1 }],
        'audits:hreflang': ['error', { minScore: 1 }],
        'audits:canonical': ['error', { minScore: 1 }],

        // Kritische Accessibility-Checks
        'audits:image-alt': ['error', { minScore: 1 }],
        'audits:heading-order': ['warn', { minScore: 1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
