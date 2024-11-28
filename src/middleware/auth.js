
export default function auth({ route, redirect, $auth }) {
  const publicPages = ['/login', '/admin-login', '/register', '/forgot-password'];
  const authRequired = !publicPages.includes(route.path);

  if (authRequired && !$auth.loggedIn) {
    return redirect('/login');
  }

  // Kiểm tra quyền admin cho các trang admin
  if (route.path.startsWith('/admin') && $auth.user.role !== 'admin') {
    return redirect('/');
  }
}