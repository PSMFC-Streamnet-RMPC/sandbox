// Server status checking utilities

/**
 * Check if a server is reachable via HTTP/HTTPS
 * Note: This only works for servers with web interfaces due to browser restrictions
 */
export const checkServerStatus = async (url) => {
  if (!url) {
    return {
      online: false,
      checkedAt: new Date().toISOString(),
      error: 'No URL provided'
    };
  }

  try {
    // Ensure URL has protocol
    let checkUrl = url;
    if (!checkUrl.startsWith('http://') && !checkUrl.startsWith('https://')) {
      checkUrl = 'https://' + checkUrl;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(checkUrl, {
      method: 'HEAD',
      mode: 'no-cors', // Required for cross-origin requests
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // With no-cors, we can't read the response status
    // but if we get here without error, the server responded
    return {
      online: true,
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      online: false,
      checkedAt: new Date().toISOString(),
      error: error.message
    };
  }
};

/**
 * Ping a server using a management URL or FQDN
 */
export const pingServer = async (server) => {
  // Try management URL first, then construct from FQDN
  const url = server.management_url ||
              (server.fqdn ? `https://${server.fqdn}` : null) ||
              (server.ip_external ? `https://${server.ip_external}` : null);

  if (!url) {
    return {
      online: false,
      checkedAt: new Date().toISOString(),
      error: 'No reachable URL configured'
    };
  }

  return checkServerStatus(url);
};

// OS Type options
export const OS_TYPES = [
  { value: 'ubuntu', label: 'Ubuntu Server' },
  { value: 'debian', label: 'Debian' },
  { value: 'centos', label: 'CentOS' },
  { value: 'rhel', label: 'Red Hat Enterprise Linux' },
  { value: 'rocky', label: 'Rocky Linux' },
  { value: 'alma', label: 'AlmaLinux' },
  { value: 'windows_server', label: 'Windows Server' },
  { value: 'windows_sql', label: 'Windows Server (SQL)' },
  { value: 'esxi', label: 'VMware ESXi' },
  { value: 'proxmox', label: 'Proxmox VE' },
  { value: 'freebsd', label: 'FreeBSD' },
  { value: 'other', label: 'Other' }
];

// Environment options
export const ENVIRONMENTS = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing' },
  { value: 'dr', label: 'Disaster Recovery' }
];

// Server role options
export const SERVER_ROLES = [
  { value: 'web', label: 'Web Server' },
  { value: 'app', label: 'Application Server' },
  { value: 'database', label: 'Database Server' },
  { value: 'file', label: 'File Server' },
  { value: 'mail', label: 'Mail Server' },
  { value: 'dns', label: 'DNS Server' },
  { value: 'proxy', label: 'Proxy/Load Balancer' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'backup', label: 'Backup Server' },
  { value: 'ci_cd', label: 'CI/CD Server' },
  { value: 'container', label: 'Container Host' },
  { value: 'hypervisor', label: 'Hypervisor' },
  { value: 'multi', label: 'Multi-purpose' },
  { value: 'other', label: 'Other' }
];

// Storage type options
export const STORAGE_TYPES = [
  { value: 'ssd', label: 'SSD' },
  { value: 'nvme', label: 'NVMe' },
  { value: 'hdd', label: 'HDD' },
  { value: 'san', label: 'SAN' },
  { value: 'nas', label: 'NAS' },
  { value: 'mixed', label: 'Mixed' }
];

// Architecture options
export const ARCHITECTURES = [
  { value: 'x64', label: 'x86_64 (AMD64)' },
  { value: 'arm64', label: 'ARM64 (AArch64)' },
  { value: 'x86', label: 'x86 (32-bit)' }
];
