/**
 * =============================================================================
 * MATHICARD - BACKGROUND WEBGL SHADER (web/js/shader.js)
 * =============================================================================
 * Fullscreen animated psychedelic paint swirl background.
 * - Tự viết WebGL fragment shader nguyên bản (Domain-warped noise + Polar swirl).
 * - Tự động đọc màu từ CSS variables (--swirl-col1..4) cho phép dễ dàng đổi theme.
 * - Render ở độ phân giải 0.5x để tối ưu GPU và tạo hiệu ứng pixel art retro.
 * - Tự động tạm dừng (pause) khi ẩn tab hoặc khi hero section ra khỏi tầm nhìn.
 * - Tự động fallback sang CSS gradient nếu không có WebGL hoặc prefers-reduced-motion.
 * =============================================================================
 */

const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision mediump float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;

// Procedural 2D noise
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    // Pixelation grid: quantize UV coordinates
    vec2 pixel_grid = vec2(180.0, 110.0);
    vec2 p = floor(v_uv * pixel_grid) / pixel_grid;
    p.x *= u_resolution.x / u_resolution.y;

    // Polar swirl & rotation
    float t = u_time * 0.12;
    vec2 center = vec2(0.5 * u_resolution.x / u_resolution.y, 0.5);
    vec2 d = p - center;
    float r = length(d);
    float angle = atan(d.y, d.x);
    vec2 swirl = vec2(cos(angle + r * 1.8 - t), sin(angle + r * 1.8 - t)) * r;

    // Domain warping (fbm in fbm)
    vec2 q = vec2(fbm(swirl * 2.2 + vec2(0.0, t * 0.4)),
                  fbm(swirl * 2.2 + vec2(5.2, 1.3 - t * 0.3)));

    vec2 r_warp = vec2(fbm(swirl * 2.2 + 3.8 * q + vec2(1.7, 9.2) + 0.12 * t),
                       fbm(swirl * 2.2 + 3.8 * q + vec2(8.3, 2.8) + 0.10 * t));

    float f = fbm(swirl * 2.2 + 3.6 * r_warp);

    // Color blending from CSS palette uniforms
    vec3 col = mix(u_color1, u_color2, clamp(f * f * 3.2, 0.0, 1.0));
    col = mix(col, u_color3, clamp(length(q) * 1.1, 0.0, 1.0));
    col = mix(col, u_color4, clamp(length(r_warp.x) * 0.8, 0.0, 1.0) * 0.7);

    // Subtle retro CRT scanlines
    float scanline = sin(v_uv.y * u_resolution.y * 1.5) * 0.035;
    col -= scanline;

    // Soft vignette
    float vig = 1.0 - length(v_uv - 0.5) * 0.85;
    col *= clamp(vig, 0.25, 1.0);

    gl_FragColor = vec4(col, 1.0);
}
`;

export class SwirlShader {
  constructor(canvasId = "bg-shader-canvas") {
    this.canvas = document.getElementById(canvasId);
    this.gl = null;
    this.program = null;
    this.animationFrameId = null;
    this.startTime = performance.now();
    this.isRunning = false;
    this.isHeroVisible = true;
    this.isTabVisible = true;
    this.scale = 0.5; // Giảm tỉ lệ render 50% để tăng hiệu năng tối đa
    this.uniformLocations = {};

    this.init();
  }

  parseCssHexColor(propName, defaultHex) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(propName).trim() || defaultHex;
    let hex = raw.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    const intVal = parseInt(hex, 16);
    if (isNaN(intVal)) return [0.1, 0.2, 0.3];
    return [
      ((intVal >> 16) & 255) / 255,
      ((intVal >> 8) & 255) / 255,
      (intVal & 255) / 255
    ];
  }

  init() {
    // 1. Kiểm tra prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      this.enableCssFallback("Chế độ giảm chuyển động (prefers-reduced-motion) được bật.");
      return;
    }

    if (!this.canvas) {
      console.warn("Canvas không tồn tại, dùng CSS gradient fallback.");
      return;
    }

    // 2. Lấy ngữ cảnh WebGL
    try {
      this.gl = this.canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        preserveDrawingBuffer: false,
        powerPreference: "low-power"
      });
    } catch (e) {
      this.gl = null;
    }

    if (!this.gl) {
      this.enableCssFallback("Trình duyệt không hỗ trợ WebGL.");
      return;
    }

    // 3. Biên dịch Shaders
    const vs = this.compileShader(this.gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = this.compileShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) {
      this.enableCssFallback("Lỗi biên dịch shader.");
      return;
    }

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vs);
    this.gl.attachShader(this.program, fs);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error("Lỗi liên kết shader:", this.gl.getProgramInfoLog(this.program));
      this.enableCssFallback("Lỗi liên kết chương trình shader.");
      return;
    }

    this.gl.useProgram(this.program);

    // 4. Thiết lập Quad Geometry (Full-screen quad)
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      this.gl.STATIC_DRAW
    );

    const aPosLoc = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(aPosLoc);
    this.gl.vertexAttribPointer(aPosLoc, 2, this.gl.FLOAT, false, 0, 0);

    // 5. Lưu vị trí Uniforms
    this.uniformLocations = {
      resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
      time: this.gl.getUniformLocation(this.program, "u_time"),
      color1: this.gl.getUniformLocation(this.program, "u_color1"),
      color2: this.gl.getUniformLocation(this.program, "u_color2"),
      color3: this.gl.getUniformLocation(this.program, "u_color3"),
      color4: this.gl.getUniformLocation(this.program, "u_color4")
    };

    // 6. Đăng ký sự kiện Resize, Visibility, và Intersection
    this.setupEventListeners();
    this.resize();
    this.updateColors();
    this.start();
  }

  compileShader(type, src) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  enableCssFallback(reason) {
    console.info(`Kích hoạt CSS Background Fallback: ${reason}`);
    if (this.canvas) {
      this.canvas.style.display = "none";
    }
    document.body.classList.add("shader-fallback");
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.resize(), { passive: true });

    // Tạm dừng khi tab bị ẩn để tiết kiệm pin & GPU
    document.addEventListener("visibilitychange", () => {
      this.isTabVisible = document.visibilityState === "visible";
      this.evaluateState();
    });

    // Tạm dừng khi hero cuộn hoàn toàn ra khỏi màn hình
    const heroSection = document.getElementById("hero") || document.querySelector("header");
    if (heroSection && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isHeroVisible = entry.isIntersecting;
            this.evaluateState();
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(heroSection);
    }
  }

  evaluateState() {
    if (this.isTabVisible && this.isHeroVisible) {
      if (!this.isRunning) this.start();
    } else {
      if (this.isRunning) this.stop();
    }
  }

  resize() {
    if (!this.canvas || !this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.floor(window.innerWidth * this.scale * dpr);
    const h = Math.floor(window.innerHeight * this.scale * dpr);

    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
  }

  updateColors() {
    if (!this.gl || !this.program) return;
    const c1 = this.parseCssHexColor("--swirl-col1", "#0b1d3a");
    const c2 = this.parseCssHexColor("--swirl-col2", "#133854");
    const c3 = this.parseCssHexColor("--swirl-col3", "#2a9d8f");
    const c4 = this.parseCssHexColor("--swirl-col4", "#e76f51");

    this.gl.uniform3fv(this.uniformLocations.color1, c1);
    this.gl.uniform3fv(this.uniformLocations.color2, c2);
    this.gl.uniform3fv(this.uniformLocations.color3, c3);
    this.gl.uniform3fv(this.uniformLocations.color4, c4);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = (now) => {
      if (!this.isRunning) return;
      this.render(now);
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  render(now) {
    if (!this.gl || !this.program) return;
    const elapsed = (now - this.startTime) * 0.001;

    this.gl.uniform2f(this.uniformLocations.resolution, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.uniformLocations.time, elapsed);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
