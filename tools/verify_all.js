/**
 * MATHICARD - SUITE KIỂM THỬ TỰ ĐỘNG CDP TOÀN DIỆN (web/tools/verify_all.js)
 * Chạy bằng Node.js 22 (tích hợp sẵn WebSocket native), điều khiển Google Chrome qua CDP.
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = 9888;
const BASE_URL = "http://127.0.0.1:8089/web/";
const SCREENS_DIR = path.resolve(__dirname, "../_screens");

if (!fs.existsSync(SCREENS_DIR)) {
  fs.mkdirSync(SCREENS_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ChromeCDP {
  constructor(port) {
    this.port = port;
    this.proc = null;
    this.ws = null;
    this.reqId = 0;
    this.callbacks = new Map();
    this.consoleErrors = [];
    this.consoleWarnings = [];
    this.exceptions = [];
  }

  async start() {
    const userDataDir = `/tmp/chrome_verify_${Date.now()}`;
    this.proc = spawn("google-chrome", [
      "--headless=new",
      `--remote-debugging-port=${this.port}`,
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      `--user-data-dir=${userDataDir}`,
      "about:blank"
    ]);

    for (let i = 0; i < 30; i++) {
      await sleep(200);
      try {
        const res = await fetch(`http://127.0.0.1:${this.port}/json`);
        const tabs = await res.json();
        if (tabs && tabs.length > 0) {
          const pageTab = tabs.find((t) => t.url.includes("127.0.0.1") || t.type === "page") || tabs[0];
          this.ws = new WebSocket(pageTab.webSocketDebuggerUrl);
          await new Promise((r, reject) => {
            this.ws.onopen = r;
            this.ws.onerror = reject;
          });
          this._setupListener();
          return;
        }
      } catch (e) {
        // Tiếp tục chờ
      }
    }
    throw new Error("Không thể kết nối tới Chrome qua CDP port " + this.port);
  }

  _setupListener() {
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        this.callbacks.get(msg.id)(msg);
        this.callbacks.delete(msg.id);
      } else if (msg.method === "Runtime.consoleAPICalled") {
        const type = msg.params.type;
        const text = (msg.params.args || []).map((a) => a.value || a.description || "").join(" ");
        if (type === "error") {
          this.consoleErrors.push(text);
          console.error("  [CDP CONSOLE ERROR]:", text);
        } else if (type === "warning") {
          this.consoleWarnings.push(text);
          console.warn("  [CDP CONSOLE WARN]:", text);
        }
      } else if (msg.method === "Runtime.exceptionThrown") {
        const desc = msg.params.exceptionDetails?.exception?.description || "Uncaught exception";
        this.exceptions.push(desc);
        console.error("  [CDP EXCEPTION]:", desc);
      } else if (msg.method === "Console.messageAdded") {
        const lvl = msg.params.message?.level;
        const txt = msg.params.message?.text;
        if (lvl === "error") {
          this.consoleErrors.push(txt);
          console.error("  [CDP CONSOLE MSG ERROR]:", txt);
        }
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.reqId;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, (msg) => {
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || "Eval failed");
    }
    return res.result?.value;
  }

  async setViewport(width, height, isMobile = false) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
  }

  async captureScreenshot(outputPath, clip = null) {
    const params = { format: "png" };
    if (clip) params.clip = clip;
    const res = await this.send("Page.captureScreenshot", params);
    fs.writeFileSync(outputPath, Buffer.from(res.data, "base64"));
    console.log(`  [SCREENSHOT ĐÃ LƯU]: ${path.basename(outputPath)} (${res.data.length} bytes)`);
  }

  async stop() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
    }
    if (this.proc) {
      this.proc.kill("SIGKILL");
    }
  }
}

async function runSuite() {
  console.log("===============================================================================");
  console.log("MATHICARD - BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG CDP & CHỤP SCREENSHOTS");
  console.log("===============================================================================");

  const cdp = new ChromeCDP(PORT);
  await cdp.start();

  try {
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Console.enable");

    // 1. Desktop Viewport (1440x900) - Hero Desktop
    console.log("\n[BƯỚC 1/6] Kiểm tra Desktop Viewport (1440x900)...");
    await cdp.setViewport(1440, 900, false);
    await cdp.send("Page.navigate", { url: BASE_URL });
    await sleep(2500);

    const desktopScrollW = await cdp.eval("document.documentElement.scrollWidth");
    console.log(`  Chiều rộng scroll: ${desktopScrollW}px (Yêu cầu <= 1440px)`);
    if (desktopScrollW > 1440) throw new Error(`Tràn ngang Desktop: ${desktopScrollW} > 1440`);

    await cdp.captureScreenshot(path.join(SCREENS_DIR, "hero_desktop.png"));

    // 2. Mobile Viewport (375x812) - Hero Mobile
    console.log("\n[BƯỚC 2/6] Kiểm tra Mobile Viewport (375x812)...");
    await cdp.setViewport(375, 812, true);
    await cdp.eval("window.scrollTo(0, 0)");
    await sleep(1500);

    const mobileScrollW = await cdp.eval("document.documentElement.scrollWidth");
    console.log(`  Chiều rộng scroll: ${mobileScrollW}px (Yêu cầu <= 375px)`);
    if (mobileScrollW > 375) throw new Error(`Tràn ngang Mobile ở 375px: ${mobileScrollW} > 375`);

    await cdp.captureScreenshot(path.join(SCREENS_DIR, "hero_mobile.png"));

    // 3. Chuyển về Desktop (1440x900) kiểm thử Đánh giá (Review Section)
    console.log("\n[BƯỚC 3/6] Kiểm tra Section Đánh giá & Tally điểm số (#danh-gia)...");
    await cdp.setViewport(1440, 900, false);
    await cdp.send("Page.navigate", { url: BASE_URL + "#danh-gia" });
    await sleep(2500); // Chờ animation lật thẻ và tally chạy hoàn tất

    const finalScore = await cdp.eval("document.getElementById('tally-score-number').textContent");
    console.log(`  Điểm số hiển thị sau animation: ${finalScore} (Yêu cầu: 8.5)`);
    if (finalScore !== "8.5") throw new Error(`Điểm số tally không đúng: ${finalScore} !== 8.5`);

    await cdp.captureScreenshot(path.join(SCREENS_DIR, "review_section.png"));

    // 4. Kiểm tra Section Tài liệu học thuật (#tai-lieu)
    console.log("\n[BƯỚC 4/6] Kiểm tra Section Tài liệu học thuật BTL (#tai-lieu)...");
    await cdp.send("Page.navigate", { url: BASE_URL + "#tai-lieu" });
    await sleep(1500);

    await cdp.captureScreenshot(path.join(SCREENS_DIR, "documents_section.png"));

    // Kiểm tra mở PDF Modal
    console.log("  - Kiểm tra mở modal xem PDF...");
    const openedPdf = await cdp.eval(`
      (() => {
        const btn = document.querySelector('.btn-view-pdf');
        if (!btn) return false;
        btn.click();
        return true;
      })()
    `);
    if (!openedPdf) throw new Error("Không tìm thấy nút Xem PDF");
    await sleep(800);

    const isPdfOpen = await cdp.eval("document.getElementById('pdf-modal').classList.contains('open')");
    const pdfSrc = await cdp.eval("document.getElementById('pdf-modal-iframe').src");
    console.log(`  Trạng thái PDF modal: mở=${isPdfOpen}, src=${pdfSrc}`);
    if (!isPdfOpen || !pdfSrc.includes("Dich_Ch11_12.pdf")) throw new Error("Modal PDF mở không đúng");

    // Đóng PDF modal
    await cdp.eval("document.querySelector('#pdf-modal .modal-close-btn').click()");
    await sleep(500);

    // 5. Kiểm tra Bộ sưu tập thẻ bài & Modal Chi tiết thẻ (#card-modal)
    console.log("\n[BƯỚC 5/6] Kiểm tra Thư viện thẻ bài & Card Inspector Modal...");
    // Bấm các tab lọc
    for (const cat of ["value", "operator", "spell", "all"]) {
      await cdp.eval(`document.querySelector('.tab-btn[data-category="${cat}"]')?.click()`);
      await sleep(200);
    }

    // Mở modal thẻ bài
    await cdp.eval("document.querySelector('.gallery-card')?.click()");
    await sleep(800);

    const isCardOpen = await cdp.eval("document.getElementById('card-modal').classList.contains('open')");
    console.log(`  Trạng thái Card modal: mở=${isCardOpen}`);
    if (!isCardOpen) throw new Error("Modal thẻ bài không mở được");

    await cdp.captureScreenshot(path.join(SCREENS_DIR, "card_modal.png"));

    // Đóng Card modal
    await cdp.eval("document.querySelector('#card-modal .modal-close-btn').click()");
    await sleep(500);

    // Kiểm tra mở Video modal
    console.log("  - Kiểm tra mở Trailer Video Modal...");
    await cdp.eval("document.getElementById('hero-btn-trailer')?.click()");
    await sleep(800);
    const isVideoOpen = await cdp.eval("document.getElementById('video-modal').classList.contains('open')");
    console.log(`  Trạng thái Video modal: mở=${isVideoOpen}`);
    if (!isVideoOpen) throw new Error("Modal Video trailer không mở được");
    await cdp.eval("document.querySelector('#video-modal .modal-close-btn').click()");
    await sleep(500);

    // Kiểm tra sao chép mã màu Palette Swatch (copyToClipboard)
    console.log("  - Kiểm tra sao chép mã màu bảng swatches...");
    const copyResult = await cdp.eval(`
      (() => {
        const swatch = document.querySelector('.swatch-item');
        if (!swatch) return false;
        swatch.click();
        return true;
      })()
    `);
    await sleep(300);
    console.log("  Swatch click executed successfully:", copyResult);

    // 6. Tổng kết lỗi Console & Exception
    console.log("\n[BƯỚC 6/6] Tổng kết lỗi Console & Uncaught Exceptions...");
    console.log(`  Số lỗi Console: ${cdp.consoleErrors.length}`);
    console.log(`  Số cảnh báo Console: ${cdp.consoleWarnings.length}`);
    console.log(`  Số ngoại lệ chưa bắt: ${cdp.exceptions.length}`);

    if (cdp.consoleErrors.length > 0) {
      console.error("Danh sách lỗi Console:", cdp.consoleErrors);
      throw new Error("Phát hiện lỗi Console trong quá trình chạy");
    }
    if (cdp.exceptions.length > 0) {
      console.error("Danh sách ngoại lệ:", cdp.exceptions);
      throw new Error("Phát hiện ngoại lệ chưa bắt");
    }

    console.log("\n===============================================================================");
    console.log("✔ TẤT CẢ CÁC BÀI KIỂM THỬ CDP HOÀN THÀNH XUẤT SẮC - ZERO CONSOLE ERRORS!");
    console.log("===============================================================================");
  } finally {
    await cdp.stop();
  }
}

runSuite().catch((err) => {
  console.error("\n❌ KIỂM THỬ THẤT BÀI:", err);
  process.exit(1);
});
