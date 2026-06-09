import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from '../services/api';
import toast from 'react-hot-toast';

function CreateTicketPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 3,
  });

  const validateForm = () => {
    const newErrors = {};
    if (!form.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (!form.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email address';
    }
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'priority' ? parseInt(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const ticket = await createTicket(form);
      toast.success(`Ticket ${ticket.ticket_id} created!`);
      navigate(`/tickets/${ticket.ticket_id}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') toast.error(detail);
      else if (Array.isArray(detail)) detail.forEach((d) => toast.error(d.msg || 'Validation error'));
      else toast.error('Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  const priorities = [
    { value: 1, label: 'P1 — Very Low' },
    { value: 2, label: 'P2 — Low' },
    { value: 3, label: 'P3 — Medium' },
    { value: 4, label: 'P4 — High' },
    { value: 5, label: 'P5 — Critical' },
  ];

  const inputClass = (field) =>
    `w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-white/[0.04] border ${
      errors[field] ? 'border-red-300 dark:border-red-500/40' : 'border-slate-200 dark:border-white/[0.08]'
    } rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 transition-all duration-200`;

  const ErrorMsg = ({ msg }) =>
    msg ? <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{msg}</p> : null;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tickets
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create New Ticket</h1>
        <p className="text-slate-400 dark:text-slate-500 mt-1 text-sm">Fill in the details to submit a new support request</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] rounded-2xl p-8 space-y-6 transition-colors duration-300"
        id="create-ticket-form"
      >
        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Customer Name <span className="text-red-400">*</span>
          </label>
          <input
            id="customer_name"
            name="customer_name"
            type="text"
            value={form.customer_name}
            onChange={handleChange}
            placeholder="John Doe"
            className={inputClass('customer_name')}
          />
          <ErrorMsg msg={errors.customer_name} />
        </div>

        <div>
          <label htmlFor="customer_email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Customer Email <span className="text-red-400">*</span>
          </label>
          <input
            id="customer_email"
            name="customer_email"
            type="email"
            value={form.customer_email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={inputClass('customer_email')}
          />
          <ErrorMsg msg={errors.customer_email} />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Subject <span className="text-red-400">*</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={form.subject}
            onChange={handleChange}
            placeholder="Brief description of the issue"
            className={inputClass('subject')}
          />
          <ErrorMsg msg={errors.subject} />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Provide a detailed description..."
            className={`${inputClass('description')} resize-none`}
          />
          <ErrorMsg msg={errors.description} />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 transition-all duration-200 cursor-pointer"
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md hover:shadow-brand-500/15 transition-all duration-200 active:scale-[0.98]"
            id="submit-ticket-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Ticket'
            )}
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.08] rounded-xl transition-all duration-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateTicketPage;
