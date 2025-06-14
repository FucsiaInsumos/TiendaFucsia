// Datos de ejemplo para testing del sistema de descuentos y distribuidores

export const sampleDiscountRules = [
  {
    name: "Descuento por volumen - 10+ unidades",
    discountType: "percentage",
    discountValue: 15,
    conditionType: "quantity",
    minQuantity: 10,
    applicableFor: "all"
  },
  {
    name: "Descuento distribuidor - Compra mayor a $500.000",
    discountType: "percentage",
    discountValue: 20,
    conditionType: "amount",
    minAmount: 500000,
    applicableFor: "distributors"
  },
  {
    name: "Descuento fijo por cantidad y monto",
    discountType: "fixed_amount",
    discountValue: 50000,
    conditionType: "both",
    minQuantity: 5,
    minAmount: 200000,
    applicableFor: "all"
  }
];

export const sampleDistributorData = {
  userId: "12345678", // Debe existir en Users con role "Distributor"
  discountPercentage: 10,
  creditLimit: 1000000,
  paymentTerm: 30,
  minimumPurchase: 100000
};

export const samplePriceCalculation = {
  items: [
    {
      productId: "product-uuid-1",
      quantity: 15
    },
    {
      productId: "product-uuid-2", 
      quantity: 5
    }
  ],
  userType: "distributors",
  userId: "12345678"
};
