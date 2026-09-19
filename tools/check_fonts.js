/**
 * MATHICARD - FONT & TYPOGRAPHY CHECKER (check_fonts.js)
 *
 * Dev check: every element with computed font-family starting with the game font
 * (SVN-Determination-Sans) must match /^[\x00-\x7F√Σ×÷−πφ·]*$/.
 *
 * Can be run via CLI: node web/tools/check_fonts.js (or node tools/check_fonts.js)
 * Or called inside browser: window.checkFonts()
 */

function checkFonts(root = document) {
  const ALLOWED_REGEX = /^[\x00-\x7F√Σ×÷−πφ·]*$/;
  const elements = root.querySelectorAll("*");
  const violations = [];
  const compliant = [];

  for (const el of elements) {
    const computed = window.getComputedStyle(el);
    const rawFamily = computed.fontFamily || "";
    const cleanFamily = rawFamily.replace(/^['"]/, "");

    if (cleanFamily.toLowerCase().startsWith("svn-determination-sans")) {
      const text = el.textContent || "";
      if (!ALLOWED_REGEX.test(text)) {
        const illegalChars = Array.from(text).filter((ch) => !ALLOWED_REGEX.test(ch));
        violations.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className || null,
          fontFamily: rawFamily,
          text: text.length > 60 ? text.substring(0, 60) + "..." : text,
          illegalChars: [...new Set(illegalChars)]
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

  return { violations, compliant, totalInspected: elements.length };
}

if (typeof window !== "undefined") {
  window.checkFonts = checkFonts;
}

if (typeof module !== "undefined" && require.main === module) {
  const { spawn } = require("child_process");
  const path = require("path");

  const PORT = 9891;
  const BASE_URL = process.env.MATHICARD_URL || "http://127.0.0.1:8089/web/index.html";

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function run() {
    console.log("=================================================");
    console.log(" MATHICARD TYPOGRAPHY & FONT RULE VERIFICATION   ");
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
      await sleep(2000);

      // Wait for fonts ready
      await evalFn("document.fonts.ready");

      const checkExpr = `(${checkFonts.toString()})()`;
      const initialReport = await evalFn(checkExpr);

      console.log(`Inspected DOM Elements: ${initialReport.totalInspected}`);
      console.log(`Elements using SVN-Determination-Sans: ${initialReport.compliant.length + initialReport.violations.length}`);
      console.log(`Violations found: ${initialReport.violations.length}`);

      if (initialReport.violations.length > 0) {
        console.error("\n[VIOLATIONS DETECTED]:");
        for (const v of initialReport.violations) {
          console.error(` - Tag: <${v.tag}> ID: "${v.id}" Class: "${v.className}"`);
          console.error(`   Text: "${v.text}"`);
          console.error(`   Illegal characters: ${JSON.stringify(v.illegalChars)}`);
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
        await sleep(200);
        const tabReport = await evalFn(checkExpr);
        if (tabReport.violations.length > 0) {
          allViolations.push(...tabReport.violations);
        }
      }

      console.log("\nSample Compliant Elements with SVN-Determination-Sans:");
      for (const c of initialReport.compliant.slice(0, 10)) {
        console.log(` - <${c.tag}> class="${c.className}": "${c.text}"`);
      }

      console.log("-------------------------------------------------");
      if (allViolations.length === 0) {
        console.log("PASS: 0 font violations found! All game font elements conform to ASCII + math glyphs.");
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

const ALLOWED_REGEX = /^[\x00-\x7F√Σ×÷−πφ·]*$/;
checkFonts.ALLOWED_REGEX = ALLOWED_REGEX;

if (typeof module !== "undefined") {
  module.exports = { checkFonts, ALLOWED_REGEX };
}
