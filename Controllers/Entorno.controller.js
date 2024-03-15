const EntornoCtrll = {};
const models = require('../models');
const Usuario = models.Usuario;
const Entorno = models.EntornoTrabajo;
const UsuarioEmpleado = models.UsuarioEmpleado;
const { getObjectUrl } = require('../helpers/s3');

EntornoCtrll.index = async (req, res) => {
  try {
    const user = await Usuario.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: Entorno,
          as: 'EntornoTrabajos',
          through: { attributes: [] },
          include: [
            {
              model: Usuario,
              as: 'Usuarios',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });


    if (user) {
      for (let entorno of user.EntornoTrabajos) {
        for (let usuario of entorno.Usuarios) {
          let avatarUrl = await getObjectUrl(usuario.dataValues.avatar);
          usuario.dataValues.avatar = avatarUrl;
        }
      }
      return res.json(user.EntornoTrabajos);
    } else {
      return res.stattus(404).send({ message: 'No se encontro el usuario' });
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
};

EntornoCtrll.create = async (req, res) => {
  const { titulo, descripcion } = req.body;

  try {
    const entorno = await Entorno.create({
      titulo,
      descripcion,
      creadorId: req.user.id,
    });

    await UsuarioEmpleado.create({
      usuarioId: req.user.id,
      entornoId: entorno.id,
    });
    entorno.dataValues.creador = req.user;
    res.send(entorno);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

EntornoCtrll.unirse = async (req, res) => {
  const { entornoId } = req.body;

  try {
    await UsuarioEmpleado.create({
      usuarioId: req.user.id,
      entornoId,
    });

    const entorno = await Entorno.findOne({
      where: {
        id: entornoId,
      },
      include: [
        {
          model: Usuario,
        },
      ],
    });

    res.send(entorno);
  } catch (error) {
    res.status(400).send(e.message);
  }
};

EntornoCtrll.eliminar = async (req, res) => {
  try {
    const entorno = await Entorno.findOne({
      where: {
        id: req.params.id,
      },
    });

    await entorno.destroy();

    res.send(entorno);
  } catch (error) {
    res.status(400).send(e.message);
  }
};

module.exports = EntornoCtrll;
