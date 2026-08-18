/**
 * Middleware global de tratamento de erros
 */
export function errorHandler(err, req, res, next) {
  console.error('Erro na API:', err.stack);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erro interno do servidor',
      status: err.status || 500
    }
  });
}
