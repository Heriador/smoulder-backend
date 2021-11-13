const ComentarioCtrll = {}

const Comentario = require('../models/').Comentarios
const Usuario = require('../models/').Usuario
const Actividad = require('../models').Actividades


ComentarioCtrll.crear = async (req, res) => {
    const { contenido, actividadId, toUserId } = req.body
    
    try {
     const comentario = await Comentario.create({
               contenido,
               usuarioId: req.user.id,
               actividadId,
               toUserId
     })  
     
     comentario.dataValues.Usuario = req.user
     res.send(comentario)

    } catch (e) {
     res.status(400).send(e.message)
     
    }

}

ComentarioCtrll.obtener = async (req, res) => {
     const { actividadId, toUserId } = req.query

     try {
          const comentarios = await Comentario.findAll({
               where: {
                    actividadId,
                    toUserId
               },   
               include: [
                    {
                         model: Usuario,
                         attributes:{
                              exclude: ['contraseña']
                         }
                    },
                    {
                         model: Actividad
                    }
               ],
               attributes: {
                    exclude: ['usuarioId']
               }
          })
     
          res.send(comentarios)
     } catch (e) {
        res.status(400).send(e.message)
          
     }
}

ComentarioCtrll.eliminar = async (req, res) => {
     try {
          
          const comentario = await Comentario.destroy({
               where: {
                    id: req.params.id
               }
          })

          res.json({message: 'Comentario eliminado'})

     } catch (error) {
        res.status(400).send(e.message)
     
          
     }
}

module.exports = ComentarioCtrll