import type { Access, FieldAccess } from 'payload'

export const isAdmin = (user: unknown) => (user as { role?: string } | null)?.role === 'admin'

export const loggedIn: Access = ({ req }) => Boolean(req.user)
export const adminOnly: Access = ({ req }) => isAdmin(req.user)
export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user)
export const anyone: Access = () => true

/** Giriş yapmamış ziyaretçiler yalnızca yayınlanmış içeriği görür. */
export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

/** Yöneticiler herkesi, editörler yalnızca kendi hesabını görür/düzenler. */
export const adminOrSelf: Access = ({ req }) => {
  if (isAdmin(req.user)) return true
  return req.user ? { id: { equals: req.user.id } } : false
}
