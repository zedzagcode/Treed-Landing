import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, preWarmCache } from "./static";
import { createServer } from "http";
import compression from "compression";

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");
app.use(compression());

// Health check — must be registered first, before ANY other middleware,
// so Replit's autoscale health checker always gets a fast 200.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// www → non-www canonical redirect (301)
app.use((req, res, next) => {
  if (req.hostname && req.hostname.startsWith("www.")) {
    const nonWwwHost = req.hostname.slice(4);
    const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
    return res.redirect(301, `${proto}://${nonWwwHost}${req.originalUrl}`);
  }
  next();
});

// Redirect /overview → /solution (301)
app.use((req, res, next) => {
  if (req.path === "/overview") return res.redirect(301, "/solution");
  next();
});

const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, unknown> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse)
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      log(logLine);
    }
  });

  next();
});

// Prevent silent crashes
process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled rejection:", reason);
});

const port = parseInt(process.env.PORT || "5000", 10);

// Bind the port FIRST so the health check always responds immediately,
// even if the async setup below takes time or partially fails.
httpServer.listen({ port, host: "0.0.0.0" }, () => {
  log(`serving on port ${port}`);
});

(async () => {
  try {
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error("[server] Express error handler:", err);
    });

    if (process.env.NODE_ENV === "production") {
      const distPath = serveStatic(app);
      await preWarmCache(distPath);
      log("template cache warmed");
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }
  } catch (err) {
    console.error("[server] Startup error (server still running on port " + port + "):", err);
  }
})();
