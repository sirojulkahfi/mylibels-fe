export function getDashboardRoute(roleName?: string) {
  const role = roleName?.trim().toUpperCase().replace(/[- ]/g, '_');

  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/dashboard/admin';
    case 'KEPALA_SEKOLAH':
    case 'KEPSEK':
      return '/dashboard/kepala-sekolah';
    case 'GURU':
      return '/dashboard/guru';
    case 'WALI_KELAS':
      return '/dashboard/wali-kelas';
    case 'SISWA':
      return '/student/dashboard';
    default:
      return '/dashboard';
  }
}