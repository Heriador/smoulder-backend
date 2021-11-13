'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Archivos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Relacion con la tabla actividades
      this.belongsTo(models.Actividades, {foreignKey: 'actividadId'})

      //Relacion con la tabla usuarios
      this.belongsTo(models.Usuario, {foreignKey: 'usuarioId'})

      //Relacion con la tabla UsuariosActividades
      this.hasOne(models.UsuarioActividade, {foreignKey: 'id'})

    }
  };
  Archivos.init({
    nombre: DataTypes.STRING,
    url: DataTypes.STRING,
    actividadId: DataTypes.INTEGER,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Archivos',
  });
  return Archivos;
};