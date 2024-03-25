const AuthCtrl = {};
const Usuario = require('../models').Usuario;
const Roles = require('../models').Roles;
const bcrypt = require('bcrypt');
const { appKey } = require('../Config/app');
const jwt = require('jsonwebtoken');
const { uploadToBucket, getObjectUrl } = require('../helpers/s3');

AuthCtrl.login = async (req, res) => {
  const { correo, contraseña } = req.body;
  console.log(req.body);
  
  try {
    const user = await Usuario.findOne({
      where: {
        correo,
      },
      include: [
        {
          model: Roles,
          as: 'Rol',
        },
      ],
      attributes: {
        exclude: ['rol'],
      },
    });

    if (!user) {
      return res.status(404).json({ Error: 'User not found' });
    }
    if (!bcrypt.compareSync(contraseña, user.contraseña)) {
      return res.status(401).json({ Error: 'Incorrect Password' });
    }

    if(user.dataValues.avatar){
      const avatarUrl = await getObjectUrl(user.dataValues.avatar);
      user.dataValues.avatar = avatarUrl;
    }

    const userWithToken = generateToken(user.get({ raw: true }));
    res.send(userWithToken);
  } catch (e) {
    console.log(e);
    
    res.status(400).send(e);
  }
};

AuthCtrl.register = async (req, res) => {
  const { nombre, apellido, correo, contraseña, rol } = req.body;

  try {
    const user = await Usuario.create({
      nombre,
      apellido,
      correo,
      contraseña,
      rol,
    });
    console.log(user);
    

    if(!user){
      return res.status(400).send({Error: 'Error creating user'})
    }

    const rolUser = await Roles.findOne({
      where: {
        id: rol,
      },
    });

    user.dataValues.Rol = rolUser;
    delete user.dataValues.rol;

    const userWithToken = generateToken(user.get({ raw: true }));
    res.send(userWithToken);
  } catch (e) {
    res.status(400).send(e.errors[0].message);
  }
};

AuthCtrl.update = async (req, res) => {
  const { nombre, apellido, correo, contraseña } = req.body;

  try {
    //delete req.body.bucketName;
    let imagen = {};
    if (req.files) {
      await uploadToBucket('smoulder-2', req.files[0]);
      imagen = await getObjectUrl(req.files[0].filename);
      req.body.avatar = req.files[0].filename;
    }

    const [row, results] = await Usuario.update(req.body, {
      where: {
        id: req.user.id,
      },
      fields: [
        nombre ? 'nombre' : null,
        apellido ? 'apellido' : null,
        correo ? 'correo' : null,
        contraseña ? 'contraseña' : null,
        imagen ? 'avatar' : null,
      ],
      individualHooks: true,
      returning: true,
    });

    const Rol = await Roles.findOne({
      where: {
        id: results[0].dataValues.rol,
      },
    });

    delete results[0].dataValues.rol;
    results[0].dataValues.Rol = Rol.dataValues;
    results[0].dataValues.avatar = imagen;
    res.send(results[0]);
  } catch (e) {
    res.status(400).send(e);
  }
};

const generateToken = (user) => {
  delete user.contraseña;

  const token = jwt.sign(user, appKey, { expiresIn: 86400 });

  return { ...{ user }, ...{ token } };
};

module.exports = AuthCtrl;
