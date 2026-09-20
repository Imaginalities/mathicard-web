/**
 * MATHICARD - FONT & TYPOGRAPHY COVERAGE CHECKER (check_fonts.js)
 *
 * Verifies:
 * 1. Single display font ("Mathicard Display" / "SVN-Determination-Sans") is used for display elements.
 * 2. Pixelify Sans is completely removed (0 elements using Pixelify Sans).
 * 3. Every character rendered in display font exists 100% in the font's cmap (no fallback glyphs).
 *
 * Can be run via CLI: node web/tools/check_fonts.js
 * Or called inside browser: window.checkFonts()
 */

function checkFonts(root = document) {
  // Exact character set present in Mathicard Display font cmap (248 glyphs)
  const CMAP_CHARS_ARRAY = [
    " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "[", "\\", "]", "^", "_", "`",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "{", "|", "}", "~", "\n", "\r", "\t", "·",
    "À", "Á", "Â", "Ã", "È", "É", "Ê", "Ì", "Í", "Ò", "Ó", "Ô", "Õ", "×", "Ù", "Ú", "Ý",
    "à", "á", "â", "ã", "è", "é", "ê", "ì", "í", "ò", "ó", "ô", "õ", "÷", "ù", "ú", "ý",
    "Ă", "ă", "Đ", "đ", "Ĩ", "ĩ", "Ũ", "ũ", "Ơ", "ơ", "Ư", "ư", "Σ", "π", "φ",
    "Ạ", "ạ", "Ả", "ả", "Ấ", "ấ", "Ầ", "ầ", "Ẩ", "ẩ", "Ẫ", "ẫ", "Ậ", "ậ", "Ắ", "ắ", "Ằ", "ằ", "Ẳ", "ẳ", "Ẵ", "ẵ", "Ặ", "ặ",
    "Ẹ", "ẹ", "Ẻ", "ẻ", "Ẽ", "ẽ", "Ế", "ế", "Ề", "ề", "Ể", "ể", "Ễ", "ễ", "Ệ", "ệ",
    "Ỉ", "ỉ", "Ị", "ị", "Ọ", "ọ", "Ỏ", "ỏ", "Ố", "ố", "Ồ", "ồ", "Ổ", "ổ", "Ỗ", "ỗ", "Ộ", "ộ",
    "Ớ", "ớ", "Ờ", "ờ", "Ở", "ở", "Ỡ", "ỡ", "Ợ", "ợ", "Ụ", "ụ", "Ủ", "ủ",
    "Ứ", "ứ", "Ừ", "ừ", "Ử", "ử", "Ữ", "ữ", "Ự", "ự", "Ỳ", "ỳ", "Ỵ", "ỵ", "Ỷ", "ỷ", "Ỹ", "ỹ",
    "−", "√", "≤", "≥", "⌈", "⌉", "⌊", "⌋", "–", "▶", "↓", "✕", "☰"
  ];
  const DISPLAY_CMAP_SET = new Set(CMAP_CHARS_ARRAY);

  const elements = root.querySelectorAll("*");
  const violations = [];
  const compliant = [];
  let pixelifyCount = 0;

  for (const el of elements) {
    const computed = window.getComputedStyle(el);
    const rawFamily = (computed.fontFamily || "").toLowerCase();

    // Check 1: Pixelify Sans must not be used anywhere
    if (rawFamily.includes("pixelify sans") || rawFamily.includes("pixelify-sans")) {
      pixelifyCount++;
      violations.push({
        type: "deprecated_font",
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: el.className || null,
        fontFamily: computed.fontFamily,
        message: "Pixelify Sans is deprecated and must be removed"
      });
      continue;
    }

    // Check 2: Elements using the display font
    const isDisplayFont = rawFamily.includes("mathicard") ||
                          rawFamily.includes("mathicard 3d") ||
                          rawFamily.includes("mathicard display");

    if (isDisplayFont) {
      // Get visible textContent of direct or text nodes
      const text = el.textContent || "";
      if (text.trim().length === 0) continue;

      const unmappedChars = [];
      for (const ch of text) {
        if (!DISPLAY_CMAP_SET.has(ch)) {
          unmappedChars.push(ch);
        }
      }

      if (unmappedChars.length > 0) {
        violations.push({
          type: "fallback_glyph",
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className || null,
          fontFamily: computed.fontFamily,
          text: text.length > 60 ? text.substring(0, 60) + "..." : text,
          illegalChars: [...new Set(unmappedChars)]
        });
      } else {
        compliant.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className || null,
          text: text.length > 30 ? text.substring(0, 30) + "..." : text
        });
      }
    }
  }

  return { violations, compliant, totalInspected: elements.length, pixelifyCount };
}

if (typeof window !== "undefined") {
  window.checkFonts = checkFonts;
  window.DISPLAY_CMAP_SET = DISPLAY_CMAP_SET;
}

if (typeof module !== "undefined" && require.main === module) {
  const { spawn } = require("child_process");
  const path = require("path");

  const PORT = 9892;
  const BASE_URL = process.env.MATHICARD_URL || "http://127.0.0.1:8089/web/index.html";

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function run() {
    console.log("=================================================");
    console.log(" MATHICARD DISPLAY FONT COVERAGE & CMAP CHECK   ");
    console.log("=================================================");
    console.log(`Target URL: ${BASE_URL}`);

    const userDataDir = `/tmp/chrome_font_check_${Date.now()}`;
    const proc = spawn("google-chrome", [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      `--user-data-dir=${userDataDir}`,
      "about:blank"
    ]);

    let ws = null;
    let reqId = 0;
    const callbacks = new Map();

    const cleanup = async () => {
      if (ws) ws.close();
      proc.kill("SIGKILL");
    };

    process.on("exit", cleanup);

    try {
      for (let i = 0; i < 30; i++) {
        await sleep(200);
        try {
          const res = await fetch(`http://127.0.0.1:${PORT}/json`);
          const tabs = await res.json();
          if (tabs && tabs.length > 0) {
            const pageTab = tabs.find((t) => t.url.includes("127.0.0.1") || t.type === "page") || tabs[0];
            ws = new WebSocket(pageTab.webSocketDebuggerUrl);
            await new Promise((r, reject) => {
              ws.onopen = r;
              ws.onerror = reject;
            });
            break;
          }
        } catch (e) {}
      }

      if (!ws) throw new Error("Could not connect to Chrome CDP");

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && callbacks.has(msg.id)) {
          callbacks.get(msg.id)(msg);
          callbacks.delete(msg.id);
        }
      };

      const send = (method, params = {}) => {
        const id = ++reqId;
        return new Promise((resolve, reject) => {
          callbacks.set(id, (msg) => {
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          });
          ws.send(JSON.stringify({ id, method, params }));
        });
      };

      const evalFn = async (expr) => {
        const res = await send("Runtime.evaluate", {
          expression: expr,
          awaitPromise: true,
          returnByValue: true
        });
        if (res.exceptionDetails) {
          throw new Error(res.exceptionDetails.exception?.description || "Eval failed");
        }
        return res.result?.value;
      };

      await send("Page.enable");
      await send("Page.navigate", { url: BASE_URL });
      await sleep(2500);

      // Wait for fonts ready
      await evalFn("document.fonts.ready");

      const checkExpr = `(${checkFonts.toString()})()`;
      const initialReport = await evalFn(checkExpr);

      console.log(`Inspected DOM Elements: ${initialReport.totalInspected}`);
      console.log(`Elements using Display Font: ${initialReport.compliant.length + initialReport.violations.length}`);
      console.log(`Elements using Pixelify Sans: ${initialReport.pixelifyCount}`);
      console.log(`Violations found: ${initialReport.violations.length}`);

      if (initialReport.violations.length > 0) {
        console.error("\n[VIOLATIONS DETECTED]:");
        for (const v of initialReport.violations) {
          console.error(` - Type: ${v.type} | Tag: <${v.tag}> ID: "${v.id}" Class: "${v.className}"`);
          if (v.illegalChars) console.error(`   Missing in cmap: ${JSON.stringify(v.illegalChars)} (Text: "${v.text}")`);
          if (v.message) console.error(`   Message: ${v.message}`);
        }
      }

      // Cycle tabs in card gallery to test operator and value cards across tabs
      const tabs = ["all", "value", "operator", "item", "event", "curse", "course", "pack", "decoration"];
      let allViolations = [...initialReport.violations];

      for (const tab of tabs) {
        await evalFn(`(() => {
          const btn = document.querySelector('.filter-tab-btn[data-category="${tab}"]') || document.querySelector('.type-filter-btn[data-type="${tab}"]');
          if (btn) btn.click();
        })()`);
        await sleep(250);
        const tabReport = await evalFn(checkExpr);
        if (tabReport.violations.length > 0) {
          for (const tv of tabReport.violations) {
            if (!allViolations.some((v) => v.id === tv.id && v.className === tv.className)) {
              allViolations.push(tv);
            }
          }
        }
      }

      console.log("\nSample Compliant Elements with Mathicard Display Font:");
      for (const c of initialReport.compliant.slice(0, 10)) {
        console.log(` - <${c.tag}> class="${c.className}": "${c.text}"`);
      }

      console.log("-------------------------------------------------");
      if (allViolations.length === 0) {
        console.log("PASS: 0 font violations! All display elements render without any fallback glyphs.");
        await cleanup();
        process.exit(0);
      } else {
        console.error(`FAIL: ${allViolations.length} violations found.`);
        await cleanup();
        process.exit(1);
      }
    } catch (err) {
      console.error("Test execution failed:", err);
      await cleanup();
      process.exit(1);
    }
  }

  run();
}

if (typeof module !== "undefined") {
  module.exports = { checkFonts };
}
