/**
 * Cache em memória simples
 */
const cacheMap = new Map();
const TTL = 5 * 60 * 1000; // 5 minutos em milissegundos

export function cache(req, res, next) {
  // Apenas faz cache de requisições GET
  if (req.method !== 'GET') {
    return next();
  }
  
  const key = req.originalUrl;
  const cachedResponse = cacheMap.get(key);
  
  if (cachedResponse && (Date.now() - cachedResponse.timestamp) < TTL) {
    console.log(`[Cache Hit] ${key}`);
    return res.json(cachedResponse.data);
  }
  
  // Intercepta res.json para salvar no cache
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`[Cache Miss] Salvando ${key}`);
    cacheMap.set(key, {
      data,
      timestamp: Date.now()
    });
    return originalJson.call(this, data);
  };
  
  next();
}
