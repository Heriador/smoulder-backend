'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entornoTrabajos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Relacion con la tabla Usuarios
      this.belongsToMany(models.Usuario, { through: 'UsuarioEmpleado', foreignKey: 'entornoId' })
      this.belongsTo(models.Usuario, { foreignKey: 'creadorId' })
      this.hasMany(models.UsuarioEmpleado, { foreignKey: 'entornoId' })

      //Relacion con la tabla actividades
      this.hasMany(models.Actividades, { foreignKey: 'entornoId' })
    }
  };
  entornoTrabajos.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    creadorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EntornoTrabajo',
  });
  return entornoTrabajos;
};