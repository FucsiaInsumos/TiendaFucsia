import {
  DASHBOARD_LOADING,
  DASHBOARD_ERROR,
  GET_DASHBOARD_STATS_SUCCESS,
  GET_SALES_CHART_SUCCESS,
  GET_WEEKLY_SALES_SUCCESS,
  GET_MONTHLY_SALES_SUCCESS,
  GET_REVENUE_STATS_SUCCESS,
  GET_PRODUCT_STATS_SUCCESS,
  GET_TOP_CUSTOMERS_SUCCESS
} from '../Actions/dashboardActions';

const initialState = {
  loading: false,
  error: null,
  
  // Estadísticas generales
  stats: {
    sales: {
      daily: { total: 0, orders: 0 },
      monthly: { total: 0, orders: 0 }
    },
    inventory: {
      lowStockProducts: 0,
      topProducts: []
    },
    orders: {
      pending: 0
    },
    payments: {
      pending: { count: 0, amount: 0 }
    },
    customers: {
      newThisMonth: 0
    }
  },
  
  // Gráficos de ventas
  salesChart: {
    period: 'month',
    dateFormat: 'day',
    salesData: []
  },
  
  // Ventas semanales
  weeklySales: {
    period: 'week',
    startDate: null,
    endDate: null,
    weeklyData: []
  },
  
  // Ventas mensuales
  monthlySales: {
    period: 'month',
    year: new Date().getFullYear(),
    monthlyData: []
  },
  
  // Estadísticas de ingresos
  revenueStats: {
    period: 'month',
    current: {
      revenue: 0,
      cost: 0,
      profit: 0,
      orders: 0,
      profitMargin: 0
    },
    previous: {
      revenue: 0,
      cost: 0,
      profit: 0,
      orders: 0
    },
    growth: {
      revenue: 0,
      profit: 0
    }
  },
  
  // Estadísticas de productos
  productStats: {
    period: 'month',
    topSelling: [],
    bestMargin: []
  },
  
  // Top clientes
  topCustomers: {
    period: 'month',
    topByAmount: [],
    topByOrders: []
  }
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case DASHBOARD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case GET_DASHBOARD_STATS_SUCCESS:
      return {
        ...state,
        stats: action.payload
      };
      
    case GET_SALES_CHART_SUCCESS:
      return {
        ...state,
        salesChart: action.payload
      };
      
    case GET_WEEKLY_SALES_SUCCESS:
      return {
        ...state,
        weeklySales: action.payload
      };
      
    case GET_MONTHLY_SALES_SUCCESS:
      return {
        ...state,
        monthlySales: action.payload
      };
      
    case GET_REVENUE_STATS_SUCCESS:
      return {
        ...state,
        revenueStats: action.payload
      };
      
    case GET_PRODUCT_STATS_SUCCESS:
      return {
        ...state,
        productStats: action.payload
      };
      
    case GET_TOP_CUSTOMERS_SUCCESS:
      return {
        ...state,
        topCustomers: action.payload
      };
      
    default:
      return state;
  }
};

export default dashboardReducer;
