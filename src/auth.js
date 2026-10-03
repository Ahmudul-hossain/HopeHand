export function setLoggedIn(role) {
  localStorage.setItem('hh_loggedIn', 'true');
  localStorage.setItem('hh_role', role);
}

export function isLoggedIn() {
  return localStorage.getItem('hh_loggedIn') === 'true';
}

export function getRole() {
  return localStorage.getItem('hh_role');
}

export function clearLogin() {
  localStorage.removeItem('hh_loggedIn');
  localStorage.removeItem('hh_role');
}