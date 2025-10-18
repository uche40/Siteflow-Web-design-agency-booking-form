import React, { useState, useMemo, useCallback } from 'react';
import { FormData, WebsiteTypeId, Feature, DesignStyle, Timeline, CmsOption, ColorPalette } from '../lib/data';
import { WEBSITE_TYPES, FEATURE_PRICES, TIMELINE_ADJUSTMENTS, CMS_PRICES, MAINTENANCE_PLAN_PRICE, MONTHLY_HOSTING_PRICE } from '../lib/data';
import { Building2, ShoppingCart, Briefcase, FileText, Zap, Sparkles, Info, Plus, Minus, Heart, BookOpen, CalendarDays, Home, Users, Ticket, Mic, AppWindow, Check, User, RefreshCw, LayoutGrid, X, DollarSign, FileStack, CheckSquare, Database, Paintbrush, Palette, Wrench, Server, Clock, Lock } from '../components/icons';

const ICONS: { [key in WebsiteTypeId]: React.ReactNode } = {
  'business': <Building2 className="w-8 h-8 text-blue-500" />,
  'ecommerce': <ShoppingCart className="w-8 h-8 text-blue-500" />,
  'portfolio': <Briefcase className="w-8 h-8 text-blue-500" />,
  'blog': <FileText className="w-8 h-8 text-blue-500" />,
  'landing': <Zap className="w-8 h-8 text-blue-500" />,
  'custom': <Sparkles className="w-8 h-8 text-blue-500" />,
  'nonprofit': <Heart className="w-8 h-8 text-blue-500" />,
  'elearning': <BookOpen className="w-8 h-8 text-blue-500" />,
  'booking': <CalendarDays className="w-8 h-8 text-blue-500" />,
  'realestate': <Home className="w-8 h-8 text-blue-500" />,
  'membership': <Users className="w-8 h-8 text-blue-500" />,
  'event': <Ticket className="w-8 h-8 text-blue-500" />,
  'podcast': <Mic className="w-8 h-8 text-blue-500" />,
  'saas': <AppWindow className="w-8 h-8 text-blue-500" />,
};

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {text}
      </div>
    </div>
  );
};

interface WebsiteTypeCardProps {
  id: WebsiteTypeId;
  name: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: WebsiteTypeId) => void;
}

const WebsiteTypeCard: React.FC<WebsiteTypeCardProps> = ({ id, name, description, isSelected, onSelect }) => {
  const selectedClasses = isSelected ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-500 hover:shadow-sm';
  return (
    <div
      onClick={() => onSelect(id)}
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${selectedClasses}`}
    >
      <div className="flex justify-between items-start">
        {ICONS[id]}
        <Tooltip text={description}>
          <Info className="w-4 h-4 text-gray-400" />
        </Tooltip>
      </div>
      <h3 className="font-bold mt-3 text-gray-800">{name}</h3>
    </div>
  );
};

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min, max }) => {
  const increment = () => onChange(Math.min(max, value + 1));
  const decrement = () => onChange(Math.max(min, value - 1));

  return (
    <div className="flex items-center">
      <button onClick={decrement} className="px-3 py-2 rounded-l-md border border-r-0 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition">
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="text"
        readOnly
        value={value}
        className="w-16 h-10 text-center border-t border-b border-gray-200 focus:outline-none font-semibold"
      />
      <button onClick={increment} className="px-3 py-2 rounded-r-md border border-l-0 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

const ColorSwatch: React.FC<{ palette: ColorPalette, selected: boolean, onClick: () => void, colors: string[] }> = ({ palette, selected, onClick, colors }) => {
    const name = palette.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return (
        <div 
            onClick={onClick} 
            className={`cursor-pointer rounded-lg p-0.5 transition-colors ${selected ? 'bg-blue-200' : 'bg-transparent'}`}
        >
            <div className="bg-white rounded-md p-2 text-center">
                <div className="flex justify-center space-x-1 mb-1">
                    {colors.map(color => <div key={color} className="w-5 h-5 rounded-full" style={{backgroundColor: color}}></div>)}
                </div>
                <span className="text-xs font-medium">{name}</span>
            </div>
        </div>
    )
}

const getInitialFormData = (): FormData => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    websiteType: 'business',
    pages: 5,
    features: [],
    designStyle: 'modern',
    timeline: 'standard',
    budget: 1000,
    additionalInfo: '',
    businessName: searchParams.get('bn') || '',
    cms: 'wordpress',
    colorPalette: 'vibrant',
    maintenancePlan: false,
    monthlyHosting: false,
  }
};

const SummaryLineItem: React.FC<{icon: React.ReactNode; label: string; children: React.ReactNode}> = ({ icon, label, children }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-600">
            {icon}
            <span className="ml-3 font-medium">{label}</span>
        </div>
        <div className="font-semibold text-gray-900 text-right">{children}</div>
    </div>
);


const OrderPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(getInitialFormData());
    
    const [isAccountFlyoutOpen, setIsAccountFlyoutOpen] = useState(false);

    const [checkoutView, setCheckoutView] = useState<'register' | 'login'>('register');
    const [checkoutData, setCheckoutData] = useState({
        fullName: '',
        email: '',
        telephone: '',
        password: '',
    });

    const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCheckoutData(prev => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleWebsiteTypeSelect = (id: WebsiteTypeId) => {
        setFormData(prev => ({ ...prev, websiteType: id }));
    };
    
    const handleResetForm = () => {
        setFormData(getInitialFormData());
    };

    const handleFeatureChange = (feature: Feature) => {
        setFormData(prev => {
            const newFeatures = prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature];
            return { ...prev, features: newFeatures };
        });
    };
    
    const updateFormData = <K extends keyof FormData,>(key: K, value: FormData[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }
    
    const handleTimelineChange = (timeline: Timeline) => {
        setFormData(prev => ({
            ...prev,
            timeline: prev.timeline === timeline ? 'standard' : timeline
        }));
    };

    const priceComponents = useMemo(() => {
        const basePrice = WEBSITE_TYPES.find(wt => wt.id === formData.websiteType)?.basePrice || 0;
        const additionalPagesCost = formData.pages > 5 ? (formData.pages - 5) * 100 : 0;
        const featuresCost = formData.features.reduce((acc, feature) => acc + (FEATURE_PRICES[feature] || 0), 0);
        const timelineAdjustment = TIMELINE_ADJUSTMENTS[formData.timeline] || 0;
        const cmsCost = CMS_PRICES[formData.cms] || 0;
        const maintenanceCost = formData.maintenancePlan ? MAINTENANCE_PLAN_PRICE : 0;
        const hostingCost = formData.monthlyHosting ? MONTHLY_HOSTING_PRICE : 0;

        const total = basePrice + additionalPagesCost + featuresCost + timelineAdjustment + cmsCost + maintenanceCost + hostingCost;

        return { basePrice, additionalPagesCost, featuresCost, timelineAdjustment, cmsCost, maintenanceCost, hostingCost, total };
    }, [formData]);

    const { total: totalPrice } = priceComponents;

    const handleCompleteOrder = (e: React.FormEvent) => {
      e.preventDefault();
      const customerDetails = checkoutView === 'register' 
        ? { view: 'register', ...checkoutData }
        : { view: 'login', email: checkoutData.email, password: checkoutData.password };
      
      const finalOrder = {
        orderDetails: formData,
        customerDetails: customerDetails,
        priceSummary: priceComponents,
      };
      console.log('Final Order Submitted:', JSON.stringify(finalOrder, null, 2));
      alert('Order submitted! Check the browser console for the complete order details.');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800" style={{ backgroundColor: '#f7f7f7' }}>
             <header className="bg-white border-b border-gray-200 sticky top-0 z-10 flex-shrink-0">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">LaunchFast</h1>
                        <div className="flex items-center space-x-1 sm:space-x-4">
                            <button onClick={() => setIsAccountFlyoutOpen(true)} className="hidden sm:flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                                <User className="w-5 h-5" />
                                <span>My Account</span>
                            </button>
                            <button onClick={handleResetForm} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-grow max-w-full mx-auto p-4 md:p-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 lg:h-full">
                    
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Choose Website Type</h2>
                        <div className="flex-grow -mx-6 px-6 lg:mx-0 lg:px-0">
                          <div className="grid grid-cols-2 gap-4">
                              {WEBSITE_TYPES.map(wt => (
                                  <WebsiteTypeCard 
                                      key={wt.id}
                                      id={wt.id}
                                      name={wt.name}
                                      description={wt.description}
                                      isSelected={formData.websiteType === wt.id}
                                      onSelect={handleWebsiteTypeSelect}
                                  />
                              ))}
                          </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                        <h2 className="text-xl font-bold">Customize Your Website</h2>
                        <div className="flex-grow lg:overflow-y-auto space-y-6 mt-6 lg:pr-2">
                          <div>
                              <label className="font-semibold text-sm mb-2 block">Number of Pages</label>
                              <NumberInput value={formData.pages} onChange={val => updateFormData('pages', val)} min={1} max={50} />
                          </div>
                          <div>
                              <label className="font-semibold text-sm mb-2 block">Features</label>
                              <div className="flex flex-wrap gap-2">
                                  {Object.keys(FEATURE_PRICES).map(f => (
                                      <label key={f}>
                                          <input type="checkbox" className="sr-only peer" checked={formData.features.includes(f as Feature)} onChange={() => handleFeatureChange(f as Feature)} />
                                          <span className="inline-block px-4 py-2 border rounded-full cursor-pointer transition-all text-sm font-medium bg-white border-gray-300 text-gray-700 hover:border-blue-500 peer-checked:bg-blue-100 peer-checked:border-blue-500 peer-checked:text-blue-800">
                                            {f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                          </span>
                                      </label>
                                  ))}
                              </div>
                          </div>
                           <div>
                                <label className="font-semibold text-sm mb-2 block">CMS Platform</label>
                                <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
                                    {(['wordpress', 'webflow', 'headless'] as CmsOption[]).map(cms => (
                                        <label key={cms} className="flex-1">
                                            <input type="radio" name="cms" value={cms} checked={formData.cms === cms} onChange={e => updateFormData('cms', e.target.value as CmsOption)} className="sr-only peer" />
                                            <span className="block w-full text-center px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-semibold text-gray-600 peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm">
                                                {cms.charAt(0).toUpperCase() + cms.slice(1)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                          <div>
                              <label className="font-semibold text-sm mb-2 block">Design Style</label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {(['modern', 'classic', 'minimal', 'bold'] as DesignStyle[]).map(style => (
                                      <label key={style}>
                                          <input type="radio" name="designStyle" value={style} checked={formData.designStyle === style} onChange={e => updateFormData('designStyle', e.target.value as DesignStyle)} className="sr-only peer" />
                                          <span className="block w-full text-center px-4 py-3 border rounded-lg cursor-pointer transition-all text-sm font-semibold bg-white border-gray-300 text-gray-700 hover:border-blue-500 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200">
                                              {style.charAt(0).toUpperCase() + style.slice(1)}
                                          </span>
                                      </label>
                                  ))}
                              </div>
                          </div>
                            <div>
                                <label className="font-semibold text-sm mb-2 block">Color Palette</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <ColorSwatch palette="vibrant" selected={formData.colorPalette === 'vibrant'} onClick={() => updateFormData('colorPalette', 'vibrant')} colors={['#3b82f6', '#ef4444', '#f59e0b', '#10b981']} />
                                    <ColorSwatch palette="corporate" selected={formData.colorPalette === 'corporate'} onClick={() => updateFormData('colorPalette', 'corporate')} colors={['#0369a1', '#4b5563', '#9ca3af', '#e5e7eb']} />
                                    <ColorSwatch palette="earthy" selected={formData.colorPalette === 'earthy'} onClick={() => updateFormData('colorPalette', 'earthy')} colors={['#166534', '#a16207', '#facc15', '#f7fee7']} />
                                </div>
                            </div>
                           <div>
                                <label className="font-semibold text-sm mb-2 block">Maintenance Plan</label>
                                <label className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer">
                                    <span className="font-medium text-gray-700">Add Monthly Maintenance?</span>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" checked={formData.maintenancePlan} onChange={e => updateFormData('maintenancePlan', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                </label>
                            </div>
                           <div>
                                <label className="font-semibold text-sm mb-2 block">Hosting Plan</label>
                                <label className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer">
                                    <span className="font-medium text-gray-700">Add Monthly Hosting?</span>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" checked={formData.monthlyHosting} onChange={e => updateFormData('monthlyHosting', e.target.checked)} />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                </label>
                            </div>
                          <div>
                                <label id="timeline-label" className="font-semibold text-sm mb-2 block">Project Timeline</label>
                                <div role="radiogroup" aria-labelledby="timeline-label" className="space-y-2">
                                    {(['rush', 'flexible'] as const).map(timeline => {
                                        const isSelected = formData.timeline === timeline;
                                        return (
                                            <div 
                                                key={timeline}
                                                role="radio"
                                                aria-checked={isSelected}
                                                tabIndex={0}
                                                onClick={() => handleTimelineChange(timeline as Timeline)}
                                                onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleTimelineChange(timeline as Timeline)}
                                                className={`flex items-center w-full px-4 py-3 border rounded-lg cursor-pointer transition-all text-sm font-semibold ${isSelected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'}`}
                                            >
                                                <div className={`w-5 h-5 mr-3 flex-shrink-0 border-2 rounded-md flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className="flex-grow">{timeline.charAt(0).toUpperCase() + timeline.slice(1)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                          <div>
                              <label htmlFor="additionalInfo" className="font-semibold text-sm mb-2 block">Additional Information</label>
                              <textarea
                                  id="additionalInfo"
                                  rows={3}
                                  className="w-full border border-gray-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition bg-gray-50 focus:bg-white"
                                  placeholder="Tell us more about your project requirements..."
                                  value={formData.additionalInfo}
                                  onChange={e => updateFormData('additionalInfo', e.target.value)}
                              />
                          </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
                            <SummaryLineItem icon={<DollarSign className="w-5 h-5 text-green-500" />} label="Base Price">
                                <span>${priceComponents.basePrice}</span>
                            </SummaryLineItem>

                            {priceComponents.additionalPagesCost > 0 && (
                                <SummaryLineItem icon={<FileStack className="w-5 h-5 text-indigo-500" />} label="Add'l Pages">
                                    <span>+ ${priceComponents.additionalPagesCost}</span>
                                </SummaryLineItem>
                            )}
                            
                            {priceComponents.featuresCost > 0 && (
                                <SummaryLineItem icon={<CheckSquare className="w-5 h-5 text-sky-500" />} label="Features">
                                    <span>+ ${priceComponents.featuresCost}</span>
                                </SummaryLineItem>
                            )}

                             <SummaryLineItem icon={<Database className="w-5 h-5 text-amber-500" />} label="CMS Platform">
                                <div>
                                    <span className="capitalize">{formData.cms}</span>
                                    {priceComponents.cmsCost > 0 && <span className="ml-2 text-sm text-gray-500 font-medium">(+ ${priceComponents.cmsCost})</span>}
                                </div>
                            </SummaryLineItem>

                            <SummaryLineItem icon={<Paintbrush className="w-5 h-5 text-rose-500" />} label="Design Style">
                                <span className="capitalize">{formData.designStyle}</span>
                            </SummaryLineItem>

                             <SummaryLineItem icon={<Palette className="w-5 h-5 text-teal-500" />} label="Color Palette">
                                <span className="capitalize">{formData.colorPalette}</span>
                            </SummaryLineItem>

                            {formData.maintenancePlan && (
                                 <SummaryLineItem icon={<Wrench className="w-5 h-5 text-slate-500" />} label="Maintenance Plan">
                                    <span>+ ${priceComponents.maintenanceCost}</span>
                                </SummaryLineItem>
                            )}
                            
                            {formData.monthlyHosting && (
                                 <SummaryLineItem icon={<Server className="w-5 h-5 text-purple-500" />} label="Monthly Hosting">
                                    <span>+ ${priceComponents.hostingCost}</span>
                                </SummaryLineItem>
                            )}

                             <SummaryLineItem icon={<Clock className="w-5 h-5 text-cyan-500" />} label="Timeline">
                                <div>
                                    <span className={`capitalize ${priceComponents.timelineAdjustment < 0 ? 'text-green-600' : ''}`}>
                                        {formData.timeline}
                                    </span>
                                    {priceComponents.timelineAdjustment !== 0 && (
                                        <span className={`ml-2 text-sm font-medium ${priceComponents.timelineAdjustment < 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                            ({priceComponents.timelineAdjustment > 0 ? `+ $${priceComponents.timelineAdjustment}` : `- $${-priceComponents.timelineAdjustment}`})
                                        </span>
                                    )}
                                </div>
                            </SummaryLineItem>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold tracking-tight">Total</span>
                                    <span className="text-3xl font-extrabold">${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                        <h2 className="text-xl font-bold mb-4 flex items-center"><Lock className="w-5 h-5 mr-2 text-gray-400"/>Secure Checkout</h2>
                        <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50 mb-4">
                            <button type="button" onClick={() => setCheckoutView('register')} className={`flex-1 text-center px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-semibold ${checkoutView === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
                                Create Account
                            </button>
                            <button type="button" onClick={() => setCheckoutView('login')} className={`flex-1 text-center px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-semibold ${checkoutView === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
                                Login
                            </button>
                        </div>
                        <form onSubmit={handleCompleteOrder} className="flex-grow flex flex-col justify-between">
                          <div className="space-y-4">
                            {checkoutView === 'register' ? (
                                <>
                                    <div>
                                        <label htmlFor="fullName" className="font-semibold text-sm mb-1 block text-gray-700">Full Name</label>
                                        <input type="text" id="fullName" name="fullName" required className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition bg-white" placeholder="Jane Doe" value={checkoutData.fullName} onChange={handleCheckoutChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="font-semibold text-sm mb-1 block text-gray-700">Email Address</label>
                                        <input type="email" id="email" name="email" required className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition bg-white" placeholder="you@example.com" value={checkoutData.email} onChange={handleCheckoutChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="telephone" className="font-semibold text-sm mb-1 block text-gray-700">Telephone Number</label>
                                        <input type="tel" id="telephone" name="telephone" className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition bg-white" placeholder="(555) 123-4567" value={checkoutData.telephone} onChange={handleCheckoutChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="font-semibold text-sm mb-1 block text-gray-700">Password</label>
                                        <input type="password" id="password" name="password" required className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition bg-white" placeholder="••••••••" value={checkoutData.password} onChange={handleCheckoutChange} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label htmlFor="email" className="font-semibold text-sm mb-1 block text-gray-700">Email Address</label>
                                        <input type="email" id="email" name="email" required className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition bg-white" placeholder="you@example.com" value={checkoutData.email} onChange={handleCheckoutChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="font-semibold text-sm mb-1 block text-gray-700">Password</label>
                                        <input type="password" id="password" name="password" required className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition bg-white" placeholder="••••••••" value={checkoutData.password} onChange={handleCheckoutChange} />
                                    </div>
                                </>
                            )}
                          </div>
                          <div className="mt-6">
                            <button 
                                type="submit"
                                disabled={totalPrice === 0}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                                Complete Order
                            </button>
                          </div>
                        </form>
                    </div>
                </div>
            </main>
            
            {/* Account Flyout */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isAccountFlyoutOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsAccountFlyoutOpen(false)}
            ></div>
            <div 
                className={`fixed inset-y-0 right-0 w-full md:w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isAccountFlyoutOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <button 
                    onClick={() => setIsAccountFlyoutOpen(false)} 
                    className="absolute top-3 right-3 z-10 p-2 text-gray-500 bg-white/70 hover:bg-white rounded-full transition-colors"
                    aria-label="Close My Account"
                >
                    <X className="w-6 h-6" />
                </button>
                <iframe 
                    src="https://mypancho.com/account/clientarea.php"
                    className="w-full h-full border-0"
                    title="My Account"
                ></iframe>
            </div>
        </div>
    );
};

export default OrderPage;
