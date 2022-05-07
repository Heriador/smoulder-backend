const ActividadCtrll = {}
const Actividad = require('../models').Actividades
const Archivos = require('../models').Archivos
const Usuarios = require('../models').Usuario
const UsuarioActividad = require('../models').UsuarioActividade
const {uploadToBucket}  = require('../helpers/s3')


ActividadCtrll.index = async (req, res) => {
     const { entornoId } = req.query

     try {

          const actividades = await Actividad.findAll({
               where: { 
                    entornoId 
               },
               include: [
                    {
                         association: 'creador',
                         attributes: {
                              exclude: ['contraseña', 'rol']
                         },
                         as: 'actividadesCreadas'
                    },
                    
                    {
                         model: Usuarios,
                         inculde: [
                              {
                                   model: UsuarioActividad,
                                   where: {
                                        usuarioId: req.user.id
                                   }
                              }
                         ]
                        
                    },
                    {
                         model: Archivos,
                    }
               ],
               order: [['createdAt', 'ASC']]
          })
          res.json(actividades)
          
     } catch (e) {
          res.status(400).send(e.message)

     }
}

ActividadCtrll.crearActividad = async (req, res) => {
          
     const { titulo, contenido, entornoId, listaUsuarios, fecha } = req.body
     let Usuarios = []
     try {
          const actividad = await Actividad.create({
               titulo,
               contenido,
               type: 'Actividad',
               entornoId,
               creadorId: req.user.id,
               fechaEntrega: fecha
          })

          if(listaUsuarios) {
               if(Array.isArray(listaUsuarios)) {
                    Usuarios = await Promise.all(listaUsuarios.map((usuario) => {
                         return UsuarioActividad.create({
                              actividadId: actividad.id,
                              usuarioId: usuario
                         })
                    }))
                    
               }
               else{
                    const Usuario = await UsuarioActividad.create({
                         actividadId: actividad.id,
                         usuarioId: listaUsuarios
                    })
                    Usuarios.push(Usuario)
               }
          }


     
          if(req.files && req.files.length > 0) {
               if(req.files.length > 1) {
                    // console.log(req.files);
                    Promise.all(req.files.map((file) => {
                         return uploadToBucket('archivos-smoulder', file)      
                    }))
                    .then(results => {
                         const archivos = results.map(result => {
                              return {
                                   nombre: result.Key,
                                   url: result.Location,
                                   actividadId: actividad.id,
                                   usuarioId: req.user.id
                              }
                         })
                         Archivos.bulkCreate(archivos)
                         .then(archivos => {
                              actividad.dataValues.Usuarios = Usuarios
                              actividad.dataValues.Archivos = archivos
                              actividad.dataValues.creador = req.user
                              delete actividad.dataValues.creadorId
                              res.send(actividad)
                         })
                    })
               }
               else{
                    console.log(req.files);
                    uploadToBucket('archivos-smoulder', req.files[0])
                    .then(result => {
                         Archivos.create({
                              nombre: result.Key,
                              url: result.Location,
                              actividadId: actividad.id,
                              usuarioId: req.user.id
                         })
                         .then(archivo =>{
                              actividad.dataValues.Usuarios = Usuarios
                              actividad.dataValues.Archivos = archivo
                              actividad.dataValues.creador = req.user
                              delete actividad.dataValues.creadorId

                              res.send(actividad)
                         })
                         
                    })
               }
          }
          else{
               actividad.dataValues.Usuarios = Usuarios
               actividad.dataValues.creador = req.user
               delete actividad.dataValues.creadorId
               res.send(actividad)
          }
     } catch (e) {
          console.log(e);
          res.status(400).send(e.message)

     }
}

ActividadCtrll.actualizarEstadoActividad = async (req, res) => {
     try {
          const { usuarioId } = req.body

          const [rows, results] = await UsuarioActividad.update({
               estadoActividad: 'revisado'
          },{
               where: {
                    usuarioId,
                    actividadId: req.params.id
               },
               fields: ['estadoActividad'],
               returning: true
          })

          res.send(results)

     } catch (e) {
          res.status(400).send(e.message)

     }
}

ActividadCtrll.eliminarActividad = async (req, res) => {
     try {
          const rows = await Actividad.destroy({
               where: {
                    id: req.params.id
               }
          })
          res.json({eliminado: rows})
    
     } catch (e) {
          res.status(400).send(e.message)

     }
}


module.exports = ActividadCtrll