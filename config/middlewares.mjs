// Función que envuelve las funciones asíncronas y maneja las promesas
const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

export { asyncMiddleware };
