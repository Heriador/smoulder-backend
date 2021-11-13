
const isJefe = (req, res, next) => {
     if (req.user.Rol.nombre === 'jefe') {
          next();
          return
     }

     return res.status(401).json({message: 'Requiere Rol de Jefe'})
}

const verifyFile = (req, res, next) => {

     if(!req.files || Object.keys(req.files).length === 0 ) {
          return res.status(400).json({message: 'No se ha enviado ningun archivo'})
     }
     
     next();
}

module.exports = {
     isJefe,
     verifyFile
}