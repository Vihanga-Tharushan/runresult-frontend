import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Plus, Mail } from 'lucide-react'
import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'
import { TableSkeleton } from './LoadingSkeleton'
import ConfirmDialog from './ConfirmDialog'

export default function StaffTable({ staff, loading, onDelete, onCreate, onView }) {
  const [deleteTarget, setDeleteTarget] = useState(null)

  if (loading) return <TableSkeleton rows={5} cols={5} />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm whitespace-nowrap">
          <Plus size={16} /> Add Staff
        </motion.button>
      </div>

      {staff.length === 0 ? (
        <EmptyState icon="users" title="No staff members found"
          description="Create your first staff account to get started."
          action={<motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all"><Plus size={16} /> Add Staff</motion.button>} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Role</th>
                  <th className="w-24 px-5 py-4" /> 
                </tr>
              </thead>
              <tbody>
                {staff.map((member, index) => (
                  <motion.tr
                    key={member._id || member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {member.name ? member.name.split(' ').map(n => n[0]).join('') : member.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-[#0F172A]">{member.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                        <Mail size={13} />
                        <span>{member.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#64748B] hidden md:table-cell">{member.role || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => onView(member)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-amber-600 hover:bg-amber-50 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(member)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { onDelete(deleteTarget._id || deleteTarget.id); setDeleteTarget(null) }}
        title="Delete Staff Account"
        message={`Are you sure you want to delete the account for "${deleteTarget?.name || deleteTarget?.email}"? This action cannot be undone.`}
        confirmText="Delete Account"
        variant="danger"
      />
    </div>
  )
}
