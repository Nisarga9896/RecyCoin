import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, ImagePlus } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../components/Toast';
import { ConditionBadge, EmptyState, Field, FullLoader, ItemThumb, inputClass, primaryBtn, ghostBtn, Spinner } from '../components/Ui';
import Particles from '../components/Particles';
import { compressImage, itemImage } from '../utils/image';

const CATEGORIES = ['Mobile Phones', 'Laptops & Tablets', 'Televisions', 'Batteries', 'Cables & Peripherals', 'Home Appliances', 'Audio & Wearables', 'Console & Parts'];

const empty = {
  name: '',
  description: '',
  category: CATEGORIES[0],
  condition: 'Good',
  price: '',
  images: [],
  age: '',
  defects: '',
};

export default function ManageProducts() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    try {
      const { items } = await api.get('/seller/items');
      setItems(items);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm({ ...empty, images: [] });
    setModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      condition: item.condition,
      price: item.price,
      images: Array.isArray(item.images) ? item.images : [],
      age: item.age || '',
      defects: item.defects || '',
    });
    setModal(true);
  }

  async function addImages(e) {
    const files = Array.from(e.target.files || []).slice(0, 4 - form.images.length);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map((file) => compressImage(file)));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded].slice(0, 4) }));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(index) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.images.length) {
      toast('Add at least one product photo', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editing) {
        await api.patch(`/items/${editing._id}`, payload);
        toast('Product updated ✓', 'success');
      } else {
        await api.post('/items', payload);
        toast('Product listed for sale!', 'success');
      }
      setModal(false);
      load();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(item) {
    try {
      await api.patch(`/items/${item._id}`, { status: item.status === 'available' ? 'hidden' : 'available' });
      toast(item.status === 'available' ? 'Item hidden from marketplace' : 'Item is now live', 'info');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function remove() {
    try {
      await api.del(`/items/${deleting._id}`);
      toast('Item deleted', 'success');
      setDeleting(null);
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={6} />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Manage <span className="text-gradient">products</span>
            </h1>
            <p className="mt-2 text-emerald-100/50">List e-waste, edit details, or pause a listing.</p>
          </div>
          <button onClick={openAdd} className={primaryBtn}>
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>

        {loading ? (
          <FullLoader label="Loading your products…" />
        ) : items.length ? (
          <div className="space-y-3">
            {items.map((it, i) => (
              <motion.div
                key={it._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 rounded-3xl border border-emerald-300/12 bg-[#050e15]/80 p-5"
              >
                <ItemThumb image={itemImage(it)} emoji={it.emoji || '📦'} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-white">{it.name}</h3>
                    <ConditionBadge condition={it.condition} />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-emerald-100/40">{it.description}</p>
                  <p className="mt-0.5 font-mono text-[10px] font-semibold text-emerald-200/40">{it.category} · Listed {new Date(it.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-extrabold text-white">₹{it.price.toLocaleString('en-IN')}</p>
                  <span className={`text-[11px] font-bold uppercase ${it.status === 'available' ? 'text-emerald-300' : it.status === 'sold' ? 'text-sky-300' : 'text-rose-300'}`}>
                    {it.status}
                  </span>
                </div>
                <div className="flex shrink-0 gap-2">
                  {it.status !== 'sold' && (
                    <IconBtn title={it.status === 'available' ? 'Hide from marketplace' : 'Make available'} onClick={() => toggleStatus(it)}>
                      {it.status === 'available' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </IconBtn>
                  )}
                  <IconBtn title="Edit" onClick={() => openEdit(it)}>
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn title="Delete" danger onClick={() => setDeleting(it)}>
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🏷️"
            title="No products listed yet"
            subtitle="Add your first e-waste listing and start earning when it sells."
          >
            <button onClick={openAdd} className={`${primaryBtn} mt-3`}>
              <Plus className="h-4 w-4" /> Add your first product
            </button>
          </EmptyState>
        )}
      </div>

      {/* Add / edit modal */}
      <AnimatePresence>
        {modal && (
          <ModalShell onClose={() => setModal(false)} title={editing ? 'Edit product' : 'List a new product'}>
            <form onSubmit={submit} className="space-y-4">
              <Field label="Product photos *" hint="At least 1 image is required. Upload up to 4; the first is the cover.">
                <div className="flex flex-wrap gap-2">
                  {form.images.map((src, index) => (
                    <div key={index} className="relative h-20 w-20 overflow-hidden rounded-xl border border-emerald-300/20">
                      <img src={src} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        title="Remove image"
                        className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500/90 text-white transition hover:bg-rose-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 4 && (
                    <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border border-dashed border-emerald-300/25 bg-emerald-400/5 text-emerald-300/70 transition hover:border-emerald-300/50 hover:text-emerald-200">
                      {uploading ? <Spinner className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
                      <input type="file" accept="image/*" multiple className="hidden" onChange={addImages} />
                    </label>
                  )}
                </div>
              </Field>

              <Field label="Item name">
                <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone 11 – 64GB" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Condition">
                  <select className={inputClass} value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                    {['Refurbished', 'Good', 'Fair', 'Spare Parts'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Price (₹)">
                <input required type="number" min={0} className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="2999" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="How old is it?" hint="Approximate age of the item">
                  <input className={inputClass} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="e.g. 2 years" />
                </Field>
                <Field label="Any defects?" hint="Scratches, faults, missing parts">
                  <input className={inputClass} value={form.defects} onChange={(e) => setForm({ ...form, defects: e.target.value })} placeholder="e.g. scratch on screen" />
                </Field>
              </div>

              <Field label="Description">
                <textarea required rows={3} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Condition, accessories, why you're parting with it…" />
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className={`${primaryBtn} flex-1`}>
                  {saving ? <Spinner /> : null}
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Publish listing'}
                </button>
                <button type="button" onClick={() => setModal(false)} className={ghostBtn}>Cancel</button>
              </div>
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleting && (
          <ModalShell onClose={() => setDeleting(null)} title="Delete this product?" narrow>
            <p className="text-sm text-emerald-100/60">
              “{deleting.name}” will be permanently removed from the marketplace. This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={remove} className="flex-1 rounded-2xl bg-rose-500/90 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-500">
                Yes, delete it
              </button>
              <button onClick={() => setDeleting(null)} className={ghostBtn}>Cancel</button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>
    </section>
  );
}

function ModalShell({ children, title, onClose, narrow }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-[#020509]/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
        className={`w-full ${narrow ? 'max-w-md' : 'max-w-lg'} rounded-3xl border border-emerald-300/20 bg-[#050e15] p-7 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-xl p-2 text-emerald-100/50 transition hover:bg-emerald-400/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function IconBtn({ children, onClick, danger, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-xl transition active:scale-90 ${
        danger ? 'border border-rose-300/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' : 'border border-emerald-300/15 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
      }`}
    >
      {children}
    </button>
  );
}
