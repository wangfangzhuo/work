import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ShoppingCart, 
  Settings, 
  ShieldCheck, 
  TrendingUp,
  History,
  CircleDollarSign,
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Filter,
  ArrowUpDown,
  Zap,
  Package,
  Store,
  CreditCard,
  Truck,
  X,
  Globe,
  Lock,
  FileText,
  Paperclip,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Platform {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  color: string;
  type: 'online' | 'offline';
  hasCredentials?: boolean;
  hasQuote?: boolean;
  url?: string;
  isPreset?: boolean;
}

interface Quote {
  platformId: string;
  price: number;
  stock: number;
  expiry: string;
  promotion: string;
  serviceRating: number;
  deliveryTime: string;
}

interface Product {
  id: string;
  name: string;
  spec: string;
  manufacturer: string;
  quotes: Quote[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'product_comparison' | 'action_summary' | 'scraping_status' | 'spec_confirmation' | 'supplier_management' | 'supplier_form';
  data?: any;
}

// --- Mock Data ---
const INITIAL_PLATFORMS: Platform[] = [
  { id: '1yc', name: '1药城', logo: '1', connected: false, color: 'bg-blue-600', type: 'online', hasCredentials: false, isPreset: true, url: 'https://www.1yao.com' },
  { id: 'ysb', name: '药师帮', logo: '帮', connected: false, color: 'bg-orange-500', type: 'online', hasCredentials: false, isPreset: true, url: 'https://www.ysbang.cn' },
  { id: 'xyy', name: '小药药', logo: '小', connected: false, color: 'bg-green-500', type: 'online', hasCredentials: false, isPreset: true, url: 'https://www.xiaoyaoyao.com' },
  { id: 'yjj', name: '药九九', logo: '九', connected: false, color: 'bg-red-500', type: 'online', hasCredentials: false, isPreset: true, url: 'https://www.yaojiu9.com' },
  { id: 'offline_1', name: '九州通', logo: '九', connected: false, color: 'bg-purple-500', type: 'offline', hasQuote: false, isPreset: true },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '阿莫西林胶囊',
    spec: '0.25g*24粒',
    manufacturer: '联邦制药',
    quotes: [
      { platformId: '1yc', price: 12.5, stock: 500, expiry: '2026-05', promotion: '满100减10', serviceRating: 4.8, deliveryTime: '次日达' },
      { platformId: 'ysb', price: 11.8, stock: 200, expiry: '2025-12', promotion: '无', serviceRating: 4.5, deliveryTime: '2-3天' },
      { platformId: 'xyy', price: 13.2, stock: 1000, expiry: '2026-08', promotion: '买10送1', serviceRating: 4.2, deliveryTime: '次日达' },
      { platformId: 'offline_1', price: 12.0, stock: 100, expiry: '2026-01', promotion: '无', serviceRating: 5.0, deliveryTime: '当日达' },
    ]
  }
];

// --- Components ---

const PlatformIcon = ({ platform, size = 'md' }: { platform: Platform, size?: 'sm' | 'md' }) => (
  <div className={cn(
    "flex items-center justify-center rounded-lg font-bold text-white shrink-0",
    platform.color,
    size === 'sm' ? "w-6 h-6 text-[10px]" : "w-10 h-10 text-lg"
  )}>
    {platform.logo}
  </div>
);

const ScrapingStatus = ({ platforms, activePlatforms }: { platforms: Platform[], activePlatforms: Platform[] }) => {
  const [progress, setProgress] = useState<Record<string, 'pending' | 'loading' | 'done'>>({});

  useEffect(() => {
    const simulateScraping = async () => {
      const initialProgress = activePlatforms.reduce((acc, p) => ({ ...acc, [p.id]: 'pending' }), {});
      setProgress(initialProgress);

      for (const platform of activePlatforms) {
        setProgress(prev => ({ ...prev, [platform.id]: 'loading' }));
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
        setProgress(prev => ({ ...prev, [platform.id]: 'done' }));
      }
    };
    simulateScraping();
  }, [activePlatforms]);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm my-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Search size={16} className="text-emerald-500 animate-pulse" />
          正在实时采集报价...
        </h3>
        <span className="text-[10px] text-zinc-400 font-mono">
          {Object.values(progress).filter(s => s === 'done').length} / {activePlatforms.length} 已完成
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activePlatforms.map(platform => (
          <div key={platform.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="flex items-center gap-2">
              <PlatformIcon platform={platform} size="sm" />
              <span className="text-xs font-medium">{platform.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {progress[platform.id] === 'loading' && (
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 h-1 bg-emerald-500 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 h-1 bg-emerald-500 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 h-1 bg-emerald-500 rounded-full" />
                </div>
              )}
              {progress[platform.id] === 'done' && (
                <CheckCircle2 size={14} className="text-emerald-500" />
              )}
              {progress[platform.id] === 'pending' && (
                <div className="w-3 h-3 rounded-full border border-zinc-200" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SpecInfo {
  name: string;
  priceRange: [number, number];
  highlight?: {
    text: string;
    type: 'history' | 'popular' | 'value';
  };
}

const SpecConfirmation = ({ 
  productName, 
  guessedSpec, 
  specs,
  onConfirm, 
  onChange 
}: { 
  productName: string, 
  guessedSpec: string, 
  specs: SpecInfo[],
  onConfirm: () => void, 
  onChange: (spec: string) => void 
}) => {
  const [isChanging, setIsChanging] = useState(false);
  
  const currentSpecInfo = specs.find(s => s.name === guessedSpec) || specs[0];

  const HighlightBadge = ({ highlight }: { highlight: SpecInfo['highlight'] }) => {
    if (!highlight) return null;
    
    const icons = {
      history: <History size={10} />,
      popular: <TrendingUp size={10} />,
      value: <CircleDollarSign size={10} />
    };

    const colors = {
      history: "bg-blue-50 text-blue-600 border-blue-100",
      popular: "bg-orange-50 text-orange-600 border-orange-100",
      value: "bg-emerald-50 text-emerald-600 border-emerald-100"
    };

    return (
      <div className={cn(
        "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border",
        colors[highlight.type]
      )}>
        {icons[highlight.type]}
        {highlight.text}
      </div>
    );
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm my-4 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
          <Package size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-zinc-900">规格确认</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            基于您的历史采购习惯和当前市场主流报价，为您匹配了 <span className="text-emerald-600 font-bold underline decoration-emerald-200 underline-offset-4">{productName}</span> 的规格：
          </p>
        </div>
      </div>

      {!isChanging ? (
        <div className="flex flex-col gap-3">
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-emerald-700">{guessedSpec}</span>
                <HighlightBadge highlight={currentSpecInfo.highlight} />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                <span>全网价格带:</span>
                <span className="text-zinc-600 font-bold">¥{currentSpecInfo.priceRange[0]} - ¥{currentSpecInfo.priceRange[1]}</span>
              </div>
            </div>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
            >
              确认规格并比价
            </button>
            <button 
              onClick={() => setIsChanging(true)}
              className="px-4 py-3 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-all"
            >
              更换规格
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {specs.map(spec => (
              <button 
                key={spec.name}
                onClick={() => onChange(spec.name)}
                className={cn(
                  "p-3 rounded-xl border transition-all text-left flex items-center justify-between group",
                  spec.name === guessedSpec ? "bg-emerald-50 border-emerald-500" : "bg-zinc-50 border-zinc-200 hover:border-zinc-400"
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-bold", spec.name === guessedSpec ? "text-emerald-700" : "text-zinc-700")}>
                      {spec.name}
                    </span>
                    <HighlightBadge highlight={spec.highlight} />
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    价格带: ¥{spec.priceRange[0]} - ¥{spec.priceRange[1]}
                  </div>
                </div>
                <ChevronRight size={14} className={cn("transition-transform group-hover:translate-x-1", spec.name === guessedSpec ? "text-emerald-500" : "text-zinc-300")} />
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsChanging(false)}
            className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-600"
          >
            返回确认
          </button>
        </div>
      )}
    </div>
  );
};

const ComparisonCard = ({ product, platforms, onAddToCart }: { product: Product, platforms: Platform[], onAddToCart: (quote: Quote) => void }) => {
  const sortedQuotes = [...product.quotes].sort((a, b) => a.price - b.price);
  
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm my-4">
      <div className="p-4 bg-zinc-50 border-bottom border-zinc-200 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">{product.name}</h3>
          <p className="text-sm text-zinc-500">{product.spec} | {product.manufacturer}</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Zap size={12} />
          全网最低: ¥{sortedQuotes[0].price}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
              <th className="px-4 py-3">平台</th>
              <th className="px-4 py-3">单价</th>
              <th className="px-4 py-3">活动/效期</th>
              <th className="px-4 py-3">服务/物流</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {product.quotes.map((quote) => {
              const platform = platforms.find(p => p.id === quote.platformId);
              if (!platform) return null;
              return (
                <tr key={quote.platformId} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={platform} size="sm" />
                      <span className="text-sm font-medium text-zinc-700">{platform.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-zinc-900">¥{quote.price}</span>
                      <span className="text-[10px] text-zinc-400">库存: {quote.stock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {quote.promotion !== '无' && (
                        <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100 w-fit">
                          {quote.promotion}
                        </span>
                      )}
                      <span className="text-xs text-zinc-500">效期: {quote.expiry}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-zinc-600">评分: {quote.serviceRating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Truck size={12} />
                        <span className="text-[10px]">{quote.deliveryTime}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => onAddToCart(quote)}
                      className="bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <ShoppingCart size={14} />
                      采购
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
        <p className="text-xs text-zinc-500 italic">
          * 建议选择 <span className="text-emerald-600 font-bold">{sortedQuotes[0].platformId === '1yc' ? '1药城' : platforms.find(p => p.id === sortedQuotes[0].platformId)?.name}</span>，价格优势明显且效期更优。
        </p>
        <button 
          onClick={() => onAddToCart(sortedQuotes[0])}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
        >
          <Zap size={14} />
          一键采纳最优方案
        </button>
      </div>
    </div>
  );
};

const AddSupplierModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (p: Platform) => void }) => {
  const [type, setType] = useState<'online' | 'offline'>('online');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlatform: Platform = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      logo: name.charAt(0),
      connected: false,
      color: type === 'online' ? 'bg-blue-500' : 'bg-purple-500',
      type,
      url: type === 'online' ? url : undefined,
      hasCredentials: type === 'online' && account !== '' && password !== '',
      hasQuote: false
    };
    onAdd(newPlatform);
    onClose();
    // Reset
    setName(''); setUrl(''); setAccount(''); setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h2 className="text-xl font-bold">添加供应商</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex p-1 bg-zinc-100 rounded-xl">
            <button 
              type="button"
              onClick={() => setType('online')}
              className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", type === 'online' ? "bg-white shadow-sm" : "text-zinc-500")}
            >
              线上平台
            </button>
            <button 
              type="button"
              onClick={() => setType('offline')}
              className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", type === 'offline' ? "bg-white shadow-sm" : "text-zinc-500")}
            >
              线下商业
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">供应商名称</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：药师帮、九州通..."
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
            />
          </div>

          {type === 'online' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">访问地址 (可选)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 pl-10 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">账号</label>
                  <input 
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">密码</label>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'offline' && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3">
              <FileText className="text-emerald-500 shrink-0" size={20} />
              <p className="text-xs text-emerald-700 leading-relaxed">
                线下商业供应商添加后，您可以通过“导入报价单”功能上传 Excel/PDF 格式的报价文件。
              </p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 mt-4"
          >
            确认添加
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const SupplierConfigModal = ({ 
  isOpen, 
  onClose, 
  platform, 
  onUpdate 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  platform: Platform | null, 
  onUpdate: (id: string, updates: Partial<Platform>) => void 
}) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (platform) {
      setAccount('');
      setPassword('');
      setUrl(platform.url || '');
    }
  }, [platform]);

  if (!isOpen || !platform) return null;

  const handleSave = () => {
    onUpdate(platform.id, {
      hasCredentials: platform.type === 'online' ? (account !== '' || platform.hasCredentials) : false,
      url: url || platform.url,
    });
    onClose();
  };

  const handleDeleteQuote = () => {
    onUpdate(platform.id, { hasQuote: false });
  };

  const handleImportQuote = () => {
    // Simulate file picker
    onUpdate(platform.id, { hasQuote: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={platform} size="sm" />
            <h2 className="text-xl font-bold">{platform.name} 配置</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {platform.type === 'online' && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Lock size={16} className="text-zinc-400" />
                账号授权管理
              </h3>
              <div className="space-y-3">
                {!platform.isPreset && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">访问地址</label>
                    <input 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">账号</label>
                    <input 
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder={platform.hasCredentials ? "********" : "输入账号"}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">密码</label>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={platform.hasCredentials ? "********" : "输入密码"}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
              >
                保存授权信息
              </button>
            </section>
          )}

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <FileText size={16} className="text-zinc-400" />
              报价单管理
            </h3>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              {platform.hasQuote ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">最新报价单.xlsx</p>
                        <p className="text-[10px] text-zinc-400">导入时间: 2024-03-10</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleDeleteQuote}
                      className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={handleImportQuote}
                    className="w-full py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-xs font-medium hover:bg-zinc-50 transition-colors"
                  >
                    更新报价单
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-zinc-400">暂无导入的线下报价单</p>
                  <button 
                    onClick={handleImportQuote}
                    className="w-full py-2.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} />
                    立即导入报价单
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

const SupplierManagement = ({ 
  platforms, 
  onToggle, 
  onConfig, 
  onAdd 
}: { 
  platforms: Platform[], 
  onToggle: (e: React.MouseEvent, id: string) => void, 
  onConfig: (p: Platform) => void,
  onAdd: () => void
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm my-4">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Store size={18} className="text-emerald-500" />
            供应商管理中心
          </h3>
          <p className="text-[10px] text-zinc-400">配置您的采购渠道以获取实时全网报价</p>
        </div>
        <button 
          onClick={onAdd}
          className="text-zinc-500 hover:text-zinc-900 p-1.5 hover:bg-zinc-200 rounded-lg transition-all flex items-center gap-1 text-xs font-medium"
        >
          <Plus size={14} />
          添加
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 space-y-2">
          <h4 className="text-[11px] font-bold text-blue-700 flex items-center gap-1.5">
            <Zap size={12} />
            为什么需要配置供应商？
          </h4>
          <ul className="text-[10px] text-blue-600/80 space-y-1 list-disc list-inside">
            <li><span className="font-bold">实时比价：</span>系统会自动登录您的账号获取最新的会员价和促销信息。</li>
            <li><span className="font-bold">一键下单：</span>比价完成后可直接将商品加入对应平台的购物车。</li>
            <li><span className="font-bold">全渠道覆盖：</span>整合线上平台与线下报价单，确保拿货价全网最低。</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {platforms.map(platform => {
            const isConfigured = platform.hasCredentials || platform.hasQuote;
            return (
              <div 
                key={platform.id}
                onClick={() => onConfig(platform)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group hover:border-zinc-300",
                  platform.connected 
                    ? "bg-white border-zinc-200 shadow-sm" 
                    : "bg-zinc-50 border-transparent opacity-60"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <PlatformIcon platform={platform} size="sm" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">{platform.name}</span>
                    {!isConfigured && (
                      <span className="text-[10px] text-orange-500 font-medium">未配置</span>
                    )}
                    {isConfigured && !platform.connected && (
                      <span className="text-[10px] text-zinc-400 font-medium">已就绪</span>
                    )}
                    {platform.connected && (
                      <span className="text-[10px] text-emerald-500 font-medium">比价中</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={(e) => onToggle(e, platform.id)}
                  className={cn(
                    "w-10 h-6 rounded-full relative transition-all duration-200 shrink-0",
                    platform.connected ? "bg-emerald-500" : "bg-zinc-200"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200",
                    platform.connected ? "left-5" : "left-1"
                  )} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 text-white flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-xs font-bold">安全授权保护</span>
            </div>
            <p className="text-[10px] text-zinc-400">银行级加密保护您的账号信息</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-medium transition-colors">
              管理授权
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SupplierForm = ({ 
  type: initialType = 'online', 
  platform, 
  onCancel, 
  onSubmit 
}: { 
  type?: 'online' | 'offline', 
  platform?: Platform | null,
  onCancel: () => void, 
  onSubmit: (data: any) => void 
}) => {
  const [type, setType] = useState<'online' | 'offline'>(platform?.type || initialType);
  const [name, setName] = useState(platform?.name || '');
  const [url, setUrl] = useState(platform?.url || '');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile(file.name);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: platform?.id || Math.random().toString(36).substr(2, 9),
      name,
      logo: name.charAt(0),
      connected: true, // Auto-enable on config
      color: type === 'online' ? (platform?.color || 'bg-blue-600') : (platform?.color || 'bg-purple-500'),
      type,
      url: type === 'online' ? url : undefined,
      hasCredentials: type === 'online' && (account !== '' || platform?.hasCredentials),
      hasQuote: type === 'offline' && (uploadedFile !== null || platform?.hasQuote),
      isPreset: platform?.isPreset || false
    });
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm my-4">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          {platform ? <Settings size={16} /> : <Plus size={16} />}
          {platform ? `配置 ${platform.name}` : '添加新供应商'}
        </h3>
        <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600 p-1">
          <X size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {!platform && (
          <div className="flex p-1 bg-zinc-100 rounded-xl">
            <button 
              type="button"
              onClick={() => setType('online')}
              className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-all", type === 'online' ? "bg-white shadow-sm" : "text-zinc-500")}
            >
              线上平台
            </button>
            <button 
              type="button"
              onClick={() => setType('offline')}
              className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-all", type === 'offline' ? "bg-white shadow-sm" : "text-zinc-500")}
            >
              线下商业
            </button>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">供应商名称</label>
          <input 
            required
            disabled={platform?.isPreset}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：药师帮、九州通..."
            className={cn(
              "w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900",
              platform?.isPreset && "opacity-60 cursor-not-allowed"
            )}
          />
        </div>

        {type === 'online' && (
          <>
            {!platform?.isPreset && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">访问地址</label>
                <input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">账号</label>
                <input 
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder={platform?.hasCredentials ? "********" : "输入账号"}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">密码</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={platform?.hasCredentials ? "********" : "输入密码"}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>
          </>
        )}

        {type === 'offline' && (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl space-y-2">
              <div className="flex gap-2">
                <FileText className="text-emerald-500 shrink-0" size={16} />
                <h4 className="text-[11px] font-bold text-emerald-700">导入报价单的好处</h4>
              </div>
              <p className="text-[10px] text-emerald-700 leading-relaxed">
                通过上传 Excel 或 PDF 报价单，AI 会自动解析成千上万条药品价格，并将其与线上平台进行实时对标。这能帮您发现那些线下更便宜的“隐藏低价”。
              </p>
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                uploadedFile ? "border-emerald-200 bg-emerald-50/30" : "border-zinc-200 hover:border-zinc-400 bg-zinc-50"
              )}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".xlsx,.xls,.pdf"
              />
              
              {isUploading ? (
                <div className="w-full max-w-[200px] space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                    <span>正在解析报价单...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : uploadedFile ? (
                <>
                  <CheckCircle2 className="text-emerald-500" size={32} />
                  <div className="text-center">
                    <p className="text-xs font-bold text-zinc-900">{uploadedFile}</p>
                    <p className="text-[10px] text-zinc-400">报价单已成功解析，包含 124 条药品报价</p>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="text-[10px] text-red-500 font-bold hover:underline"
                  >
                    重新上传
                  </button>
                </>
              ) : (
                <>
                  <Plus className="text-zinc-300" size={32} />
                  <div className="text-center">
                    <p className="text-xs font-bold text-zinc-600">点击或拖拽上传报价单</p>
                    <p className="text-[10px] text-zinc-400">支持 Excel (.xlsx, .xls) 或 PDF 格式</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button 
            type="submit"
            disabled={isUploading}
            className={cn(
              "flex-1 py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-zinc-200",
              isUploading ? "bg-zinc-400 cursor-not-allowed" : "bg-zinc-900 hover:bg-zinc-800"
            )}
          >
            {platform ? '保存配置' : '确认添加'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-xs font-medium hover:bg-zinc-50 transition-all"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default function App() {
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [cartCount, setCartCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: '您好！我是您的 AI 采购决策助手。在药品采购过程中，价格波动大、渠道分散、比价耗时一直是困扰药店和诊所的难题。' 
    },
    {
      id: '1.1',
      role: 'assistant',
      content: '通过我，您可以实现：\n\n1. ⚡️ 实时全网比价：一键获取 1药城、药师帮等主流平台的最新报价。\n2. 📊 智能决策支持：自动识别历史采购习惯，推荐最优规格和组合。\n3. 📁 线下线上整合：支持导入线下供应商报价单，实现全渠道价格透明。\n\n这能帮您平均降低 15% 的采购成本，并节省 80% 的询价时间。'
    },
    {
      id: '2',
      role: 'assistant',
      content: '为了开始比价，请先在下方管理面板配置您的供应商账号（我们已预设主流平台，您只需输入账号密码）或导入报价单。配置完成后，系统将自动为您开启比价。',
      type: 'supplier_management'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAddToCart = (quote: Quote) => {
    const platform = platforms.find(p => p.id === quote.platformId);
    setCartCount(prev => prev + 1);
    
    const feedbackMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `已为您将来自 ${platform?.name} 的商品加入购物车。您可以继续询价，或点击右上角购物车进行结算。`
    };
    setMessages(prev => [...prev, feedbackMsg]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Step 1: Show Scraping Animation
    setTimeout(() => {
      const activePlatforms = platforms.filter(p => p.connected);
      
      if (activePlatforms.length === 0) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: '请先在侧边栏配置并开启至少一个供应商（配置账号或导入报价单）后再进行询价。'
        }]);
        setIsTyping(false);
        return;
      }

      const scrapingMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `正在为您从 ${activePlatforms.length} 个渠道获取 "${currentInput}" 的实时报价...`,
        type: 'scraping_status',
        data: activePlatforms
      };
      setMessages(prev => [...prev, scrapingMsg]);
      setIsTyping(false);

      // Step 2: Show Spec Confirmation after scraping simulation
      const scrapingTime = 800 + activePlatforms.length * 1000;
      setTimeout(() => {
        const mockSpecs: SpecInfo[] = [
          { 
            name: '0.25g*24粒', 
            priceRange: [11.8, 15.5], 
            highlight: { text: '历史采购12次', type: 'history' } 
          },
          { 
            name: '0.5g*12粒', 
            priceRange: [18.2, 22.0], 
            highlight: { text: '市场最畅销', type: 'popular' } 
          },
          { 
            name: '0.25g*50粒', 
            priceRange: [22.5, 28.0], 
            highlight: { text: '单粒性价比最高', type: 'value' } 
          },
          { 
            name: '0.125g*12袋', 
            priceRange: [9.5, 12.8] 
          },
        ];

        const specMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `已完成全网采集。根据您的历史采购偏好，为您匹配了最常用的规格。`,
          type: 'spec_confirmation',
          data: { 
            productName: currentInput.includes('阿莫西林') ? '阿莫西林胶囊' : currentInput, 
            guessedSpec: '0.25g*24粒',
            specs: mockSpecs
          }
        };
        setMessages(prev => [...prev, specMsg]);
      }, scrapingTime);

    }, 500);
  };

  const handleConfirmSpec = (productName: string, spec: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const response: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `已锁定规格：${spec}。为您找到以下报价，1药城目前价格最优。`,
        type: 'product_comparison',
        data: { ...MOCK_PRODUCTS[0], name: productName, spec: spec }
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const togglePlatform = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const platform = platforms.find(p => p.id === id);
    if (!platform) return;

    const isConfigured = platform.hasCredentials || platform.hasQuote;
    
    if (!isConfigured) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `${platform.name} 尚未配置。请先完成授权或导入报价单：`,
        type: 'supplier_form',
        data: { platform }
      }]);
      return;
    }

    setPlatforms(prev => prev.map(p => 
      p.id === id ? { ...p, connected: !p.connected } : p
    ));
  };

  const handleSupplierFormSubmit = (data: any) => {
    setPlatforms(prev => {
      const exists = prev.find(p => p.id === data.id);
      if (exists) {
        return prev.map(p => p.id === data.id ? { ...p, ...data } : p);
      }
      return [...prev, data];
    });

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✅ 供应商 ${data.name} 已成功${platforms.find(p => p.id === data.id) ? '更新' : '添加'}。已为您自动开启该供应商的比价功能。`,
      type: 'supplier_management'
    }]);
  };

  const handleGlobalFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | undefined;
    if ('files' in e.target && e.target.files) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      file = e.dataTransfer.files[0];
    }

    if (!file) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: `📎 上传了报价单: ${file.name}`
    }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `检测到您上传了来自 "${file.name.split('.')[0]}" 的报价单。系统正在解析数据... 请问您想将其关联到哪个供应商，或者创建一个新的线下供应商？`,
        type: 'supplier_form',
        data: { type: 'offline' }
      }]);
    }, 600);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleGlobalFileUpload(e);
  };

  return (
    <div 
      className="flex h-screen bg-[#F8F8F6] text-zinc-900 font-sans p-0 sm:p-4 lg:p-8 relative"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-8"
          >
            <div className="w-full max-w-2xl aspect-video border-4 border-dashed border-white/60 rounded-[3rem] flex flex-col items-center justify-center gap-6 bg-white/10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-zinc-900 shadow-2xl">
                <UploadCloud size={48} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">松开上传报价单</h2>
                <p className="text-white/70 font-medium">支持 Excel (.xlsx, .xls) 或 PDF 格式</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleGlobalFileUpload} 
        className="hidden" 
        accept=".xlsx,.xls,.pdf"
      />
      {/* Main Dialog Box Container */}
      <div className="max-w-5xl mx-auto w-full h-full bg-white sm:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-zinc-200 overflow-hidden flex flex-col relative">
        {/* Header */}
        <header className="h-20 border-b border-zinc-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-zinc-200">
              <Zap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI 采购决策助手</h1>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {platforms.filter(p => p.connected).map(p => (
                    <div key={p.id} className={cn("w-4 h-4 rounded-full border border-white flex items-center justify-center text-[6px] font-bold text-white", p.color)}>
                      {p.logo}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {platforms.filter(p => p.connected).length} 供应商就绪
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: '您可以点击下方面板管理您的供应商：',
                  type: 'supplier_management'
                }]);
              }}
              className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all flex items-center gap-2 text-sm font-bold"
            >
              <Settings size={20} />
              <span className="hidden md:inline">配置中心</span>
            </button>
            <div className="h-8 w-[1px] bg-zinc-100 mx-1" />
            <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
              <ShoppingCart size={20} />
              <span className="hidden md:inline">购物车</span>
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{cartCount}</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex w-full",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[95%] sm:max-w-[85%]",
                  msg.role === 'user' ? "flex flex-row-reverse gap-4" : "flex gap-4"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105",
                    msg.role === 'user' ? "bg-zinc-900 text-white" : "bg-white text-zinc-900 border border-zinc-100"
                  )}>
                    {msg.role === 'user' ? <Store size={24} /> : <Zap size={24} />}
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className={cn(
                      "p-5 rounded-[2rem] shadow-sm",
                      msg.role === 'user' 
                        ? "bg-zinc-900 text-white rounded-tr-none" 
                        : "bg-white text-zinc-800 border border-zinc-100 rounded-tl-none"
                    )}>
                      <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                    </div>
                    
                    {msg.type === 'supplier_management' && (
                      <SupplierManagement 
                        platforms={platforms} 
                        onToggle={togglePlatform} 
                        onConfig={(p) => {
                          setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            role: 'assistant',
                            content: `正在为您准备 ${p.name} 的配置表单：`,
                            type: 'supplier_form',
                            data: { platform: p }
                          }]);
                        }}
                        onAdd={() => {
                          setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            role: 'assistant',
                            content: '请填写以下信息以添加新供应商：',
                            type: 'supplier_form'
                          }]);
                        }}
                      />
                    )}

                    {msg.type === 'supplier_form' && (
                      <SupplierForm 
                        platform={msg.data?.platform}
                        onCancel={() => {
                          setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            role: 'assistant',
                            content: '已取消操作。'
                          }]);
                        }}
                        onSubmit={handleSupplierFormSubmit}
                      />
                    )}

                    {msg.type === 'scraping_status' && (
                      <ScrapingStatus platforms={platforms} activePlatforms={msg.data} />
                    )}

                    {msg.type === 'spec_confirmation' && (
                      <SpecConfirmation 
                        productName={msg.data.productName} 
                        guessedSpec={msg.data.guessedSpec} 
                        specs={msg.data.specs}
                        onConfirm={() => handleConfirmSpec(msg.data.productName, msg.data.guessedSpec)}
                        onChange={(spec) => handleConfirmSpec(msg.data.productName, spec)}
                      />
                    )}

                    {msg.type === 'product_comparison' && (
                      <ComparisonCard product={msg.data} platforms={platforms} onAddToCart={handleAddToCart} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm">
                <Zap size={24} className="animate-pulse" />
              </div>
              <div className="bg-white border border-zinc-100 p-5 rounded-[2rem] rounded-tl-none shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-zinc-200 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-zinc-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-zinc-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 sm:p-10 pt-0 shrink-0">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-zinc-900/5 blur-2xl group-focus-within:bg-zinc-900/10 transition-all rounded-[2.5rem]" />
            <div className="relative bg-white border border-zinc-200 rounded-[2.5rem] shadow-2xl p-2.5 flex items-center gap-3">
              <div className="flex items-center">
                <button 
                  onClick={() => {
                    setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      role: 'assistant',
                      content: '您可以点击下方面板管理您的供应商：',
                      type: 'supplier_management'
                    }]);
                  }}
                  className="p-4 text-zinc-400 hover:text-emerald-500 transition-all hover:bg-emerald-50 rounded-full"
                  title="管理供应商"
                >
                  <Plus size={28} />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 text-zinc-400 hover:text-blue-500 transition-all hover:bg-blue-50 rounded-full"
                  title="上传报价单"
                >
                  <Paperclip size={28} />
                </button>
              </div>
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入药品名称或采购需求..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-base py-5 px-2 font-medium placeholder:text-zinc-300"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={cn(
                  "p-4 rounded-[2rem] transition-all",
                  inputValue.trim() ? "bg-zinc-900 text-white shadow-xl scale-105" : "bg-zinc-100 text-zinc-300"
                )}
              >
                <Search size={28} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-400 mt-6 uppercase tracking-[0.2em] font-bold">
            1药城 · 药师帮 · 小药药 · 药九九 · 线下供应商
          </p>
        </div>
      </div>
    </div>
  );
}
