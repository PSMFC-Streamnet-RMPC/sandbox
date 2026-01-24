/**
 * Site Status Checker and WordPress Detection
 *
 * Checks if a WordPress site is online and attempts to detect:
 * - WordPress version
 * - Theme name
 * - Plugins (limited to those that expose themselves publicly)
 * - Server/hosting info from headers
 *
 * Note: Due to CORS restrictions in browsers, we use a CORS proxy for checking.
 * In production, you'd want your own backend or serverless function for this.
 */

// Public CORS proxies (for prototype use - may have rate limits)
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

let currentProxyIndex = 0;

const getProxyUrl = (url) => {
  return CORS_PROXIES[currentProxyIndex] + encodeURIComponent(url);
};

const rotateProxy = () => {
  currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
};

/**
 * Check if a site is online
 */
export const checkSiteStatus = async (url) => {
  const startTime = Date.now();

  try {
    // Try direct fetch first (works for sites with CORS enabled)
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });

    // no-cors mode always returns opaque response, so we can't check status
    // but if it doesn't throw, the site is likely reachable
    return {
      online: true,
      responseTime: Date.now() - startTime,
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    // Site unreachable
    return {
      online: false,
      error: error.message,
      checkedAt: new Date().toISOString()
    };
  }
};

/**
 * Detect WordPress information from a site
 */
export const detectWordPressInfo = async (url) => {
  const info = {
    isWordPress: false,
    wpVersion: null,
    themeName: null,
    plugins: [],
    generator: null,
    errors: []
  };

  try {
    // Use CORS proxy to fetch the page content
    const proxyUrl = getProxyUrl(url);
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'text/html'
      }
    });

    if (!response.ok) {
      rotateProxy();
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Check for WordPress indicators
    if (html.includes('/wp-content/') || html.includes('/wp-includes/')) {
      info.isWordPress = true;
    }

    // Extract page title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      info.pageTitle = titleMatch[1].trim();
    }

    // Extract meta description (try multiple formats)
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    if (metaDescMatch) {
      info.metaDescription = metaDescMatch[1].trim();
    }

    // Try Open Graph description as fallback
    if (!info.metaDescription) {
      const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
      if (ogDescMatch) {
        info.metaDescription = ogDescMatch[1].trim();
      }
    }

    // Extract WordPress version from generator meta tag
    const generatorMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']([^"']+)["']/i);
    if (generatorMatch) {
      info.generator = generatorMatch[1];
      const wpVersionMatch = generatorMatch[1].match(/WordPress\s+([\d.]+)/i);
      if (wpVersionMatch) {
        info.wpVersion = wpVersionMatch[1];
        info.isWordPress = true;
      }
    }

    // Extract theme name from stylesheet URL
    const themeMatch = html.match(/\/wp-content\/themes\/([^\/'"]+)/);
    if (themeMatch) {
      info.themeName = themeMatch[1];
      info.isWordPress = true;
    }

    // Extract plugins from wp-content/plugins paths
    const pluginMatches = html.matchAll(/\/wp-content\/plugins\/([^\/'"]+)/g);
    const pluginSet = new Set();
    for (const match of pluginMatches) {
      pluginSet.add(match[1]);
    }
    info.plugins = Array.from(pluginSet).slice(0, 20); // Limit to 20 plugins

  } catch (error) {
    info.errors.push(`Failed to fetch page: ${error.message}`);
  }

  // Try to fetch wp-json API for more info
  try {
    const wpJsonUrl = new URL('/wp-json/', url).toString();
    const proxyUrl = getProxyUrl(wpJsonUrl);
    const response = await fetch(proxyUrl);

    if (response.ok) {
      const data = await response.json();
      info.isWordPress = true;

      if (data.name) {
        info.siteName = data.name;
      }
      if (data.description) {
        info.siteDescription = data.description;
      }
    }
  } catch (error) {
    // wp-json might be disabled, that's okay
  }

  return info;
};

/**
 * Try to detect hosting provider from headers or page content
 */
export const detectHostingProvider = async (url) => {
  const hostingIndicators = {
    'WP Engine': ['wpe', 'wpengine'],
    'Pantheon': ['pantheon'],
    'Kinsta': ['kinsta'],
    'Flywheel': ['flywheel', 'getflywheel'],
    'SiteGround': ['siteground', 'sgvps'],
    'Bluehost': ['bluehost'],
    'GoDaddy': ['godaddy', 'secureserver'],
    'Cloudways': ['cloudways'],
    'Pressable': ['pressable'],
    'WordPress.com': ['wordpress.com', 'wpcomstaging'],
    'Netlify': ['netlify'],
    'Vercel': ['vercel'],
    'AWS': ['amazonaws', 'cloudfront'],
    'Cloudflare': ['cloudflare'],
  };

  try {
    const proxyUrl = getProxyUrl(url);
    const response = await fetch(proxyUrl);
    const html = await response.text();

    // Check page content for hosting indicators
    const htmlLower = html.toLowerCase();
    for (const [provider, indicators] of Object.entries(hostingIndicators)) {
      for (const indicator of indicators) {
        if (htmlLower.includes(indicator)) {
          return provider;
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return null;
};

/**
 * Full site scan - combines all detection methods
 */
export const scanSite = async (url) => {
  // Normalize URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const results = {
    url,
    status: 'unknown',
    lastChecked: new Date().toISOString(),
    wpInfo: null,
    hostingProvider: null,
    errors: []
  };

  // Check if site is online
  const statusCheck = await checkSiteStatus(url);
  results.status = statusCheck.online ? 'online' : 'offline';
  results.responseTime = statusCheck.responseTime;

  if (!statusCheck.online) {
    results.errors.push('Site appears to be offline');
    return results;
  }

  // Detect WordPress info
  try {
    results.wpInfo = await detectWordPressInfo(url);
  } catch (error) {
    results.errors.push(`WordPress detection failed: ${error.message}`);
  }

  // Detect hosting provider
  try {
    results.hostingProvider = await detectHostingProvider(url);
  } catch (error) {
    results.errors.push(`Hosting detection failed: ${error.message}`);
  }

  return results;
};
