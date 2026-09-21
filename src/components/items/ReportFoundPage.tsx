import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CAMPUS_LOCATIONS, 
  PRESET_IMAGE_OPTIONS 
} from '../../data/sampleData';
import { 
  Package, 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { Item } from '../../types';

export const ReportFoundPage: React.FC = () => {
  const { addItem, currentUser, categories, setCurrentView, showToast, setSelectedItemId } = useApp();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [foundDate, setFoundDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('College Canteen');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [identifyingFeatures, setIdentifyingFeatures] = useState('');
  const [currentCustody, setCurrentCustody] = useState('Campus Security Main Gate Office');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGE_OPTIONS[2].url);
  const [customImageUploaded, setCustomImageUploaded] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedItem, setSubmittedItem] = useState<Item | null>(null);

  const custodyPresets = [
    'Campus Security Main Gate Office',
    'Central Library Helpdesk Counter',
    'CSE Department Staff Office',
    'ECE Department Office',
    'College Canteen Manager Counter',
    'Physical Education / Sports Room 102',
    'Currently in finder\'s custody (verify via Proctor)',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
          setCustomImageUploaded(true);
          showToast('Image uploaded and preview generated.', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!itemName.trim()) {
      newErrors.itemName = 'Item name is required.';
    } else if (itemName.trim().length < 3) {
      newErrors.itemName = 'Item name must be at least 3 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please describe where and under what circumstances you found the item.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters.';
    }

    if (!foundDate) {
      newErrors.foundDate = 'Found date is required.';
    }

    if (!location) {
      newErrors.location = 'Found location is required.';
    }

    if (!currentCustody.trim()) {
      newErrors.currentCustody = 'Please specify where the item is currently kept.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please check the required fields before submitting.', 'error');
      return;
    }

    const created = addItem({
      user_id: currentUser ? currentUser.user_id : 'usr_student_1',
      reporter_name: currentUser ? currentUser.name : 'College Finder',
      reporter_role: currentUser ? currentUser.role : 'student',
      item_name: itemName.trim(),
      category,
      description: description.trim(),
      report_type: 'found',
      location,
      report_date: foundDate,
      color: color.trim() || 'Unspecified',
      brand: brand.trim() || 'Unspecified',
      identifying_features: identifyingFeatures.trim(),
      current_custody: currentCustody.trim(),
      image: imageUrl,
      additional_info: additionalInfo.trim(),
    });

    setSubmittedItem(created);
    showToast('Found item reported successfully! Thank you for your honesty.', 'success');
  };

  if (submittedItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Found Item Logged Successfully
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Thank You For Reporting
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your honesty strengthens our campus community. The item has been cataloged under:
            </p>
            <div className="inline-block font-mono text-lg font-bold text-[#16A34A] bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shadow-2xs">
              {submittedItem.report_code}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Item Name:</span>
              <span className="font-bold text-slate-800">{submittedItem.item_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Held At:</span>
              <span className="font-semibold text-[#1E3A8A]">{submittedItem.current_custody}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Found Location:</span>
              <span className="font-medium text-slate-800">{submittedItem.location}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSelectedItemId(submittedItem.item_id)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#4169E1] hover:bg-[#1E3A8A] text-white shadow-xs transition"
            >
              View Report Card
            </button>
            <button
              onClick={() => setCurrentView('smart_match')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-[#4169E1] border border-blue-200 transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#4169E1]" />
              <span>Check for Matching Lost Reports</span>
            </button>
            <button
              onClick={() => {
                setSubmittedItem(null);
                setItemName('');
                setDescription('');
                setColor('');
                setBrand('');
                setIdentifyingFeatures('');
                setAdditionalInfo('');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 transition"
            >
              Report Another Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
          Form 102 – Found Belonging
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
          Report an Unclaimed or Found Item on Campus
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Catalog items you have spotted or deposited at campus security to reconnect them with their owners.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Item Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package className="w-4 h-4 text-[#16A34A]" />
            <span>1. Found Item Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={itemName}
                onChange={e => {
                  setItemName(e.target.value);
                  if (errors.itemName) setErrors({ ...errors, itemName: '' });
                }}
                placeholder="e.g. Black Leather Wallet, Silver Bike Key"
                className={`w-full text-xs p-3 rounded-xl border ${errors.itemName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden`}
              />
              {errors.itemName && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.itemName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
              >
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_name}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Color
              </label>
              <input
                type="text"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="e.g. Black, Silver, Brown, Transparent"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="e.g. WildHorn, Samsung, Milton, Honda"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Describe where it was found (e.g., left on corner table in canteen, discovered near library charging station)..."
              className={`w-full text-xs p-3 rounded-xl border ${errors.description ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden`}
            />
            {errors.description && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Date, Location & Custody */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-[#16A34A]" />
            <span>2. Found Location &amp; Physical Custody</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Date Found <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={foundDate}
                onChange={e => setFoundDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Location Found <span className="text-red-500">*</span>
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
              >
                {CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Where is the item currently kept? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentCustody}
              onChange={e => {
                setCurrentCustody(e.target.value);
                if (errors.currentCustody) setErrors({ ...errors, currentCustody: '' });
              }}
              placeholder="e.g. Handed over to Campus Security Main Gate Cabin 01"
              className={`w-full text-xs p-3 rounded-xl border ${errors.currentCustody ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden mb-2`}
            />
            {errors.currentCustody && (
              <p className="text-[11px] text-red-600 mt-1 mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.currentCustody}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium py-1">Quick Select:</span>
              {custodyPresets.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setCurrentCustody(preset)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-[#4169E1] text-slate-600 border border-slate-200 transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Identifying Features (Visible markers)
            </label>
            <input
              type="text"
              value={identifyingFeatures}
              onChange={e => setIdentifyingFeatures(e.target.value)}
              placeholder="e.g. Red ribbon keychain, student sticker, blue silicone cover"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Section 3: Photo Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <ImageIcon className="w-4 h-4 text-[#16A34A]" />
            <span>3. Item Visual Confirmation</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                <img
                  src={imageUrl}
                  alt="Item Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                  {customImageUploaded ? 'Uploaded Custom Photo' : 'Selected Preset Photo'}
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Upload Item Photo
                </label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-[#16A34A] rounded-xl cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition">
                  <Upload className="w-5 h-5 text-[#16A34A] mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Click to upload photo of found item</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Or select a common college item preset:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {PRESET_IMAGE_OPTIONS.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setImageUrl(opt.url);
                        setCustomImageUploaded(false);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                        imageUrl === opt.url && !customImageUploaded
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Additional Notes
            </label>
            <input
              type="text"
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value)}
              placeholder="e.g. Owner can collect during 9 AM - 5 PM on working days with valid college ID"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#4169E1] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('browse')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#16A34A] hover:bg-emerald-800 text-white shadow-sm hover:shadow transition"
          >
            Submit Found Report
          </button>
        </div>
      </form>
    </div>
  );
};
