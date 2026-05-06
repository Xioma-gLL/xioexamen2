const { ValidationError } = require('sequelize');
const Cliente = require('../models/Cliente');

// ── Listar ────────────────────────────────────────────────────
exports.listar = async (req, res, next) => {
  try {
    const clientes = await Cliente.findAll({ order: [['nombre', 'ASC']] });
    res.render('clientes/index', { titulo: 'Clientes', clientes });
  } catch (err) {
    next(err);
  }
};

// ── Formulario crear ─────────────────────────────────────────
exports.formCrear = (_req, res) => {
  res.render('clientes/form', { titulo: 'Nuevo Cliente', cliente: null, errores: [] });
};

// ── Guardar nuevo ─────────────────────────────────────────────
exports.crear = async (req, res, next) => {
  const { nombre } = req.body;
  try {
    await Cliente.create({ nombre: nombre?.trim() });
    req.session.flash = { tipo: 'success', msg: 'Cliente creado correctamente.' };
    res.redirect('/clientes');
  } catch (err) {
    if (err instanceof ValidationError) {
      const errores = err.errors.map((e) => e.message);
      return res.render('clientes/form', { titulo: 'Nuevo Cliente', cliente: null, errores });
    }
    next(err);
  }
};

// ── Formulario editar ─────────────────────────────────────────
exports.formEditar = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.redirect('/clientes');
    res.render('clientes/form', { titulo: 'Editar Cliente', cliente, errores: [] });
  } catch (err) {
    next(err);
  }
};

// ── Actualizar ────────────────────────────────────────────────
exports.actualizar = async (req, res, next) => {
  const { nombre } = req.body;
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.redirect('/clientes');
    await cliente.update({ nombre: nombre?.trim() });
    req.session.flash = { tipo: 'success', msg: 'Cliente actualizado correctamente.' };
    res.redirect('/clientes');
  } catch (err) {
    if (err instanceof ValidationError) {
      const errores = err.errors.map((e) => e.message);
      const cliente = { id_cliente: req.params.id, nombre };
      return res.render('clientes/form', { titulo: 'Editar Cliente', cliente, errores });
    }
    next(err);
  }
};

// ── Eliminar ──────────────────────────────────────────────────
exports.eliminar = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) await cliente.destroy();
    req.session.flash = { tipo: 'success', msg: 'Cliente eliminado.' };
    res.redirect('/clientes');
  } catch (err) {
    // Error por FK (reservas asociadas)
    req.session.flash = { tipo: 'danger', msg: 'No se puede eliminar: el cliente tiene reservas asociadas.' };
    res.redirect('/clientes');
  }
};
