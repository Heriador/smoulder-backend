const ArchivoCtrll = {};
const { uploadToBucket, deleteObject, getObjectUrl } = require('../helpers/s3');
const Archivos = require('../models').Archivos;
const UsuarioActividad = require('../models').UsuarioActividade;

ArchivoCtrll.crear = async (req, res) => {
  const { actividadId } = req.body;
  console.log(req.file.originalname);
  try {
    await uploadToBucket('smoulder-2', req.file);

    await UsuarioActividad.update(
      {
        estadoActividad: 'entregado',
      },
      {
        where: {
          actividadId,
          usuarioId: req.user.id,
        },
        field: ['estadoActividad'],
      }
    );

    const archivo = await Archivos.create({
      nombre: req.file.originalname,
      url: 'aws',
      actividadId,
      usuarioId: req.user.id,
    });

    const url = await getObjectUrl(req.file.filename);

    archivo.dataValues.url = url;

    res.send(archivo);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

ArchivoCtrll.obtener = async (req, res) => {
  const { actividadId, usuarioId } = req.query;

  try {
    const archivo = await Archivos.findOne({
      where: {
        actividadId,
        usuarioId,
      },
    });

    if (!archivo) return res.status(404).send('No se encontró el archivo');

    const url = await getObjectUrl(archivo.dataValues.nombre);

    archivo.dataValues.url = url;

    res.send(archivo);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

ArchivoCtrll.eliminar = async (req, res) => {
  try {
    const archivo = await Archivos.findByPk(req.params.id);
    console.log(archivo);

    await Archivos.destroy({
      where: {
        id: req.params.id,
      },
    });

    const [rows, results] = await UsuarioActividad.update(
      {
        estadoActividad: 'pendiente',
      },
      {
        where: {
          actividadId: req.query.actividadId,
          usuarioId: req.user.id,
        },
        field: ['estadoActividad'],
        returning: true,
      }
    );

    await deleteObject(archivo.dataValues.nombre);

    await res.json({
      message: 'Archivo eliminado',
      results,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = ArchivoCtrll;
