const ArchivoCtrll = {}
const { uploadToBucket } = require("../helpers/s3")
const Archivos = require('../models').Archivos
const UsuarioActividad = require('../models').UsuarioActividade

ArchivoCtrll.crear = async (req,res) => {
     const { actividadId } = req.body

     try {

     const file = await  uploadToBucket('archivos-smoulder', req.file)

     await UsuarioActividad.update({
          estadoActividad: 'entregado'
     },{
          where:{
               actividadId,
               usuarioId: req.user.id
          },
          field: ['estadoActividad'],
     })

     const archivo = await Archivos.create({
          nombre: file.key,
          url: file.Location,
          actividadId,
          usuarioId: req.user.id
     })

     res.send(archivo)
          
     } catch (e) {
          res.status(400).send(e.message)

     }
}

ArchivoCtrll.obtener = async (req,res) => {
     const {actividadId, usuarioId} = req.query

     try {
          const archivo = await Archivos.findOne({
               where: {
                    actividadId,
                    usuarioId
               }
          })
          res.send(archivo)
     } catch (e) {
          res.status(400).send(e.message)
          
     }

}

ArchivoCtrll.eliminar = async (req,res) => {

    try {
          await Archivos.destroy({
               where: {
                    id: req.params.id
               }
          })

          const [rows, results] = await UsuarioActividad.update({
               estadoActividad: 'pendiente'
          },{
               where:{
                    actividadId: req.query.actividadId,
                    usuarioId: req.user.id
               },
               field: ['estadoActividad'],
               returning: true
          })

          res.json({
               message: 'Archivo eliminado',
               results
          })

    } catch (e) {
     res.status(400).send(e.message)

    }

}

module.exports = ArchivoCtrll