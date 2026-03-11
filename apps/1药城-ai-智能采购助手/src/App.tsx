import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Zap, 
  TrendingDown, 
  Package, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  Bell, 
  Send, 
  X,
  Plus,
  Store,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Product {
  id: string;
  name: string;
  spec: string;
  manufacturer: string;
  price: number;
  historyPrice: number;
  stock: number;
  isSelfOperated: boolean;
  source: string;
}

interface SpecAggregation {
  spec: string;
  manufacturer: number;
  merchant: number;
  source: number;
  minPrice: number;
  maxPrice: number;
  bestPrice: number;
  isRecommended?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  shop: string;
  spec: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: React.ReactNode;
  timestamp: Date;
}

// --- Mock Data ---

const MOCK_SPECS: SpecAggregation[] = [
  { spec: '10g*9袋', manufacturer: 20, merchant: 47, source: 122, minPrice: 3.21, maxPrice: 14.57, bestPrice: 3.21, isRecommended: true },
  { spec: '10g*10袋', manufacturer: 2, merchant: 9, source: 12, minPrice: 2.26, maxPrice: 11.59, bestPrice: 2.26 },
  { spec: '10g*15袋', manufacturer: 2, merchant: 5, source: 6, minPrice: 8.84, maxPrice: 9.36, bestPrice: 8.84 },
  { spec: '10g*12袋', manufacturer: 2, merchant: 5, source: 6, minPrice: 6.57, maxPrice: 7.52, bestPrice: 6.57 },
];

const MOCK_SOURCES: Product[] = [
  { id: 's1', name: '感冒灵颗粒', spec: '10g*10袋', manufacturer: '安徽新聚源医药科技有限公司企业店', price: 2.26, historyPrice: 8.5, stock: 1000, isSelfOperated: false, source: '吉林吴太感康药业有限公司' },
  { id: 's2', name: '感冒灵颗粒', spec: '10g*10袋', manufacturer: '四川大众医药有限公司企业店', price: 2.69, historyPrice: 8.5, stock: 500, isSelfOperated: false, source: '吉林吴太感康药业有限公司' },
  { id: 's3', name: '感冒灵颗粒', spec: '10g*10袋', manufacturer: '湖北亿昊药业有限公司', price: 3.15, historyPrice: 8.5, stock: 200, isSelfOperated: true, source: '吉林吴太感康药业有限公司' },
];

// --- Components ---

const ThinkingIndicator = ({ message }: { message?: string }) => (
  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl w-fit border border-slate-100 mb-4">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="w-1.5 h-1.5 bg-red-500 rounded-full"
        />
      ))}
    </div>
    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
      {message || "AI 正在为您深度分析行情..."}
    </span>
  </div>
);

const CollapsibleResponse = ({ children, title }: { children: React.ReactNode; title?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="space-y-2">
      <div className={isExpanded ? "" : "max-h-[200px] overflow-hidden relative"}>
        {children}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[10px] font-bold text-red-500 flex items-center gap-1 hover:underline"
      >
        {isExpanded ? "收起详情" : `展开更多${title ? title : ""}`}
        <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? "-rotate-90" : "rotate-90"}`} />
      </button>
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMsg, setThinkingMsg] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    const init = async () => {
      setIsThinking(true);
      await new Promise(r => setTimeout(r, 1000));
      setIsThinking(false);
      
      setMessages([
        {
          id: '1',
          type: 'ai',
          content: (
            <div className="space-y-3">
              <p className="font-medium text-slate-800">王药师，下午好！我是您的智能采购助手。</p>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs mb-2">
                  <TrendingDown className="w-3 h-3" /> 发现 2 个补货商机
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">「阿莫西林」价格下探</span>
                    <span className="text-red-600 font-bold">¥12.8 ↓</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">「板蓝根」库存告急</span>
                    <span className="text-slate-400">仅剩 5 件</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">需要我为您展示详细的采购建议吗？</p>
            </div>
          ),
          timestamp: new Date(),
        }
      ]);
    };
    init();
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const addToCart = (product: any) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: product.name || '感冒灵颗粒',
      price: product.price,
      quantity: 30, // Default bulk quantity
      shop: product.manufacturer,
      spec: product.spec
    };
    setCart(prev => [...prev, newItem]);
    
    // AI Feedback
    const total = [...cart, newItem].reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shops = new Set([...cart, newItem].map(i => i.shop)).size;
    
    // Mock marketing activity logic
    const hasPromotion = newItem.price > 10;
    const promotionText = hasPromotion ? "已参与「满1000减50」跨店活动" : "该商品享「买10赠1」厂家优惠";

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'ai',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" /> 成功加入购物车
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">当前进度</span>
              <span className="font-bold">{shops} 个店铺 / {cart.length + 1} 个品种</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">合计金额</span>
              <span className="font-bold text-red-600">¥{total.toFixed(2)}</span>
            </div>
            
            {/* Marketing Activity Section */}
            <div className="py-2 px-2 bg-orange-50 rounded-lg border border-orange-100 flex items-center gap-2 text-[10px] text-orange-700">
              <Zap className="w-3 h-3" />
              <span>{promotionText}</span>
            </div>

            {total < 500 ? (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-slate-600 mb-2">距离 <span className="text-red-500 font-bold">¥500</span> 包邮门槛还差 <span className="font-bold">¥{(500 - total).toFixed(2)}</span></p>
                <button 
                  onClick={() => handleSend('看看凑单建议')}
                  className="w-full py-1.5 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors"
                >
                  查看凑单建议
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 text-emerald-600 font-bold">
                ✨ 已满足包邮门槛，建议直接结算
              </div>
            )}
          </div>
        </div>
      ),
      timestamp: new Date()
    }]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setIsThinking(true);
    setThinkingMsg('正在检索全网货源...');
    await new Promise(r => setTimeout(r, 800));
    setThinkingMsg('正在对比历史采购价...');
    await new Promise(r => setTimeout(r, 700));
    setIsThinking(false);

    if (text.includes('需要') || text.includes('展示') || text.includes('建议')) {
      const aiMsg: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">好的，王药师。基于您的历史采购数据和当前平台行情，为您整理了以下详细建议：</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs mb-2">
                  <TrendingDown className="w-3 h-3" /> 补货建议：阿莫西林
                </div>
                <p className="text-xs text-slate-500 mb-3">当前价格 ¥12.8 为近半年最低，且您的库存仅够支撑 3 天。建议补货 20 盒。</p>
                <button 
                  onClick={() => addToCart({ name: '阿莫西林胶囊', price: 12.8, manufacturer: '石药集团中诺药业', spec: '0.25g*50粒' })}
                  className="w-full py-2 bg-red-600 text-white rounded-lg font-bold text-xs"
                >
                  一键补货 ¥256.00
                </button>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-2">
                  <Store className="w-3 h-3" /> 换商建议：板蓝根
                </div>
                <p className="text-xs text-slate-500 mb-3">您常用的商家目前缺货，为您找到同规格「自营仓」现货，价格持平且发货更快。</p>
                <button 
                  onClick={() => addToCart({ name: '板蓝根颗粒', price: 15.8, manufacturer: '1药城自营仓', spec: '10g*20袋' })}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-xs"
                >
                  切换至自营仓采购
                </button>
              </div>
            </div>
          </div>
        ),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } else if (text.includes('感冒灵')) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: (
          <CollapsibleResponse title="规格分析">
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-600 mb-3">王药师，您常购的 <span className="font-bold">感冒灵颗粒</span>，我帮您看了最新行情：</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500">常买规格</span>
                    <span className="font-bold">10g*9袋</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 mb-1">当前最优价</div>
                      <div className="text-red-500 font-bold flex items-center gap-1">
                        ¥3.21 <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1 rounded font-normal">自营</span>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 mb-1">对比上次采购</div>
                      <div className="text-red-500 font-bold flex items-center gap-1">
                        - ¥4.59 <TrendingDown className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                  <p className="text-emerald-600 font-bold text-xs">✨ 价格处于历史低位，建议补货。</p>
                </div>
                
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-2">
                    <Zap className="w-3 h-3" /> 快速复购
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold">湖北亿昊药业有限公司 <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1 rounded">自营</span></div>
                      <div className="text-[10px] text-slate-500">广西三九药业集团有限公司 · 10g*9袋</div>
                      <div className="text-red-500 font-bold mt-1">单价 ¥3.21 × 30盒 = ¥96</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart({ name: '感冒灵颗粒', price: 3.21, manufacturer: '湖北亿昊药业有限公司', spec: '10g*9袋' })}
                    className="w-full mt-3 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> 确认采购
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Package className="w-4 h-4" /> 规格分布
                  </div>
                  <span className="text-[10px] text-slate-400">5种规格</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {MOCK_SPECS.map((spec, idx) => (
                    <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleSpecSelect(spec.spec)}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-800">{spec.spec}</div>
                        <div className="text-[10px] text-slate-400">{spec.manufacturer}个厂家 · {spec.merchant}个商家 · {spec.source}条货源</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-500">¥{spec.minPrice.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">¥{spec.minPrice} ~ {spec.maxPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleResponse>
        ),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } else if (text.includes('阿莫西林')) {
      const aiMsg: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-sm text-red-700 font-bold mb-2 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> 价格预警：阿莫西林正在促销
              </p>
              <p className="text-xs text-slate-600 mb-4">您关注的 <span className="font-bold">阿莫西林胶囊 (0.25g*50粒)</span> 厂家直供价已降至 <span className="text-red-600 font-bold">¥12.80</span>，对比上周下降了 15%。</p>
              <button 
                onClick={() => addToCart({ name: '阿莫西林胶囊', price: 12.8, manufacturer: '石药集团中诺药业', spec: '0.25g*50粒' })}
                className="w-full py-2 bg-red-600 text-white rounded-lg font-bold text-sm"
              >
                按历史用量补货 (20盒)
              </button>
            </div>
          </div>
        ),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } else if (text.includes('复购')) {
      const aiMsg: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">王药师，为您整理了近30天高频复购清单，一键补足库存：</p>
            <div className="space-y-2">
              {[
                { name: '感冒灵颗粒', spec: '10g*9袋', price: 3.21, qty: 30 },
                { name: '布洛芬缓释胶囊', spec: '0.3g*24粒', price: 18.5, qty: 10 }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 text-xs">
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-slate-400">{item.spec} × {item.qty}</div>
                  </div>
                  <div className="font-bold text-red-500">¥{(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                addToCart({ name: '感冒灵颗粒', price: 3.21, manufacturer: '复购清单', spec: '10g*9袋' });
                addToCart({ name: '布洛芬缓释胶囊', price: 18.5, manufacturer: '复购清单', spec: '0.3g*24粒' });
              }}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm"
            >
              全部加入购物车
            </button>
          </div>
        ),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } else if (text.includes('凑单')) {
      const aiMsg: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">为您推荐以下高性价比凑单方案，预计可为您节省 <span className="text-red-500 font-bold">¥15.00</span> 运费：</p>
            <div className="space-y-3">
              {[
                { name: '板蓝根颗粒', spec: '10g*20袋', price: 15.8, reason: '您的库存仅剩 5 件' },
                { name: '维C银翘片', spec: '12片*2板', price: 4.5, reason: '近期流感高发，补货热度高' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex gap-3 items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.spec}</div>
                    <div className="text-[10px] text-red-500 mt-1 italic">{item.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-500">¥{item.price}</div>
                    <button 
                      onClick={() => addToCart({ ...item, manufacturer: '凑单推荐' })}
                      className="mt-1 p-1 bg-red-50 text-red-600 rounded-md"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } else if (text.includes('结算') || text.includes('提交')) {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const aiMsg: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">好的，王药师。已为您准备好结算清单：</p>
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <span className="text-xs opacity-60">订单总额</span>
                <span className="text-2xl font-black italic text-yellow-400">¥{total.toFixed(2)}</span>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="opacity-60">商品数量</span>
                  <span>{cart.length} 品 / {cart.reduce((s, i) => s + i.quantity, 0)} 件</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="opacity-60">运费减免</span>
                  <span className="text-emerald-400">- ¥15.00</span>
                </div>
              </div>
              <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-900/20 active:scale-95 transition-transform">
                立即提交订单
              </button>
            </div>
          </div>
        ),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } else {
      const aiMsg: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">抱歉，王药师。我正在学习如何处理「{text}」相关的采购需求。</p>
            <p className="text-xs text-slate-400 italic">您可以尝试搜索「感冒灵」、「阿莫西林」或点击下方的快捷操作。</p>
          </div>
        ),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const handleSpecSelect = async (spec: string) => {
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: `${spec}规格的感冒灵颗粒有哪些货源？`, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    setIsThinking(true);
    setThinkingMsg('正在检索该规格货源...');
    await new Promise(r => setTimeout(r, 600));
    setThinkingMsg('正在筛选优质商家...');
    await new Promise(r => setTimeout(r, 600));
    setIsThinking(false);

    const aiMsg: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: (
        <CollapsibleResponse title="货源明细">
          <div className="space-y-4">
            <p className="text-sm text-slate-600">为您找到 <span className="font-bold">{spec}</span> 规格的感冒灵颗粒货源。重点推荐吉林吴太感康药业，当前价格为 2.26元，相较于您上次的采购价 6.24元，降幅超过 60%，具有极高的采购性价比。</p>
            
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50/50 border-b border-slate-50">
                <div className="text-sm font-bold">感冒灵颗粒 <span className="text-red-500">{spec}</span></div>
                <div className="text-[10px] text-slate-400 mt-1">共 12 条，<span className="text-red-500">¥2.26 ~ ¥11.59</span> (均价 ¥5.87)</div>
              </div>
              
              <div className="p-4">
                <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 mb-4">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-3">
                    <Zap className="w-3 h-3" /> 最优选择
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-bold">安徽新聚源医药科技有限公司企业店</div>
                    <div className="text-[10px] text-slate-500">吉林吴太感康药业有限公司 · {spec}</div>
                    <div className="text-red-500 text-xl font-bold mt-1">单价 ¥2.26</div>
                  </div>
                  <button 
                    onClick={() => addToCart({ name: '感冒灵颗粒', price: 2.26, manufacturer: '安徽新聚源医药科技有限公司', spec: spec })}
                    className="w-full py-2.5 bg-emerald-500 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-200"
                  >
                    <CheckCircle2 className="w-4 h-4" /> 确认采购
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 mb-2 flex items-center gap-2">
                    <Store className="w-3 h-3" /> 货源列表 <span className="font-normal">前8条 / 共12条</span>
                  </div>
                  {MOCK_SOURCES.map((source, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate text-slate-700">{source.manufacturer}</div>
                        <div className="text-[10px] text-slate-400 truncate">{source.source} · {source.spec}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-500">¥{source.price.toFixed(2)}</div>
                        <button 
                          onClick={() => addToCart(source)}
                          className="mt-1 p-1 bg-slate-50 text-slate-400 rounded-md hover:text-red-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleResponse>
      ),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Main Homepage Content (Background) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Search Bar */}
        <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center gap-4 z-10">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索药品、厂家、批号..." 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  setIsSidebarOpen(true);
                  handleSend(val);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="w-full h-8 bg-slate-100 rounded-full pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-slate-400" />
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold">
              <ShoppingCart className="w-4 h-4" /> {cart.length}
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white px-4 py-2 flex gap-6 text-xs text-slate-500 border-b border-slate-100">
          <span className="text-red-600 font-bold border-b-2 border-red-600 pb-1">1药城首页</span>
          <span>返回新版</span>
        </div>

        {/* Hero Section */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="flex gap-6">
            <div className="w-64 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="bg-red-600 text-white p-3 rounded-lg flex items-center gap-2 font-bold mb-4">
                <Filter className="w-4 h-4" /> 所有商品分类
              </div>
              <div className="space-y-4 text-sm text-slate-600">
                {['药品', '医疗器械', '保健食品', '中药', '食品', '个人护理'].map(cat => (
                  <div key={cat} className="flex justify-between items-center hover:text-red-600 cursor-pointer">
                    {cat} <ChevronRight className="w-4 h-4 opacity-40" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg group">
                <img src="https://picsum.photos/seed/pharmacy/1200/400" className="w-full h-full object-cover" alt="Banner" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex flex-col justify-center p-12 text-white">
                  <h2 className="text-5xl font-black italic mb-4">整件购预订专区</h2>
                  <div className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-full font-bold text-lg w-fit mb-6">提前锁定 享预订超低价</div>
                  <p className="text-sm opacity-80">说明：点击专区后加购物车（认准「预订」购物车）</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden">
                      <img src={`https://picsum.photos/seed/med${i}/300/300`} className="w-full h-full object-cover" alt="Product" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-sm font-bold mb-1">感冒灵颗粒 10g*9袋</div>
                    <div className="text-xs text-slate-400 mb-2">华润三九医药股份有限公司</div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 font-bold">¥12.50</span>
                      <button className="p-1.5 bg-red-50 text-red-600 rounded-lg"><ShoppingCart className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Trigger Button */}
        {!isSidebarOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setIsSidebarOpen(true)}
            className="absolute bottom-8 right-8 w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-red-700 transition-colors"
          >
            <Sparkles className="w-8 h-8" />
          </motion.button>
        )}
      </div>

      {/* AI Assistant Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="p-4 bg-red-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">1药城智能采购助手</h3>
                  <div className="flex items-center gap-1 text-[10px] opacity-80">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    在线为您实时监控行情
                  </div>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                    msg.type === 'ai' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {msg.type === 'ai' ? 'AI' : '王'}
                  </div>
                  <div className={`max-w-[85%] ${
                    msg.type === 'user' 
                      ? 'bg-red-600 text-white rounded-2xl rounded-tr-none p-3 shadow-md text-sm' 
                      : 'bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-100 text-sm leading-relaxed text-slate-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isThinking && <ThinkingIndicator message={thinkingMsg} />}
            </div>

            {/* Bottom Input & Quick Actions */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                {['去结算', '一键复购', '哪个厂家好?', '看自营的', '从哪家进货?'].map(chip => (
                  <button 
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="whitespace-nowrap px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 hover:border-red-500 hover:text-red-600 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  placeholder="输入药品名称，或说「复购」快速下单..."
                  className="w-full h-12 bg-slate-100 rounded-2xl pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                <button 
                  onClick={() => handleSend(inputValue)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
