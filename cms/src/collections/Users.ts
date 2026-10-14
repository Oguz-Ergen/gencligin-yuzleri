import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, adminOrSelf, isAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Kullanıcı', plural: 'Kullanıcılar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Yönetim',
    // Kullanıcılar menüsü yalnızca yöneticilere görünür.
    hidden: ({ user }) => !isAdmin(user),
  },
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  fields: [
    { name: 'name', label: 'Ad Soyad', type: 'text', required: true },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Yönetici (kullanıcıları yönetir)', value: 'admin' },
        { label: 'Editör (içerik girer)', value: 'editor' },
      ],
      access: { create: adminOnlyField, update: adminOnlyField },
      saveToJWT: true,
    },
  ],
}
