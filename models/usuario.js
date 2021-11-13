'use strict';

const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Relaciones con la tabla entorno Trabajo
      this.belongsToMany(models.EntornoTrabajo, { through: 'UsuarioEmpleado', foreignKey: 'usuarioId'})
      this.hasMany(models.UsuarioEmpleado, { foreignKey: 'usuarioId' })
      // this.hasMany(models.EntornoTrabajo, { foreignKey: 'creadorId' })

      //Relaciones con la tabla actividades
      this.belongsToMany(models.Actividades, { through: 'UsuarioActividade', foreignKey: 'usuarioId'})
      this.hasMany(models.UsuarioActividade, { foreignKey: 'usuarioId'})
      this.hasMany(models.Actividades, { foreignKey: 'creadorId', as: 'creador' })

      //Relacion con la tabla archivos
      this.hasMany(models.Archivos, { foreignKey: 'usuarioId' })

      //Relacion con la tabla Roles
      this.belongsTo(models.Roles, { foreignKey: 'rol', as: 'Rol' })

      //Relacion con la tabla Comentarios
      this.hasMany(models.Comentarios, { foreignKey: 'usuarioId' })
    }
  };
  Usuario.init({
    googleId: DataTypes.STRING,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    correo: DataTypes.STRING,
    contraseña: DataTypes.STRING,
    avatar: DataTypes.STRING,
    rol: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Usuario',
    getterMethods: {
      fullName() {
        return `${this.getDataValue('nombre')} ${this.getDataValue('apellido')}`
      }
    },
    hooks:{
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    }
  });
  return Usuario;
};


const hashPassword = async user => {

  if(user.changed('contraseña')){
    user.contraseña = await bcrypt.hash(user.contraseña, 10)
  }

}