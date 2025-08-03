'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Expenses', 'isFromPurchaseOrder', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    await queryInterface.addColumn('Expenses', 'purchaseOrderId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'PurchaseOrders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Expenses', 'isFromPurchaseOrder');
    await queryInterface.removeColumn('Expenses', 'purchaseOrderId');
  }
};
