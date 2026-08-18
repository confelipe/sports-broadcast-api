/**
 * Resposta de sucesso padronizada
 */
export function sendSuccess(res, data) {
  if (data === null || data === undefined) {
    return res.status(404).json({
      error: { message: 'Nenhum dado encontrado.', status: 404 }
    });
  }
  res.json(data);
}
