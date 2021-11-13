'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actividades extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Relaciones con la tabla Usuarios
      this.belongsToMany(models.Usuario, { through: 'UsuarioActividade', foreignKey: 'actividadId'});
      this.hasMany(models.UsuarioActividade, { foreignKey: 'actividadId'  });
      this.belongsTo(models.Usuario, { foreignKey: 'creadorId', as: 'creador' });

      //Relacion con la tabla de Entorno Trabajos
      this.belongsTo(models.EntornoTrabajo, { foreignKey: 'entornoId' })

      //Relacion con la tabla de comentarios
      this.hasMany(models.Comentarios, { foreignKey: 'actividadId' })

      //Relacion con la tabla de archivos
      this.hasMany(models.Archivos, { foreignKey: 'actividadId' })
    }
  };
  Actividades.init({
    titulo: DataTypes.STRING,
    contenido: DataTypes.TEXT,
    type: DataTypes.STRING,
    entornoId: DataTypes.INTEGER,
    creadorId: DataTypes.INTEGER,
    fechaEntrega: DataTypes.DATE,
    
  }, {
    sequelize,
    modelName: 'Actividades',
  });
  return Actividades;
};