var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");

// src/data/initialData.ts
var INITIAL_MONITORS = [];
var INITIAL_COMPUTERS = [];
var INITIAL_PRINTERS = [];

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  const DB_FILE = import_path.default.join(process.cwd(), "data", "db.json");
  function loadDatabase() {
    try {
      if (import_fs.default.existsSync(DB_FILE)) {
        const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.monitors && parsed.computers && parsed.printers) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Error reading db.json:", err);
    }
    const defaultData = {
      monitors: INITIAL_MONITORS,
      computers: INITIAL_COMPUTERS,
      printers: INITIAL_PRINTERS
    };
    try {
      const dir = import_path.default.dirname(DB_FILE);
      if (!import_fs.default.existsSync(dir)) {
        import_fs.default.mkdirSync(dir, { recursive: true });
      }
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
    } catch (err) {
      console.error("Error creating default db.json:", err);
    }
    return defaultData;
  }
  function saveDatabase(data) {
    try {
      const dir = import_path.default.dirname(DB_FILE);
      if (!import_fs.default.existsSync(dir)) {
        import_fs.default.mkdirSync(dir, { recursive: true });
      }
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("Error saving db.json:", err);
      return false;
    }
  }
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/auth/login", (req, res) => {
    const { password, username } = req.body;
    if (password === "admin" && (!username || username === "admin")) {
      res.json({ success: true, user: { username: "admin", role: "Qu\u1EA3n tr\u1ECB vi\xEAn (Admin)" } });
    } else {
      res.status(401).json({ success: false, message: "M\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng!" });
    }
  });
  app.get("/api/data", (_req, res) => {
    const data = loadDatabase();
    res.json(data);
  });
  app.post("/api/data", (req, res) => {
    const { monitors, computers, printers } = req.body;
    if (Array.isArray(monitors) && Array.isArray(computers) && Array.isArray(printers)) {
      const ok = saveDatabase({ monitors, computers, printers });
      if (ok) {
        res.json({ success: true, message: "\u0110\xE3 l\u01B0u d\u1EEF li\u1EC7u th\xE0nh c\xF4ng" });
      } else {
        res.status(500).json({ success: false, message: "Kh\xF4ng th\u1EC3 ghi file d\u1EEF li\u1EC7u" });
      }
    } else {
      res.status(400).json({ success: false, message: "D\u1EEF li\u1EC7u g\u1EEDi l\xEAn kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng" });
    }
  });
  app.post("/api/data/reset", (_req, res) => {
    const defaultData = {
      monitors: INITIAL_MONITORS,
      computers: INITIAL_COMPUTERS,
      printers: INITIAL_PRINTERS
    };
    saveDatabase(defaultData);
    res.json({ success: true, data: defaultData });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
