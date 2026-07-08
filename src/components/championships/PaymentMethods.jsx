import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Upload, Check, FileText, AlertCircle, X } from 'lucide-react'

export default function PaymentMethods({ method, onMethodChange, bankSlip, onBankSlipChange, total, errors }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="lg:grid lg:grid-cols-3 lg:gap-8"
    >
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <CreditCard size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Payment Method</h3>
              <p className="text-sm text-[#64748B]">
                Total payable: <span className="font-semibold text-[#0F172A]">Rs. {total.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <PaymentOption
              icon={CreditCard}
              title="Pay Online"
              desc="Pay securely via credit/debit card or online banking"
              selected={method === 'online'}
              onClick={() => onMethodChange('online')}
            />
            <PaymentOption
              icon={Upload}
              title="Bank Deposit Slip Upload"
              desc="Pay via bank deposit and upload your payment slip"
              selected={method === 'bank-slip'}
              onClick={() => onMethodChange('bank-slip')}
            />
          </div>
          {errors.method && <p className="text-xs text-red-500 mt-2">{errors.method}</p>}
        </div>

        <AnimatePresence mode="wait">
          {method === 'online' && (
            <OnlinePaymentCard key="online" total={total} />
          )}
          {method === 'bank-slip' && (
            <BankSlipUploader
              key="bank-slip"
              file={bankSlip}
              onFileChange={onBankSlipChange}
              error={errors.bankSlip}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 lg:mt-0">
        <div className="lg:sticky lg:top-28">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
            <h4 className="text-sm font-bold text-[#0F172A] mb-4">Payment Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Amount Due</span>
                <span className="font-bold text-[#0F172A]">Rs. {total.toLocaleString()}</span>
              </div>
              {method === 'online' && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>Secure Payment</span>
                  <Check size={14} />
                </div>
              )}
            </div>

            {method === 'bank-slip' && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Write your full name, institution, and payment date on the bank slip before uploading.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PaymentOption({ icon: Icon, title, desc, selected, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
        selected ? 'bg-primary shadow-sm' : 'bg-gray-100'
      }`}>
        <Icon size={22} className={selected ? 'text-white' : 'text-[#64748B]'} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-[#0F172A]">{title}</p>
        <p className="text-xs text-[#64748B] mt-0.5">{desc}</p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        selected ? 'border-primary bg-primary' : 'border-gray-300'
      }`}>
        {selected && <Check size={14} className="text-white" />}
      </div>
    </motion.button>
  )
}

function OnlinePaymentCard({ total }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm"
    >
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
          <CreditCard size={32} className="text-primary" />
        </div>
        <h4 className="text-lg font-bold text-[#0F172A] mb-2">Pay Online</h4>
        <p className="text-sm text-[#64748B] mb-6 max-w-sm mx-auto">
          You will be redirected to our secure payment gateway to complete the payment of <strong>Rs. {total.toLocaleString()}</strong>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['Visa', 'Mastercard', 'PayHere', 'OnePay'].map((name) => (
            <span key={name} className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-semibold text-[#64748B] border border-gray-100">
              {name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function BankSlipUploader({ file, onFileChange, error }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    const maxSize = 10 * 1024 * 1024
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowed.includes(f.type)) {
      alert('Please upload a JPG, PNG, or PDF file.')
      return
    }
    if (f.size > maxSize) {
      alert('File size must be under 10 MB.')
      return
    }
    onFileChange(f)
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const removeFile = () => {
    onFileChange(null)
    setPreview(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
          <Upload size={20} className="text-primary" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#0F172A]">Bank Deposit Slip</h4>
          <p className="text-sm text-[#64748B]">Upload a clear image or PDF of your bank slip</p>
        </div>
      </div>

      <div className="bg-amber-50/50 rounded-xl border border-amber-100/50 p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 space-y-1">
            <p className="font-medium">Please write the following on your bank slip:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              <li>Your full name (as registered)</li>
              <li>School / Club / Institute name</li>
              <li>Payment date</li>
            </ul>
          </div>
        </div>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('slip-upload').click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Upload size={32} className="text-[#64748B] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#0F172A] mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-[#64748B]">JPG, PNG, or PDF (max 10 MB)</p>
          <input
            id="slip-upload"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">{file.name}</p>
                <p className="text-xs text-[#64748B]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="text-[#64748B]" />
            </button>
          </div>
          {preview && (
            <div className="p-4">
              <img src={preview} alt="Bank slip preview" className="max-h-48 rounded-lg object-contain mx-auto" />
            </div>
          )}
          {!preview && file.type === 'application/pdf' && (
            <div className="p-4 text-center text-sm text-[#64748B]">
              <FileText size={32} className="mx-auto mb-2 text-primary" />
              PDF file uploaded successfully
            </div>
          )}
        </motion.div>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </motion.div>
  )
}
