/**
 * Rate Limiter simples na memória (25 reqs por minuto por IP)
 */
const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 25;

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  let record = requestCounts.get(ip);
  
  if (!record || (now - record.startTime) > WINDOW_MS) {
    // Nova janela
    record = {
      startTime: now,
      count: 1
    };
    requestCounts.set(ip, record);
    return next();
  }
  
  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: {
        message: 'Limite de requisições excedido. Tente novamente em um minuto.',
        status: 429
      }
    });
  }
  
  record.count++;
  requestCounts.set(ip, record);
  next();
}
