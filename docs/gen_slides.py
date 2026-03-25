"""Generate 6 presentation slides as PNG images."""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1920, 1080
OUT_DIR = os.path.join(os.path.dirname(__file__), "slides")
os.makedirs(OUT_DIR, exist_ok=True)

# ── Colours ──────────────────────────────────────────────
BG       = "#0F172A"   # dark navy
WHITE    = "#F8FAFC"
ACCENT   = "#38BDF8"   # sky-blue
ACCENT2  = "#818CF8"   # indigo
ACCENT3  = "#34D399"   # emerald
MUTED    = "#94A3B8"   # slate-400
CARD_BG  = "#1E293B"   # slate-800
ORANGE   = "#FB923C"
RED      = "#F87171"
YELLOW   = "#FACC15"

# ── Fonts (use Windows built-in) ─────────────────────────
def get_font(size, bold=False):
    """Try to load a CJK font that ships with Windows."""
    candidates = [
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simsun.ttc",
        "C:/Windows/Fonts/simhei.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

FONT_TITLE = get_font(56, bold=True)
FONT_SUB   = get_font(36, bold=True)
FONT_BODY  = get_font(30)
FONT_SMALL = get_font(26)
FONT_BIG   = get_font(72, bold=True)
FONT_HUGE  = get_font(96, bold=True)
FONT_TAG   = get_font(22, bold=True)

def new_slide():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    return img, draw

def draw_rounded_rect(draw, xy, fill, radius=20):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)

def draw_tag(draw, x, y, text, color=ACCENT):
    bbox = draw.textbbox((0, 0), text, font=FONT_TAG)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x, pad_y = 16, 8
    draw_rounded_rect(draw, (x, y, x + tw + pad_x * 2, y + th + pad_y * 2), fill=color, radius=12)
    draw.text((x + pad_x, y + pad_y), text, fill=WHITE, font=FONT_TAG)
    return tw + pad_x * 2

def save(img, num):
    path = os.path.join(OUT_DIR, f"slide_{num}.png")
    img.save(path, "PNG")
    print(f"  saved {path}")

# ═══════════════════════════════════════════════════════════
#  SLIDE 1 — Title / Core Thesis
# ═══════════════════════════════════════════════════════════
img, d = new_slide()

# Decorative line
d.rectangle((120, 200, 130, 420), fill=ACCENT)

d.text((160, 200), "Agent 下医药入口形态讨论", fill=WHITE, font=FONT_TITLE)
d.text((160, 290), "核心观点", fill=MUTED, font=FONT_SUB)

# Big quote
y = 400
d.text((160, y), "传统入口抢的是", fill=MUTED, font=FONT_BIG)
d.text((160 + d.textlength("传统入口抢的是", font=FONT_BIG), y), "注意力", fill=ORANGE, font=FONT_BIG)

y += 110
d.text((160, y), "Agent 入口抢的是", fill=MUTED, font=FONT_BIG)
d.text((160 + d.textlength("Agent 入口抢的是", font=FONT_BIG), y), "决策权", fill=ACCENT, font=FONT_BIG)

y += 150
d.text((160, y), "谁拿到决策权，谁决定钱往哪流。", fill=WHITE, font=FONT_SUB)

y += 80
d.text((160, y), "今天讨论的不是页面长什么样，而是能不能成为药店经营决策的代理人。", fill=MUTED, font=FONT_BODY)

save(img, 1)

# ═══════════════════════════════════════════════════════════
#  SLIDE 2 — Monetisation paths
# ═══════════════════════════════════════════════════════════
img, d = new_slide()

d.text((120, 80), "拿到决策权后的变现路径", fill=WHITE, font=FONT_TITLE)
d.text((120, 160), "前提都一样：先把决策权拿到手", fill=MUTED, font=FONT_BODY)

items = [
    ("向平台收钱",  "订单流分发佣金",      ACCENT),
    ("向药企收钱",  "新品精准推广费",       ACCENT2),
    ("向药店收钱",  "省钱分成 / 服务费",   ACCENT3),
    ("集采议价",    "聚合采购量谈批量价",   ORANGE),
    ("数据金融",    "经营数据做风控",       YELLOW),
]

start_x = 120
card_w = 320
card_h = 360
gap = 30
y0 = 260

for i, (title, desc, color) in enumerate(items):
    x = start_x + i * (card_w + gap)
    draw_rounded_rect(d, (x, y0, x + card_w, y0 + card_h), fill=CARD_BG, radius=16)
    # Color bar at top
    d.rounded_rectangle((x, y0, x + card_w, y0 + 8), radius=4, fill=color)
    # Number
    d.text((x + 24, y0 + 30), f"0{i+1}", fill=color, font=FONT_BIG)
    # Title
    d.text((x + 24, y0 + 130), title, fill=WHITE, font=FONT_SUB)
    # Desc — wrap manually
    line_y = y0 + 190
    chars_per_line = 8
    for j in range(0, len(desc), chars_per_line):
        d.text((x + 24, line_y), desc[j:j+chars_per_line], fill=MUTED, font=FONT_SMALL)
        line_y += 40

# Bottom note
d.text((120, y0 + card_h + 60), "具体走哪条路后面再定 —— 关键是先拿到决策权", fill=ACCENT, font=FONT_SUB)

save(img, 2)

# ═══════════════════════════════════════════════════════════
#  SLIDE 3 — Trust Ladder (3 steps)
# ═══════════════════════════════════════════════════════════
img, d = new_slide()

d.text((120, 80), "怎么拿到决策权 —— 信任三步走", fill=WHITE, font=FONT_TITLE)

steps = [
    ("01", "让他看见在亏钱",   "Agent 帮他算一笔账\n给出一个扎心的数字\n让他意识到需要改变", ACCENT),
    ("02", "反复验证建信任",    "Agent 给建议\n老板自己验证\n采纳率 >70% = 信了", ACCENT2),
    ("03", "接管日常决策",      "常规决策自动执行\n异常才打扰老板\n决策权正式转移", ACCENT3),
]

card_w = 500
card_h = 400
gap = 40
y0 = 220

for i, (num, title, desc, color) in enumerate(steps):
    x = 120 + i * (card_w + gap)
    draw_rounded_rect(d, (x, y0, x + card_w, y0 + card_h), fill=CARD_BG, radius=16)
    # Big number
    d.text((x + 30, y0 + 20), num, fill=color, font=FONT_HUGE)
    # Title
    d.text((x + 30, y0 + 140), title, fill=WHITE, font=FONT_SUB)
    # Desc lines
    line_y = y0 + 210
    for line in desc.split("\n"):
        d.text((x + 30, line_y), line, fill=MUTED, font=FONT_BODY)
        line_y += 48

# Arrow connectors
for i in range(2):
    x_start = 120 + (i + 1) * (card_w + gap) - gap // 2
    cy = y0 + card_h // 2
    d.text((x_start - 14, cy - 20), "→", fill=MUTED, font=FONT_SUB)

# Bottom
d.text((120, y0 + card_h + 50), "关键问题：第一步那个钩子，用什么场景来扎？", fill=ORANGE, font=FONT_SUB)

save(img, 3)

# ═══════════════════════════════════════════════════════════
#  SLIDE 4 — Entry-point comparison
# ═══════════════════════════════════════════════════════════
img, d = new_slide()

d.text((120, 60), "第一刀切哪里？", fill=WHITE, font=FONT_TITLE)

# Decision criteria tags
d.text((120, 140), "五个判断标准：", fill=MUTED, font=FONT_SMALL)
tags = ["痛感强", "可量化", "门槛低", "频率高", "数据可延伸"]
tag_colors = [RED, ORANGE, ACCENT3, ACCENT, ACCENT2]
tx = 350
for tag_text, tc in zip(tags, tag_colors):
    w = draw_tag(d, tx, 138, tag_text, tc)
    tx += w + 12

# Three option cards
options = [
    ("A", "跨平台采购比价", "你上个月多花了\n¥3,200",
     "✓ 价值清晰\n✓ 频率高\n✗ 爬虫法律风险\n✗ 纯比价不懂行", ACCENT),
    ("B", "效期损耗管理", "你有47个品种\n正在变废品\n货值 ¥2.3万",
     "✓ 痛感最强\n✓ 无合规风险\n✓ 数据延伸好\n✗ 频率稍低", ORANGE),
    ("C", "组合打法", "效期做钩子\n比价做留存\n逐步接管采购",
     "✓ 钩子最尖锐\n✓ 自然过渡\n✓ 叙事格局大\n○ 需验证", ACCENT3),
]

card_w = 520
card_h = 480
gap = 30
y0 = 210

for i, (letter, title, hook, pros, color) in enumerate(options):
    x = 120 + i * (card_w + gap)
    draw_rounded_rect(d, (x, y0, x + card_w, y0 + card_h), fill=CARD_BG, radius=16)
    # Header bar
    d.rounded_rectangle((x, y0, x + card_w, y0 + 8), radius=4, fill=color)
    # Letter + title
    d.text((x + 24, y0 + 24), f"方案{letter}", fill=color, font=FONT_SUB)
    d.text((x + 24, y0 + 72), title, fill=WHITE, font=FONT_SUB)
    # Hook quote
    line_y = y0 + 140
    for line in hook.split("\n"):
        d.text((x + 24, line_y), line, fill=YELLOW, font=FONT_BODY)
        line_y += 42
    # Pros/cons
    line_y += 10
    for line in pros.split("\n"):
        c = ACCENT3 if line.startswith("✓") else (RED if line.startswith("✗") else MUTED)
        d.text((x + 24, line_y), line, fill=c, font=FONT_SMALL)
        line_y += 38

# Bottom
d.text((120, y0 + card_h + 30), "今天想重点讨论：我们第一刀到底切哪个场景？", fill=WHITE, font=FONT_SUB)

save(img, 4)

# ═══════════════════════════════════════════════════════════
#  SLIDE 5 — Vision: from procurement to operations
# ═══════════════════════════════════════════════════════════
img, d = new_slide()

d.text((120, 80), "终局：从采购代理到经营代理", fill=WHITE, font=FONT_TITLE)
d.text((120, 160), "采购只是切入点，不是终点", fill=MUTED, font=FONT_BODY)

# Flow: 采购 → 库存 → 定价 → 选品 → 经营全局
stages = [
    ("采购决策", "从哪买\n买多少", ACCENT),
    ("库存管理", "效期/补货\n周转优化", ACCENT2),
    ("定价决策", "参考同行\n利润分析", ACCENT3),
    ("品类选品", "需求分析\n新品推荐", ORANGE),
    ("经营全局", "帮你把店\n开好", YELLOW),
]

node_w = 260
node_h = 240
gap = 50
total_w = len(stages) * node_w + (len(stages) - 1) * gap
start_x = (W - total_w) // 2
y0 = 300

for i, (title, desc, color) in enumerate(stages):
    x = start_x + i * (node_w + gap)
    draw_rounded_rect(d, (x, y0, x + node_w, y0 + node_h), fill=CARD_BG, radius=16)
    d.rounded_rectangle((x, y0, x + node_w, y0 + 8), radius=4, fill=color)
    d.text((x + 20, y0 + 30), title, fill=color, font=FONT_SUB)
    line_y = y0 + 90
    for line in desc.split("\n"):
        d.text((x + 20, line_y), line, fill=MUTED, font=FONT_BODY)
        line_y += 44
    # Arrow
    if i < len(stages) - 1:
        ax = x + node_w + gap // 2
        d.text((ax - 14, y0 + node_h // 2 - 16), "→", fill=MUTED, font=FONT_SUB)

# Bottom insight
y_bot = y0 + node_h + 80
d.text((120, y_bot), "数据自然延伸：", fill=WHITE, font=FONT_SUB)
d.text((120, y_bot + 50), "采购数据 → 库存数据 → 销售数据 → 经营全貌", fill=ACCENT, font=FONT_BODY)
d.text((120, y_bot + 100), "不是做新产品，是同一个 Agent 能力的自然延伸", fill=MUTED, font=FONT_BODY)

save(img, 5)

# ═══════════════════════════════════════════════════════════
#  SLIDE 6 — Moats + Summary
# ═══════════════════════════════════════════════════════════
img, d = new_slide()

d.text((120, 60), "壁垒与总结", fill=WHITE, font=FONT_TITLE)

# Three moat pillars
moats = [
    ("数据壁垒", "跨平台价格 + 经营数据\n需要时间积累\n后来者追不上", ACCENT),
    ("关系壁垒", "供应商偏好 + 采购习惯\n沉淀在 Agent 记忆里\n迁移成本极高", ACCENT2),
    ("网络壁垒", "药店越多 → 议价越强\n→ 省钱越多 → 更多药店\n飞轮效应", ACCENT3),
]

pw = 480
ph = 280
pgap = 30
py0 = 180

for i, (title, desc, color) in enumerate(moats):
    x = 120 + i * (pw + pgap)
    draw_rounded_rect(d, (x, py0, x + pw, py0 + ph), fill=CARD_BG, radius=16)
    d.rounded_rectangle((x, py0, x + pw, py0 + 8), radius=4, fill=color)
    d.text((x + 24, py0 + 30), title, fill=color, font=FONT_SUB)
    line_y = py0 + 90
    for line in desc.split("\n"):
        d.text((x + 24, line_y), line, fill=MUTED, font=FONT_BODY)
        line_y += 44

# Divider
d.rectangle((120, py0 + ph + 40, W - 120, py0 + ph + 42), fill=CARD_BG)

# Summary bullets
sy = py0 + ph + 70
summary = [
    ("01", "入口本质是决策权，不是页面"),
    ("02", "信任三步走：看见亏钱 → 验证信任 → 交出决策"),
    ("03", "第一刀切哪里？今天重点讨论"),
    ("04", "终局：采购代理 → 经营代理"),
    ("05", "壁垒 = 数据 + 关系 + 网络效应"),
]

for i, (num, text) in enumerate(summary):
    x = 140 + (i % 3) * 560
    y = sy + (i // 3) * 55
    d.text((x, y), num, fill=ACCENT, font=FONT_SUB)
    d.text((x + 50, y + 4), text, fill=WHITE, font=FONT_SMALL)

# Closing
d.text((120, H - 80), "工具可以被抄，决策数据和用户信任抄不走。", fill=ORANGE, font=FONT_SUB)

save(img, 6)

print("\nDone — 6 slides generated.")
