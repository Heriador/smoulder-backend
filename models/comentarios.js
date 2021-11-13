'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comentarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Relacion con la tabla usuarios
      this.belongsTo(models.Usuario, { foreignKey: 'usuarioId' })

      //Relacion con la tabla actividades
      this.belongsTo(models.Actividades, {foreignKey: 'actividadId'})
    }
  };
  Comentarios.init({
    contenido: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER,
    toUserId: DataTypes.INTEGER,
    actividadId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comentarios',
  });
  return Comentarios;
};