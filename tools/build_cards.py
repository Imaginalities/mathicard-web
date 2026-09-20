#!/usr/bin/env python3
"""
tools/build_cards.py - Parses game catalogs and localization into web/js/cards-data.js
Stdlib only. Run from repository root or web directory.
"""
import os
import sys
import re
import csv
import json

# Detect base directory (support both CNDPT/ and CNDPT/web/)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.basename(SCRIPT_DIR) == "tools" and os.path.exists(os.path.join(SCRIPT_DIR, "..", "web")):
    BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
elif os.path.exists(os.path.join(SCRIPT_DIR, "..", "js")):
    BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
else:
    BASE_DIR = "/home/life/Documents/CNDPT"

GAME_DIR = "/home/life/Documents/antigravity/modest-goodall"
CLIENT_DIR = os.path.join(GAME_DIR, "Mathicard.Client")
SHARED_DIR = os.path.join(GAME_DIR, "Mathicard.Shared")
CONST_DIR = os.path.join(SHARED_DIR, "src", "Domain", "Constants")
OUTPUT_JS = os.path.join(BASE_DIR, "web", "js", "cards-data.js")

COIN_IMG = '<img src="assets/icons/coin.webp" alt="Xu" class="card-token-icon" />'
BCOIN_IMG = '<img src="assets/icons/bcoin.webp" alt="Xu thưởng" class="card-token-icon" />'
POINT_IMG = '<img src="assets/icons/point.webp" alt="Điểm" class="card-token-icon" />'

def load_localization():
    loc_file = os.path.join(CLIENT_DIR, "localization.csv")
    loc = {}
    if not os.path.exists(loc_file):
        return loc
    with open(loc_file, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        try:
            next(reader)
        except StopIteration:
            return loc
        for row in reader:
            if len(row) >= 3:
                key = row[0].strip()
                vi = row[2].strip()
                loc[key] = vi
    return loc

def split_csharp_args(text):
    args = []
    curr = []
    in_str = False
    escape = False
    paren_depth = 0
    bracket_depth = 0
    brace_depth = 0
    
    i = 0
    while i < len(text):
        c = text[i]
        if escape:
            curr.append(c)
            escape = False
            i += 1
            continue
        if c == '\\' and in_str:
            curr.append(c)
            escape = True
            i += 1
            continue
        if c == '"':
            in_str = not in_str
            curr.append(c)
            i += 1
            continue
        if not in_str:
            if c == '(':
                paren_depth += 1
            elif c == ')':
                paren_depth -= 1
            elif c == '[':
                bracket_depth += 1
            elif c == ']':
                bracket_depth -= 1
            elif c == '{':
                brace_depth += 1
            elif c == '}':
                brace_depth -= 1
            elif c == ',' and paren_depth == 0 and bracket_depth == 0 and brace_depth == 0:
                args.append(''.join(curr).strip())
                curr = []
                i += 1
                continue
        curr.append(c)
        i += 1
    if curr:
        args.append(''.join(curr).strip())
    return args

def extract_new_calls(code_block):
    calls = []
    i = 0
    while i < len(code_block):
        if code_block[i:i+4] == 'new(' or code_block[i:i+5] == 'new (':
            start = code_block.find('(', i)
            depth = 1
            j = start + 1
            in_str = False
            escape = False
            while j < len(code_block) and depth > 0:
                c = code_block[j]
                if escape:
                    escape = False
                elif c == '\\' and in_str:
                    escape = True
                elif c == '"':
                    in_str = not in_str
                elif not in_str:
                    if c == '(':
                        depth += 1
                    elif c == ')':
                        depth -= 1
                j += 1
            if depth == 0:
                inner = code_block[start+1:j-1]
                calls.append(inner)
                i = j
                continue
        i += 1
    return calls

def clean_str(val):
    val = val.strip()
    if val.startswith('"') and val.endswith('"'):
        val = val[1:-1]
        val = val.replace('\\"', '"').replace('\\\\', '\\')
    return val

def clean_rarity(val):
    val = val.replace("CardRarity.", "").strip().lower()
    return val

def transform_markup(text):
    """
    Converts game tags ([C], [BC], [PT], BBCode color, etc.) to valid HTML.
    Inline icons use 1em sizing with appropriate alt text.
    """
    if not text:
        return ""
    
    # 1. Replace {REWARD} with X (matching game client CardDescriptionResolver)
    text = text.replace("{REWARD}", "X")
    
    # 2. BBCode colors: [color=#hex]...[/color] -> <span style="color: #hex;">...</span>
    text = re.sub(r'\[color=([^\]]+)\]', r'<span style="color: \1;">', text)
    text = text.replace('[/color]', '</span>')
    
    # 3. BBCode styles: [b], [i], [u], [s]
    text = re.sub(r'\[b\](.*?)\[/b\]', r'<strong>\1</strong>', text)
    text = re.sub(r'\[i\](.*?)\[/i\]', r'<em>\1</em>', text)
    text = re.sub(r'\[u\](.*?)\[/u\]', r'<u>\1</u>', text)
    text = re.sub(r'\[s\](.*?)\[/s\]', r'<s>\1</s>', text)
    
    # 4. Compound / specific Vietnamese catalog tokens
    text = re.sub(r'\[\+0\.1\s*Hệ số Nhân BCoin\]', f'+0.1 Hệ số Nhân {BCOIN_IMG}', text)
    text = re.sub(r'\[\+0\.2\s*Hệ số Nhân Coin\]', f'+0.2 Hệ số Nhân {COIN_IMG}', text)
    text = re.sub(r'\[\+x\s*Coin\]', f'+x {COIN_IMG}', text)
    text = re.sub(r'\[\+?([\d\.x\/]+)\s*Coin\]', rf'\1 {COIN_IMG}', text)
    
    # 5. Game mechanic tokens from client code & catalogs (Fame, Reroll, values, operators)
    text = re.sub(r'\[([+\-]?\d*)\s*Danh vọng\]', r'\1 Danh vọng', text)
    text = text.replace('[Fame]', 'Danh vọng')
    text = re.sub(r'\[([+\-]?\d*)\s*Reroll\]', r'\1 Reroll', text)
    text = text.replace('[Reroll]', 'Reroll')
    text = re.sub(r'\[([+\-]\d+)\]', r'\1', text)
    text = text.replace('[×]', '×').replace('[÷]', '÷').replace('[/]', '/').replace('[x]', 'x')
    text = text.replace('[x/1.5]', 'x/1.5')
    
    # 6. Resource tokens with modifier/amount: [+1 C], [-2 BC], [+0.4 MP], [+x C], [+PT], etc.
    def replace_resource_token(match):
        mod = match.group(1).strip()
        res = match.group(2).strip()
        mod_prefix = (mod + ' ') if mod else ''
        if res == 'C':
            return f'{mod_prefix}{COIN_IMG}'
        elif res == 'BC':
            return f'{mod_prefix}{BCOIN_IMG}'
        elif res == 'PT':
            return f'{mod_prefix}{POINT_IMG}'
        elif res == 'MP':
            return f'<span style="color: #aad4ff;">{mod_prefix}MP</span>'
        elif res == 'SV':
            return f'<span style="color: #f5c842;">{mod_prefix}SV</span>'
        elif res == 'DUR':
            return f'<span style="color: #c8f0a8;">{mod_prefix}DUR</span>'
        else:
            return match.group(0) # Keep for validation check
            
    text = re.sub(r'\[([+\-x×÷]?[\d\.x\/]*)\s*([A-Z_]+)\]', replace_resource_token, text)
    
    # 7. Standalone resource tokens
    text = text.replace('[C]', COIN_IMG)
    text = text.replace('[BC]', BCOIN_IMG)
    text = text.replace('[PT]', POINT_IMG)
    text = text.replace('[MP]', '<span style="color: #aad4ff;">MP</span>')
    text = text.replace('[SV]', '<span style="color: #f5c842;">SV</span>')
    text = text.replace('[DUR]', '<span style="color: #c8f0a8;">DUR</span>')
    
    # 8. Newline formatting
    text = text.replace('\\n', '<br />').replace('\n', '<br />')
    return text.strip()

def calculate_price(card_type, rarity, player_count=1):
    x = max(1, player_count)
    r = rarity.lower()
    if card_type in ["item", "sticker", "decoration", "document"]:
        if r == "common":
            return max(1, x // 1)
        elif r == "rare":
            return 2 * x
        elif r == "epic":
            return 4 * x
        elif r == "legendary":
            return 8 * x
        return max(1, x // 1)
    elif card_type == "course":
        if r == "common":
            return x
        elif r == "rare":
            return 3 * x
        elif r == "epic":
            return 6 * x
        elif r == "legendary":
            return 10 * x
        return x
    elif card_type == "value":
        return 10
    elif card_type == "operator":
        if r == "rare":
            return 30
        return 15
    return 0

def build_value_cards(loc):
    # 9 numbers * 4 colors = 36 cards, plus 3 special constants = 39 cards
    # Value cards have no individual description in game data; per requirement 3, show no description.
    colors_info = [
        ("Red", "đỏ", "Đỏ", "#d91f17"),
        ("Blue", "xanh dương", "Xanh dương", "#1461bd"),
        ("Green", "xanh lá", "Xanh lá", "#268c38"),
        ("Yellow", "vàng", "Vàng", "#cc7a00"),
    ]
    cards = []
    
    for val in range(1, 10):
        for col_id, col_desc, col_title, hex_val in colors_info:
            card_id = f"Val_{col_id}_{val}"
            name_vi = f"Thẻ {val} ({col_title})"
            cards.append({
                "id": card_id,
                "type": "value",
                "nameVi": name_vi,
                "rarity": "common",
                "descriptionVi": "",
                "price": 10,
                "render": "text",
                "value": str(val),
                "color": col_id.lower(),
                "colorHex": hex_val,
                "colorName": col_title
            })
    
    # 3 Special constants from PackLootResolver.cs
    special_consts = [
        ("Val_Pi", "π", "Hằng số Pi", "rare", 20),
        ("Val_Euler", "e", "Hằng số Euler", "rare", 20),
        ("Val_Phi", "φ", "Tỷ lệ vàng", "rare", 20),
    ]
    for cid, sym, cname, crarity, cprice in special_consts:
        cards.append({
            "id": cid,
            "type": "value",
            "nameVi": f"Thẻ hằng số {sym} ({cname})",
            "rarity": crarity,
            "descriptionVi": "",
            "price": cprice,
            "render": "text",
            "value": sym,
            "color": "none",
            "colorHex": "#1a1a1a",
            "colorName": "Không màu"
        })
        
    return cards

def build_operator_cards(loc):
    # From CardEnums.cs OperatorType:
    # Add, Subtract, Multiply, Divide, Sin, Cos, Tan, Ln, Sqrt, Abs, Ceil, Floor, Truncate
    # Operator cards have no individual description in game data; per requirement 3, show no description.
    operators = [
        ("Op_Add", "Cộng", "+", "common", "binary", 15),
        ("Op_Sub", "Trừ", "−", "common", "binary", 15),
        ("Op_Mul", "Nhân", "×", "common", "binary", 20),
        ("Op_Div", "Chia", "/", "common", "binary", 20),
        ("Op_Sin", "Sin", "Sin", "rare", "unary", 30),
        ("Op_Cos", "Cos", "Cos", "rare", "unary", 30),
        ("Op_Tan", "Tan", "Tan", "rare", "unary", 30),
        ("Op_Ln", "Ln", "Ln", "rare", "unary", 30),
        ("Op_Sqrt", "Căn bậc hai", "√a", "rare", "unary", 30),
        ("Op_Abs", "Giá trị tuyệt đối", "|a|", "rare", "unary", 30),
        ("Op_Ceil", "Làm tròn lên", "⌈a⌉", "rare", "unary", 30),
        ("Op_Floor", "Làm tròn xuống", "⌊a⌋", "rare", "unary", 30),
        ("Op_Truncate", "Cắt thập phân", "trunc", "rare", "unary", 30),
    ]
    cards = []
    for cid, name, sym, rarity, cat, price in operators:
        cards.append({
            "id": cid,
            "type": "operator",
            "nameVi": f"Toán tử {name}",
            "rarity": rarity,
            "descriptionVi": "",
            "price": price,
            "render": "text",
            "symbol": sym,
            "category": cat,
            "color": "dark",
            "colorHex": "#1a1a1a",
            "colorName": "Đen"
        })
    return cards

def parse_items(loc):
    file_path = os.path.join(CONST_DIR, "ItemCardCatalog.cs")
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    all_match = re.search(r'public static readonly IReadOnlyList<ItemCardDefinition> All = new List<ItemCardDefinition>\s*\{(.+?)\};\s*(?:public|private|\})', code, re.DOTALL)
    if not all_match:
        return []
    
    calls = extract_new_calls(all_match.group(1))
    cards = []
    for call in calls:
        args = split_csharp_args(call)
        if len(args) < 5:
            continue
        card_id = clean_str(args[0])
        display_name = clean_str(args[1])
        rarity = clean_rarity(args[2])
        legacy_frame = int(args[3].strip())
        desc = clean_str(args[4])
        
        name_vi = loc.get(f"ITEM_{card_id}_NAME", display_name)
        raw_desc = loc.get(f"ITEM_{card_id}_DESC", desc)
        desc_vi = transform_markup(raw_desc)
        price = calculate_price("item", rarity)
        
        cards.append({
            "id": card_id,
            "type": "item",
            "nameVi": name_vi,
            "rarity": rarity,
            "descriptionVi": desc_vi,
            "price": price,
            "legacyFrameIndex": legacy_frame,
            "image": f"assets/cards/item/{card_id}.webp"
        })
    return cards

def parse_courses(loc):
    file_path = os.path.join(CONST_DIR, "CourseCardCatalog.cs")
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    all_match = re.search(r'public static readonly IReadOnlyList<CourseCardDefinition> All = new List<CourseCardDefinition>\s*\{(.+?)\};\s*(?:public|private|\})', code, re.DOTALL)
    if not all_match:
        return []
    
    calls = extract_new_calls(all_match.group(1))
    cards = []
    for call in calls:
        args = split_csharp_args(call)
        if len(args) < 5:
            continue
        card_id = clean_str(args[0])
        display_name = clean_str(args[1])
        rarity = clean_rarity(args[2])
        course_name = clean_str(args[3])
        desc = clean_str(args[4])
        
        name_vi = loc.get(f"COURSE_{card_id}_NAME", display_name)
        raw_desc = loc.get(f"COURSE_{card_id}_DESC", desc)
        desc_vi = transform_markup(raw_desc)
        price = calculate_price("course", rarity)
        
        cards.append({
            "id": card_id,
            "type": "course",
            "nameVi": name_vi,
            "rarity": rarity,
            "descriptionVi": desc_vi,
            "price": price,
            "image": f"assets/cards/course/{card_id}.webp"
        })
    return cards

def parse_documents(loc):
    file_path = os.path.join(CONST_DIR, "DocumentCardCatalog.cs")
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    all_match = re.search(r'public static readonly IReadOnlyList<DocumentCardDefinition> All = new List<DocumentCardDefinition>\s*\{(.+?)\};\s*(?:public|private|\})', code, re.DOTALL)
    if not all_match:
        return []
    
    calls = extract_new_calls(all_match.group(1))
    cards = []
    for call in calls:
        args = split_csharp_args(call)
        if len(args) < 6:
            continue
        card_id = clean_str(args[0])
        display_name = clean_str(args[1])
        rarity = clean_rarity(args[2])
        artwork_frame = int(args[3].strip())
        desc = clean_str(args[5])
        
        name_vi = loc.get(f"DOCUMENT_{card_id.upper()}_NAME", display_name)
        raw_desc = loc.get(f"DOCUMENT_{card_id.upper()}_DESC", desc)
        desc_vi = transform_markup(raw_desc)
        price = calculate_price("document", rarity)
        
        cards.append({
            "id": card_id,
            "type": "document",
            "nameVi": name_vi,
            "rarity": rarity,
            "descriptionVi": desc_vi,
            "price": price,
            "artworkFrameIndex": artwork_frame,
            "image": f"assets/cards/document/{card_id}.webp"
        })
    return cards

def parse_decorations(loc):
    file_path = os.path.join(CONST_DIR, "DecorationCardCatalog.cs")
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    all_match = re.search(r'public static readonly IReadOnlyList<DecorationCardDefinition> All = new List<DecorationCardDefinition>\s*\{(.+?)\};\s*(?:public|private|\})', code, re.DOTALL)
    if not all_match:
        return []
    
    calls = extract_new_calls(all_match.group(1))
    cards = []
    for call in calls:
        args = split_csharp_args(call)
        if len(args) < 5:
            continue
        card_id = clean_str(args[0])
        display_name = clean_str(args[1])
        rarity = clean_rarity(args[2])
        deco_type = args[3].replace("DecorationType.", "").strip()
        desc = clean_str(args[4])
        
        # Name resolution from loc or catalog
        name_vi = loc.get(f"DECORATION_{deco_type.upper()}_NAME", loc.get(f"DECORATION_{card_id.upper()}_NAME", display_name))
        
        # Description resolution: prefer DECORATION_{DECO_TYPE}_DESC, fallback to DECORATION_{CARD_ID}_DESC, then catalog desc
        key_desc = f"DECORATION_{deco_type.upper()}_DESC"
        raw_desc = loc.get(key_desc, loc.get(f"DECORATION_{card_id.upper()}_DESC", desc))
        desc_vi = transform_markup(raw_desc)
        price = calculate_price("decoration", rarity)
        
        cards.append({
            "id": card_id,
            "type": "decoration",
            "nameVi": name_vi,
            "rarity": rarity,
            "descriptionVi": desc_vi,
            "price": price,
            "decoType": deco_type,
            "image": f"assets/cards/decoration/{card_id}.webp"
        })
    return cards

def parse_stickers(loc):
    file_path = os.path.join(CONST_DIR, "StickerCardCatalog.cs")
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    all_match = re.search(r'public static readonly IReadOnlyList<StickerCardDefinition> All = new List<StickerCardDefinition>\s*\{(.+?)\};\s*(?:public|private|\})', code, re.DOTALL)
    if not all_match:
        return []
    
    calls = extract_new_calls(all_match.group(1))
    cards = []
    for call in calls:
        args = split_csharp_args(call)
        if len(args) < 5:
            continue
        card_id = clean_str(args[0])
        display_name = clean_str(args[1])
        rarity = clean_rarity(args[2])
        sticker_type = args[3].replace("StickerType.", "").strip()
        desc = clean_str(args[4])
        
        # Name resolution from loc
        key_name = f"STICKER_{sticker_type.upper()}_NAME"
        name_vi = loc.get(key_name, loc.get(f"{card_id.upper()}_NAME", display_name))
        
        key_desc = f"STICKER_{sticker_type.upper()}_DESC"
        raw_desc = loc.get(key_desc, desc)
        desc_vi = transform_markup(raw_desc)
        price = calculate_price("sticker", rarity)
        
        cards.append({
            "id": card_id,
            "type": "sticker",
            "nameVi": name_vi,
            "rarity": rarity,
            "descriptionVi": desc_vi,
            "price": price,
            "stickerType": sticker_type,
            "image": f"assets/cards/sticker/{card_id}.webp"
        })
    return cards

def parse_events(loc):
    file_path = os.path.join(CONST_DIR, "EventCardCatalog.cs")
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    all_match = re.search(r'public static readonly IReadOnlyList<EventCardDefinition> All = new List<EventCardDefinition>\s*\{(.+?)\};\s*(?:public|private|\})', code, re.DOTALL)
    if not all_match:
        return []
    
    calls = extract_new_calls(all_match.group(1))
    cards = []
    for call in calls:
        args = split_csharp_args(call)
        if len(args) < 4:
            continue
        card_id = clean_str(args[0])
        display_name = clean_str(args[1])
        rarity = clean_rarity(args[2])
        desc = clean_str(args[3])
        
        name_vi = loc.get(f"EVENT_{card_id.upper()}_NAME", display_name)
        raw_desc = loc.get(f"EVENT_{card_id.upper()}_DESC", desc)
        desc_vi = transform_markup(raw_desc)
        
        cards.append({
            "id": card_id,
            "type": "event",
            "nameVi": f"Sự kiện: {name_vi}",
            "rarity": rarity,
            "descriptionVi": desc_vi,
            "price": 0,
            "image": f"assets/cards/event/{card_id}.webp"
        })
    return cards

def parse_packs(loc):
    file_path = os.path.join(CONST_DIR, "PackCatalog.cs")
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    all_match = re.search(r'public static readonly IReadOnlyList<PackDefinition> All = new List<PackDefinition>\s*\{(.+?)\};\s*(?:public|private|\})', code, re.DOTALL)
    if not all_match:
        return []
    
    rarity_vi = {
        "common": "Thường",
        "rare": "Cao cấp",
        "epic": "Cực phẩm",
        "legendary": "Huyền thoại",
        "special": "Đặc biệt"
    }
    
    calls = extract_new_calls(all_match.group(1))
    cards = []
    for call in calls:
        args = split_csharp_args(call)
        if len(args) < 7:
            continue
        pack_type = args[0].replace("PackType.", "").strip()
        rarity = clean_rarity(args[1])
        raw_display = clean_str(args[2])
        price_mult = int(args[3].strip())
        draw_count = int(args[4].strip())
        select_count = int(args[5].strip())
        frame_index = int(args[6].strip())
        
        # Translate Pack Name
        lookup_key = f"PACK_{raw_display.replace(' ', '_').upper()}"
        base_name_vi = loc.get(lookup_key, raw_display)
        r_name = rarity_vi.get(rarity, rarity.capitalize())
        name_vi = f"{base_name_vi} ({r_name})"
        
        desc_format = loc.get("DESC_OPEN_PACK", "Mở {0} lá, được chọn {1} lá.")
        desc_vi = transform_markup(desc_format.format(draw_count, select_count))
        
        pack_id = f"pack_{pack_type.lower()}_{rarity}"
        cards.append({
            "id": pack_id,
            "type": "pack",
            "nameVi": name_vi,
            "rarity": rarity,
            "descriptionVi": desc_vi,
            "price": price_mult,
            "frameIndex": frame_index,
            "image": f"assets/cards/pack/{pack_id}.webp"
        })
    return cards

def validate_no_unmapped_tokens(all_cards):
    """
    Validation check: ensures no raw unmapped brackets remain in any card description or name.
    Fails the build if any raw bracket characters are detected.
    """
    errors = []
    for c in all_cards:
        desc = c.get("descriptionVi", "")
        name = c.get("nameVi", "")
        for field_name, val in [("descriptionVi", desc), ("nameVi", name)]:
            if "[" in val or "]" in val:
                matches = re.findall(r'\[.*?\]', val)
                if not matches:
                    matches = [ch for ch in val if ch in "[]"]
                errors.append((c["id"], c["type"], field_name, matches, val))
    
    if errors:
        msg_lines = ["FAIL: Found unmapped raw brackets/tokens in card data:"]
        for cid, ctype, field, tokens, d in errors:
            msg_lines.append(f"  - Card '{cid}' ({ctype}, field '{field}'): {tokens} in '{d}'")
        error_msg = "\n".join(msg_lines)
        print(error_msg, file=sys.stderr)
        raise ValueError(error_msg)
    print("✔ Validation passed: 0 unmapped raw bracket tokens found across all cards.")

def main():
    loc = load_localization()
    
    value_cards = build_value_cards(loc)
    operator_cards = build_operator_cards(loc)
    item_cards = parse_items(loc)
    course_cards = parse_courses(loc)
    doc_cards = parse_documents(loc)
    deco_cards = parse_decorations(loc)
    sticker_cards = parse_stickers(loc)
    event_cards = parse_events(loc)
    pack_cards = parse_packs(loc)
    
    all_cards = (
        value_cards +
        operator_cards +
        item_cards +
        course_cards +
        doc_cards +
        deco_cards +
        sticker_cards +
        event_cards +
        pack_cards
    )
    
    # Requirement 2: Check in build_cards.py that fails if an unmapped token appears
    validate_no_unmapped_tokens(all_cards)
    
    counts = {
        "value": len(value_cards),
        "operator": len(operator_cards),
        "item": len(item_cards),
        "course": len(course_cards),
        "document": len(doc_cards),
        "decoration": len(deco_cards),
        "sticker": len(sticker_cards),
        "event": len(event_cards),
        "pack": len(pack_cards)
    }
    
    # Generate Classic Script for window.MATHICARD
    header = (
        "// AUTO-GENERATED – do not edit, run tools/build_cards.py\n\n"
        "window.MATHICARD = window.MATHICARD || {};\n\n"
    )
    js_content = (
        f"{header}window.MATHICARD.cards = {json.dumps(all_cards, ensure_ascii=False, indent=2)};\n"
        "window.MATHICARD.cardsData = window.MATHICARD.cards;\n"
    )
    
    os.makedirs(os.path.dirname(OUTPUT_JS), exist_ok=True)
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print("=" * 60)
    print(f"Cards dictionary built successfully into {OUTPUT_JS}")
    print(f"Total cards: {len(all_cards)}")
    for k, v in counts.items():
        print(f"  - {k.capitalize()}: {v}")
    print("=" * 60)
    
    # Also sync to web/tools/build_cards.py if needed
    web_tool_path = os.path.join(BASE_DIR, "web", "tools", "build_cards.py")
    if os.path.exists(os.path.dirname(web_tool_path)):
        with open(__file__, "r", encoding="utf-8") as src, open(web_tool_path, "w", encoding="utf-8") as dst:
            dst.write(src.read())

if __name__ == "__main__":
    main()
