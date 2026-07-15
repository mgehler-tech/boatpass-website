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
        // SEO-kritische Audits → hard block (fehlendes Meta = direkter Ranking-Verlust)
        'audits:document-title': ['error', { minScore: 1 }],
        'audits:meta-description': ['error', { minScore: 1 }],
        'audits:hreflang': ['error', { minScore: 1 }],
        'audits:canonical': ['error', { minScore: 1 }],
        'audits:image-alt': ['error', { minScore: 1 }],
        'audits:link-text': ['error', { minScore: 1 }],

        // Core Web Vitals → Warnungen (CI-Messung ohne CDN/echten Browser unzuverlässig)
        'audits:largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'audits:cumulative-layout-shift': ['warn', { maxNumericValue: 0.25 }],
        'audits:total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
