'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarioEmpleados extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Relacion con la tabla usuarios
      this.belongsTo(models.Usuario, { foreignKey: 'usuarioId'})

      //Relacion con la tabla Entorno Trabajo
      this.belongsTo(models.EntornoTrabajo, { foreignKey: 'entornoId' })

      
    }
  };
  usuarioEmpleados.init({
    usuarioId: DataTypes.INTEGER,
    entornoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsuarioEmpleado',
  });
  return usuarioEmpleados;
};