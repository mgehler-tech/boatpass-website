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
        // SEO-Score: direkter Google-Rankingfaktor → hard block
        'categories:seo': ['error', { minScore: 0.95 }],

        // Accessibility → hard block
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // Performance: CI-Umgebung misst unzuverlässig → nur Warnung
        'categories:performance': ['warn', { minScore: 0.8 }],

        // Core Web Vitals: Warnungen (CI ≠ echte Nutzerbedingungen)
        'audits:largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'audits:cumulative-layout-shift': ['warn', { maxNumericValue: 0.25 }],
        'audits:total-blocking-time': ['warn', { maxNumericValue: 300 }],

        // Kritische SEO-Checks → hard block (fehlendes Meta = direkter Ranking-Verlust)
        'audits:document-title': ['error', { minScore: 1 }],
        'audits:meta-description': ['error', { minScore: 1 }],
        'audits:hreflang': ['error', { minScore: 1 }],
        'audits:canonical': ['error', { minScore: 1 }],

        // Accessibility
        'audits:image-alt': ['error', { minScore: 1 }],
        'audits:heading-order': ['warn', { minScore: 1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
