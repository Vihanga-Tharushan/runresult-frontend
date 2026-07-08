import { motion } from 'framer-motion'
import { User, Mail, Phone, CalendarDays, MapPin, Building2, BookUser } from 'lucide-react'
import { districts, districtProvince } from '../../data/registration'

export default function AthleteInfoForm({ data, onChange, errors }) {
  const handleDistrictChange = (value) => {
    onChange('address', { ...data.address, district: value, province: districtProvince[value] || '' })
  }

  const handleChange = (field, value) => {
    if (field.startsWith('address.')) {
      const addrField = field.split('.')[1]
      onChange('address', { ...data.address, [addrField]: value })
      if (addrField === 'district') {
        onChange('address', { ...data.address, district: value, province: districtProvince[value] || '' })
      }
    } else {
      onChange(field, value)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Personal Information</h3>
            <p className="text-sm text-[#64748B]">Review and update your details</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <InputField
            label="Full Name"
            icon={User}
            value={data.fullName}
            onChange={(v) => handleChange('fullName', v)}
            error={errors.fullName}
            required
          />
          <InputField
            label="Name with Initials"
            icon={BookUser}
            value={data.nameWithInitials}
            onChange={(v) => handleChange('nameWithInitials', v)}
            error={errors.nameWithInitials}
            required
          />
          <SelectField
            label="Gender"
            icon={User}
            value={data.gender}
            onChange={(v) => handleChange('gender', v)}
            options={['Male', 'Female', 'Other']}
            error={errors.gender}
            required
          />
          <InputField
            label="Date of Birth"
            icon={CalendarDays}
            type="date"
            value={data.dateOfBirth}
            onChange={(v) => handleChange('dateOfBirth', v)}
            error={errors.dateOfBirth}
            required
          />
          <SelectField
            label="Age Category"
            icon={User}
            value={data.ageCategory}
            onChange={(v) => handleChange('ageCategory', v)}
            options={['Senior', 'Junior', 'Youth']}
            error={errors.ageCategory}
            required
          />
          <InputField
            label="National ID / Passport"
            icon={BookUser}
            value={data.nationalId}
            onChange={(v) => handleChange('nationalId', v)}
            placeholder="Optional"
          />
          <InputField
            label="Email Address"
            icon={Mail}
            type="email"
            value={data.email}
            onChange={(v) => handleChange('email', v)}
            error={errors.email}
            required
          />
          <InputField
            label="Mobile Number"
            icon={Phone}
            type="tel"
            value={data.mobile}
            onChange={(v) => handleChange('mobile', v)}
            error={errors.mobile}
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm mt-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
            <MapPin size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Address Information</h3>
            <p className="text-sm text-[#64748B]">Your current residential address</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <SelectField
            label="District"
            icon={MapPin}
            value={data.address.district}
            onChange={handleDistrictChange}
            options={districts}
            error={errors['address.district']}
            required
          />
          <InputField
            label="Province"
            icon={MapPin}
            value={data.address.province}
            disabled
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm mt-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
            <Building2 size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Institution Details</h3>
            <p className="text-sm text-[#64748B]">Your affiliated club, school, or institute</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <InputField
            label="School / Club / Institute"
            icon={Building2}
            value={data.institution}
            onChange={(v) => handleChange('institution', v)}
            error={errors.institution}
            required
          />
          <InputField
            label="Coach Name"
            icon={User}
            value={data.coachName}
            onChange={(v) => handleChange('coachName', v)}
            placeholder="Optional"
          />
        </div>
      </div>
    </motion.div>
  )
}

function InputField({ label, icon: Icon, value, onChange, error, type = 'text', placeholder, disabled }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] mb-1.5">
        {Icon && <Icon size={14} className="text-primary" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
          error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
        } ${disabled ? 'bg-gray-50 text-[#64748B] cursor-not-allowed' : ''}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function SelectField({ label, icon: Icon, value, onChange, options, error }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] mb-1.5">
        {Icon && <Icon size={14} className="text-primary" />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer ${
          error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
