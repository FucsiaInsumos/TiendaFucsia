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
  Order, OrderItem, Payment, StockMovement,
  Proveedor, PurchaseOrder, PurchaseOrderItem, CreditPaymentRecord
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
User.hasOne(Distributor, { foreignKey: 'userId', sourceKey: 'n_document', as: 'distributor' });
Distributor.belongsTo(User, { foreignKey: 'userId', targetKey: 'n_document', as: 'user' });

// Relaciones para DiscountRule
Product.hasMany(DiscountRule, { foreignKey: 'productId', as: 'discountRules' });
DiscountRule.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Category.hasMany(DiscountRule, { foreignKey: 'categoryId', as: 'discountRules' });
DiscountRule.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Relaciones para Orders
User.hasMany(Order, { foreignKey: 'userId', sourceKey: 'n_document', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', targetKey: 'n_document', as: 'customer' });

User.hasMany(Order, { foreignKey: 'cashierId', sourceKey: 'n_document', as: 'processedOrders' });
Order.belongsTo(User, { foreignKey: 'cashierId', targetKey: 'n_document', as: 'cashier' });

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

User.hasMany(StockMovement, { foreignKey: 'userId', sourceKey: 'n_document', as: 'stockMovements' });
StockMovement.belongsTo(User, { foreignKey: 'userId', targetKey: 'n_document', as: 'user' });

Order.hasMany(StockMovement, { foreignKey: 'orderId', as: 'stockMovements' });
StockMovement.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// ✅ NUEVAS RELACIONES PARA SISTEMA DE COMPRAS

// Relaciones para Proveedor
Proveedor.hasMany(PurchaseOrder, { foreignKey: 'proveedorId', as: 'purchaseOrders' });

// Relaciones para PurchaseOrder
PurchaseOrder.belongsTo(Proveedor, { foreignKey: 'proveedorId', as: 'proveedor' });
PurchaseOrder.belongsTo(User, { foreignKey: 'createdBy', targetKey: 'n_document', as: 'creator' });
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'purchaseOrderId', as: 'items' });

// Relaciones para PurchaseOrderItem
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });
PurchaseOrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
PurchaseOrderItem.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Relaciones inversas para User y Product
User.hasMany(PurchaseOrder, { foreignKey: 'createdBy', sourceKey: 'n_document', as: 'createdPurchaseOrders' });
Product.hasMany(PurchaseOrderItem, { foreignKey: 'productId', as: 'purchaseOrderItems' });

// ✅ RELACIÓN PARA STOCK MOVEMENTS CON PURCHASE ORDERS
PurchaseOrder.hasMany(StockMovement, { foreignKey: 'purchaseOrderId', as: 'stockMovements' });
StockMovement.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

// ✅ NUEVAS ASOCIACIONES PARA ABONOS DE CRÉDITOS
Payment.hasMany(CreditPaymentRecord, {
  foreignKey: 'paymentId',
  as: 'abonos'
});

CreditPaymentRecord.belongsTo(Payment, {
  foreignKey: 'paymentId',
  as: 'payment'
});

CreditPaymentRecord.belongsTo(User, {
  foreignKey: 'recordedBy',
  targetKey: 'n_document',
  as: 'recordedByUser',
  constraints: false // ✅ DESACTIVAR CONSTRAINTS para permitir NULL
});

User.hasMany(CreditPaymentRecord, {
  foreignKey: 'recordedBy',
  sourceKey: 'n_document',
  as: 'recordedPayments',
  constraints: false // ✅ DESACTIVAR CONSTRAINTS para permitir NULL
});

//---------------------------------------------------------------------------------//
// Exportar todos los modelos
module.exports = {
  ...sequelize.models,
  conn: sequelize,
  sequelize, // Para poder usarlo en otros archivos si es necesario
 
};

