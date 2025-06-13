require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_DEPLOY
  } = require('../config/envs');
//-------------------------------- CONFIGURACION PARA TRABAJAR LOCALMENTE-----------------------------------
const sequelize = new Sequelize(
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
//-------------------------------------CONFIGURACION PARA EL DEPLOY---------------------------------------------------------------------
// const sequelize = new Sequelize(DB_DEPLOY , {
//       logging: false, // set to console.log to see the raw SQL queries
//       native: false, // lets Sequelize know we can use pg-native for ~30% more speed
//     }
//   );

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { 
  User, Product, Category, Distributor, DiscountRule, 
  Order, OrderItem, Payment, StockMovement
} = sequelize.models;

// Relaciones existentes
// Un producto pertenece a una categoría
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
// Una categoría tiene muchos productos
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

// Relaciones para subcategorías (relación autoreferenciada en Category)
Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parentCategory' });

// Relaciones para Distributor
User.hasOne(Distributor, { foreignKey: 'userId', as: 'distributor' });
Distributor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Relaciones para DiscountRule
Product.hasMany(DiscountRule, { foreignKey: 'productId', as: 'discountRules' });
DiscountRule.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Category.hasMany(DiscountRule, { foreignKey: 'categoryId', as: 'discountRules' });
DiscountRule.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Relaciones para Orders
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

User.hasMany(Order, { foreignKey: 'cashierId', as: 'processedOrders' });
Order.belongsTo(User, { foreignKey: 'cashierId', as: 'cashier' });

// Relaciones para OrderItems
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

DiscountRule.hasMany(OrderItem, { foreignKey: 'discountRuleId', as: 'appliedItems' });
OrderItem.belongsTo(DiscountRule, { foreignKey: 'discountRuleId', as: 'discountRule' });

// Relaciones para Payments
Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Relaciones para StockMovement
Product.hasMany(StockMovement, { foreignKey: 'productId', as: 'stockMovements' });
StockMovement.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(StockMovement, { foreignKey: 'userId', as: 'stockMovements' });
StockMovement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(StockMovement, { foreignKey: 'orderId', as: 'stockMovements' });
StockMovement.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

//---------------------------------------------------------------------------------//
// Exportar todos los modelos
module.exports = {
  ...sequelize.models,
  conn: sequelize,
  sequelize, // Para poder usarlo en otros archivos si es necesario
};
