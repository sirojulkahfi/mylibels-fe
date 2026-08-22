export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Pada sisi client (Browser), selalu gunakan IP/Hostname saat ini
    return `http://${window.location.hostname}:5000`;
  }
  // Pada sisi server / saat build time SSR
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};
