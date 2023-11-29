import { login } from '../models/empleadoModel.mjs';

export async function autenticarEmpleado(req, res) {
  try {
    const { codeEmpleado } = req.body;

    if (!codeEmpleado) {
      return res.status(400).json({ message: 'Código de empleado no proporcionado' });
    }

    const resultadoAutenticacion = await login(req.db, codeEmpleado);

    if (resultadoAutenticacion) {
      // Almacenar toda la información del empleado en la sesión
      req.session.empleado = resultadoAutenticacion.empleado;
      req.session.cargos = resultadoAutenticacion.cargos;

      // Redirigir al usuario a la página de inicio después de la autenticación
      res.redirect('/home');
    } else {
      return res.status(401).json({ message: 'Código de empleado no válido' });
    }
  }catch (error) {
    // Maneja los errores
    console.error(error.message);
    res.status(500).send('Error al autenticar el empleado');
  }
}