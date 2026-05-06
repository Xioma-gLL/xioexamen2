const path            = require('path');
const fs              = require('fs');
const { ValidationError } = require('sequelize');
const Reserva  = require('../models/Reserva');
const Cliente  = require('../models/Cliente');

// ── Listar ────────────────────────────────────────────────────
exports.listar = async (req, res, next) => {
  try {
    const reservas = await Reserva.findAll({
      include: [{ model: Cliente, as: 'cliente', attributes: ['nombre'] }],
      order:   [['fecha', 'DESC']],
    });
    res.render('reservas/index', { titulo: 'Reservas', reservas });
  } catch (err) {
    next(err);
  }
};

// ── Formulario crear ─────────────────────────────────────────
exports.formCrear = async (req, res, next) => {
  try {
    const clientes = await Cliente.findAll({ order: [['nombre', 'ASC']] });
    res.render('reservas/form', { titulo: 'Nueva Reserva', reserva: null, clientes, errores: [] });
  } catch (err) {
    next(err);
  }
};

// ── Guardar nuevo ─────────────────────────────────────────────
exports.crear = async (req, res, next) => {
  const { fecha, id_cliente } = req.body;
  const comprobante_img = req.file ? req.file.filename : null;
  try {
    await Reserva.create({
      fecha:          fecha?.trim(),
      id_cliente:     parseInt(id_cliente, 10),
      comprobante_img,
    });
    req.session.flash = { tipo: 'success', msg: 'Reserva creada correctamente.' };
    res.redirect('/reservas');
  } catch (err) {
    // Borrar imagen subida si hubo error de validación
    if (comprobante_img) _borrarImagen(comprobante_img);
    if (err instanceof ValidationError) {
      const clientes = await Cliente.findAll({ order: [['nombre', 'ASC']] });
      const errores  = err.errors.map((e) => e.message);
      return res.render('reservas/form', { titulo: 'Nueva Reserva', reserva: null, clientes, errores });
    }
    next(err);
  }
};

// ── Formulario editar ─────────────────────────────────────────
exports.formEditar = async (req, res, next) => {
  try {
    const [reserva, clientes] = await Promise.all([
      Reserva.findByPk(req.params.id),
      Cliente.findAll({ order: [['nombre', 'ASC']] }),
    ]);
    if (!reserva) return res.redirect('/reservas');
    res.render('reservas/form', { titulo: 'Editar Reserva', reserva, clientes, errores: [] });
  } catch (err) {
    next(err);
  }
};

// ── Actualizar ────────────────────────────────────────────────
exports.actualizar = async (req, res, next) => {
  const { fecha, id_cliente } = req.body;
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) return res.redirect('/reservas');

    const nuevaImg = req.file ? req.file.filename : null;

    // Si se sube nueva imagen, borrar la anterior
    if (nuevaImg && reserva.comprobante_img) {
      _borrarImagen(reserva.comprobante_img);
    }

    await reserva.update({
      fecha:          fecha?.trim(),
      id_cliente:     parseInt(id_cliente, 10),
      comprobante_img: nuevaImg || reserva.comprobante_img,
    });

    req.session.flash = { tipo: 'success', msg: 'Reserva actualizada correctamente.' };
    res.redirect('/reservas');
  } catch (err) {
    if (err instanceof ValidationError) {
      const clientes = await Cliente.findAll({ order: [['nombre', 'ASC']] });
      const errores  = err.errors.map((e) => e.message);
      const reserva  = { id_reserva: req.params.id, fecha, id_cliente };
      return res.render('reservas/form', { titulo: 'Editar Reserva', reserva, clientes, errores });
    }
    next(err);
  }
};

// ── Eliminar ──────────────────────────────────────────────────
exports.eliminar = async (req, res, next) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (reserva) {
      if (reserva.comprobante_img) _borrarImagen(reserva.comprobante_img);
      await reserva.destroy();
    }
    req.session.flash = { tipo: 'success', msg: 'Reserva eliminada.' };
    res.redirect('/reservas');
  } catch (err) {
    next(err);
  }
};

// ── Utilitario ────────────────────────────────────────────────
function _borrarImagen(filename) {
  const ruta = path.join(__dirname, '..', '..', 'uploads', filename);
  fs.unlink(ruta, () => {});
}
