--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Cotizacions_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Cotizacions_status" AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'expired'
);


ALTER TYPE public."enum_Cotizacions_status" OWNER TO postgres;

--
-- Name: enum_DiscountRules_applicableFor; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_DiscountRules_applicableFor" AS ENUM (
    'all',
    'customers',
    'distributors'
);


ALTER TYPE public."enum_DiscountRules_applicableFor" OWNER TO postgres;

--
-- Name: enum_DiscountRules_conditionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_DiscountRules_conditionType" AS ENUM (
    'quantity',
    'amount',
    'both'
);


ALTER TYPE public."enum_DiscountRules_conditionType" OWNER TO postgres;

--
-- Name: enum_DiscountRules_discountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_DiscountRules_discountType" AS ENUM (
    'percentage',
    'fixed_amount'
);


ALTER TYPE public."enum_DiscountRules_discountType" OWNER TO postgres;

--
-- Name: enum_Expenses_categoryType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Expenses_categoryType" AS ENUM (
    'servicios',
    'empleados',
    'limpieza',
    'mantenimiento',
    'oficina',
    'marketing',
    'transporte',
    'otros'
);


ALTER TYPE public."enum_Expenses_categoryType" OWNER TO postgres;

--
-- Name: enum_Expenses_paymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Expenses_paymentMethod" AS ENUM (
    'efectivo',
    'transferencia',
    'tarjeta',
    'cheque',
    'credito'
);


ALTER TYPE public."enum_Expenses_paymentMethod" OWNER TO postgres;

--
-- Name: enum_Expenses_recurringFrequency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Expenses_recurringFrequency" AS ENUM (
    'mensual',
    'trimestral',
    'semestral',
    'anual'
);


ALTER TYPE public."enum_Expenses_recurringFrequency" OWNER TO postgres;

--
-- Name: enum_Expenses_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Expenses_status" AS ENUM (
    'pendiente',
    'pagado',
    'cancelado'
);


ALTER TYPE public."enum_Expenses_status" OWNER TO postgres;

--
-- Name: enum_Orders_orderType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_orderType" AS ENUM (
    'local',
    'online',
    'distributor'
);


ALTER TYPE public."enum_Orders_orderType" OWNER TO postgres;

--
-- Name: enum_Orders_paymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_paymentStatus" AS ENUM (
    'pending',
    'partial',
    'completed',
    'failed'
);


ALTER TYPE public."enum_Orders_paymentStatus" OWNER TO postgres;

--
-- Name: enum_Orders_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_status" AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'completed',
    'confirmed'
);


ALTER TYPE public."enum_Orders_status" OWNER TO postgres;

--
-- Name: enum_Payments_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Payments_method" AS ENUM (
    'wompi',
    'nequi',
    'bancolombia',
    'efectivo',
    'tarjeta',
    'credito',
    'daviplata',
    'combinado'
);


ALTER TYPE public."enum_Payments_method" OWNER TO postgres;

--
-- Name: enum_Payments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Payments_status" AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded',
    'partial'
);


ALTER TYPE public."enum_Payments_status" OWNER TO postgres;

--
-- Name: enum_PurchaseOrders_paymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_PurchaseOrders_paymentStatus" AS ENUM (
    'pendiente',
    'parcial',
    'pagada'
);


ALTER TYPE public."enum_PurchaseOrders_paymentStatus" OWNER TO postgres;

--
-- Name: enum_PurchaseOrders_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_PurchaseOrders_status" AS ENUM (
    'pendiente',
    'recibida',
    'parcial',
    'completada',
    'cancelada'
);


ALTER TYPE public."enum_PurchaseOrders_status" OWNER TO postgres;

--
-- Name: enum_StockMovements_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_StockMovements_type" AS ENUM (
    'entrada',
    'salida',
    'ajuste',
    'transferencia'
);


ALTER TYPE public."enum_StockMovements_type" OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'Customer',
    'Distributor',
    'Cashier',
    'Owner'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

--
-- Name: enum_Users_sfiscalregime; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_sfiscalregime" AS ENUM (
    '48',
    '49'
);


ALTER TYPE public."enum_Users_sfiscalregime" OWNER TO postgres;

--
-- Name: enum_Users_sfiscalresponsibilities; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_sfiscalresponsibilities" AS ENUM (
    'O-13',
    'O-15',
    'O-23',
    'O-47',
    'R-99-PN'
);


ALTER TYPE public."enum_Users_sfiscalresponsibilities" OWNER TO postgres;

--
-- Name: enum_Users_stributaryidentificationkey; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_stributaryidentificationkey" AS ENUM (
    'O-1',
    'O-4',
    'ZZ',
    'ZA'
);


ALTER TYPE public."enum_Users_stributaryidentificationkey" OWNER TO postgres;

--
-- Name: enum_Users_wdoctype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_wdoctype" AS ENUM (
    'RC',
    'TI',
    'CC',
    'TE',
    'CE',
    'NIT',
    'PAS',
    'DEX',
    'PEP',
    'PPT',
    'FI',
    'NUIP'
);


ALTER TYPE public."enum_Users_wdoctype" OWNER TO postgres;

--
-- Name: enum_Users_wlegalorganizationtype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_wlegalorganizationtype" AS ENUM (
    'person',
    'company'
);


ALTER TYPE public."enum_Users_wlegalorganizationtype" OWNER TO postgres;

--
-- Name: enum_credit_payment_records_paymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_credit_payment_records_paymentMethod" AS ENUM (
    'efectivo',
    'transferencia',
    'tarjeta'
);


ALTER TYPE public."enum_credit_payment_records_paymentMethod" OWNER TO postgres;

--
-- Name: enum_purchase_payments_paymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_purchase_payments_paymentMethod" AS ENUM (
    'efectivo',
    'transferencia',
    'cheque',
    'tarjeta_credito',
    'tarjeta_debito',
    'pse',
    'credito',
    'otro'
);


ALTER TYPE public."enum_purchase_payments_paymentMethod" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Catalogos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Catalogos" (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Catalogos" OWNER TO postgres;

--
-- Name: Catalogos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Catalogos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Catalogos_id_seq" OWNER TO postgres;

--
-- Name: Catalogos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Catalogos_id_seq" OWNED BY public."Catalogos".id;


--
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "isActive" boolean DEFAULT true,
    "parentId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- Name: Compras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Compras" (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Compras" OWNER TO postgres;

--
-- Name: Compras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Compras_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Compras_id_seq" OWNER TO postgres;

--
-- Name: Compras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Compras_id_seq" OWNED BY public."Compras".id;


--
-- Name: Cotizacions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cotizacions" (
    id uuid NOT NULL,
    "userId" character varying(255) NOT NULL,
    total numeric(10,2) NOT NULL,
    status public."enum_Cotizacions_status" DEFAULT 'pending'::public."enum_Cotizacions_status",
    "validUntil" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Cotizacions" OWNER TO postgres;

--
-- Name: DetalleCotizacions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DetalleCotizacions" (
    id uuid NOT NULL,
    "quoteId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."DetalleCotizacions" OWNER TO postgres;

--
-- Name: DiscountRules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DiscountRules" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    "discountType" public."enum_DiscountRules_discountType" NOT NULL,
    "discountValue" numeric(10,2) NOT NULL,
    "conditionType" public."enum_DiscountRules_conditionType" NOT NULL,
    "minQuantity" integer,
    "minAmount" numeric(10,2),
    "maxQuantity" integer,
    "maxAmount" numeric(10,2),
    "applicableFor" public."enum_DiscountRules_applicableFor" DEFAULT 'all'::public."enum_DiscountRules_applicableFor" NOT NULL,
    "productId" uuid,
    "categoryId" uuid,
    "startDate" timestamp with time zone,
    "endDate" timestamp with time zone,
    "isActive" boolean DEFAULT true,
    priority integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."DiscountRules" OWNER TO postgres;

--
-- Name: Distributors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Distributors" (
    id uuid NOT NULL,
    "userId" character varying(255) NOT NULL,
    "discountPercentage" numeric(5,2) DEFAULT 0 NOT NULL,
    "creditLimit" numeric(10,2) DEFAULT 0,
    "currentCredit" numeric(10,2) DEFAULT 0,
    "paymentTerm" integer DEFAULT 30,
    "minimumPurchase" numeric(10,2) DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Distributors" OWNER TO postgres;

--
-- Name: Expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Expenses" (
    id uuid NOT NULL,
    "expenseNumber" character varying(255) NOT NULL,
    "categoryType" public."enum_Expenses_categoryType" NOT NULL,
    description character varying(255) NOT NULL,
    amount numeric(12,2) NOT NULL,
    "expenseDate" timestamp with time zone NOT NULL,
    "paymentMethod" public."enum_Expenses_paymentMethod" DEFAULT 'efectivo'::public."enum_Expenses_paymentMethod" NOT NULL,
    vendor character varying(255),
    "invoiceNumber" character varying(255),
    "receiptUrl" character varying(255),
    notes text,
    status public."enum_Expenses_status" DEFAULT 'pendiente'::public."enum_Expenses_status" NOT NULL,
    "dueDate" timestamp with time zone,
    "createdBy" character varying(255) NOT NULL,
    "approvedBy" character varying(255),
    "approvedAt" timestamp with time zone,
    "isRecurring" boolean DEFAULT false,
    "recurringFrequency" public."enum_Expenses_recurringFrequency",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isFromPurchaseOrder" boolean DEFAULT false,
    "purchaseOrderId" uuid
);


ALTER TABLE public."Expenses" OWNER TO postgres;

--
-- Name: OrderItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItems" (
    id uuid NOT NULL,
    "orderId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "appliedDiscount" numeric(10,2) DEFAULT 0,
    subtotal numeric(10,2) NOT NULL,
    "discountRuleId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."OrderItems" OWNER TO postgres;

--
-- Name: Orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Orders" (
    id uuid NOT NULL,
    "orderNumber" character varying(255) NOT NULL,
    "userId" character varying(255) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    discount numeric(10,2) DEFAULT 0,
    tax numeric(10,2) DEFAULT 0,
    total numeric(10,2) NOT NULL,
    status public."enum_Orders_status" DEFAULT 'pending'::public."enum_Orders_status" NOT NULL,
    "paymentStatus" public."enum_Orders_paymentStatus" DEFAULT 'pending'::public."enum_Orders_paymentStatus" NOT NULL,
    "orderType" public."enum_Orders_orderType" NOT NULL,
    "cashierId" character varying(255),
    notes text,
    "shippingAddress" jsonb,
    "appliedDiscounts" json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Orders" OWNER TO postgres;

--
-- Name: Payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payments" (
    id uuid NOT NULL,
    "orderId" uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    method public."enum_Payments_method" NOT NULL,
    status public."enum_Payments_status" DEFAULT 'pending'::public."enum_Payments_status",
    "paymentDetails" jsonb,
    "dueDate" timestamp with time zone,
    "transactionId" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Payments" OWNER TO postgres;

--
-- Name: Products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Products" (
    id uuid NOT NULL,
    sku character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "purchasePrice" numeric(10,2) NOT NULL,
    price numeric(10,2) NOT NULL,
    "distributorPrice" numeric(10,2),
    stock integer DEFAULT 0 NOT NULL,
    "minStock" integer DEFAULT 5,
    "isPromotion" boolean DEFAULT false,
    "isFacturable" boolean DEFAULT false,
    "promotionPrice" numeric(10,2),
    "categoryId" uuid NOT NULL,
    tags character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    image_url character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    "specificAttributes" jsonb,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Products" OWNER TO postgres;

--
-- Name: Proveedors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Proveedors" (
    id uuid NOT NULL,
    nombre character varying(255) NOT NULL,
    nit character varying(255),
    contacto character varying(255),
    telefono character varying(255),
    email character varying(255),
    direccion text,
    "terminosPago" character varying(255) DEFAULT 'Contado'::character varying,
    "isActive" boolean DEFAULT true,
    notas text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Proveedors" OWNER TO postgres;

--
-- Name: PurchaseOrderItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrderItems" (
    id uuid NOT NULL,
    "purchaseOrderId" uuid NOT NULL,
    "productId" uuid,
    "productName" character varying(255) NOT NULL,
    "productSku" character varying(255),
    "productDescription" text,
    "categoryId" uuid,
    cantidad integer NOT NULL,
    "cantidadRecibida" integer DEFAULT 0 NOT NULL,
    "precioUnitario" numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    "precioVentaSugerido" numeric(10,2),
    "precioDistribuidorSugerido" numeric(10,2),
    "stockMinimo" integer DEFAULT 5,
    "isNewProduct" boolean DEFAULT false,
    notas text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PurchaseOrderItems" OWNER TO postgres;

--
-- Name: PurchaseOrders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrders" (
    id uuid NOT NULL,
    "orderNumber" character varying(255) NOT NULL,
    "proveedorId" uuid NOT NULL,
    "fechaCompra" timestamp with time zone NOT NULL,
    "numeroFactura" character varying(255),
    subtotal numeric(10,2) DEFAULT 0 NOT NULL,
    impuestos numeric(10,2) DEFAULT 0 NOT NULL,
    descuentos numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) NOT NULL,
    status public."enum_PurchaseOrders_status" DEFAULT 'pendiente'::public."enum_PurchaseOrders_status",
    "metodoPago" character varying(255),
    "fechaVencimiento" timestamp with time zone,
    "archivoComprobante" character varying(255),
    notas text,
    "createdBy" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "paymentStatus" public."enum_PurchaseOrders_paymentStatus" DEFAULT 'pendiente'::public."enum_PurchaseOrders_paymentStatus",
    "totalPaid" numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public."PurchaseOrders" OWNER TO postgres;

--
-- Name: StockMovements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockMovements" (
    id uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer NOT NULL,
    type public."enum_StockMovements_type" NOT NULL,
    reason character varying(255) NOT NULL,
    "previousStock" integer NOT NULL,
    "currentStock" integer NOT NULL,
    "userId" character varying(255) NOT NULL,
    "orderId" uuid,
    "purchaseOrderId" uuid,
    notes text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."StockMovements" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    n_document character varying(255) NOT NULL,
    wdoctype public."enum_Users_wdoctype",
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255),
    city character varying(255),
    role public."enum_Users_role" DEFAULT 'Customer'::public."enum_Users_role",
    "isActive" boolean DEFAULT true,
    wlegalorganizationtype public."enum_Users_wlegalorganizationtype" DEFAULT 'person'::public."enum_Users_wlegalorganizationtype",
    scostumername character varying(255),
    stributaryidentificationkey public."enum_Users_stributaryidentificationkey" DEFAULT 'O-1'::public."enum_Users_stributaryidentificationkey",
    sfiscalresponsibilities public."enum_Users_sfiscalresponsibilities" DEFAULT 'R-99-PN'::public."enum_Users_sfiscalresponsibilities",
    sfiscalregime public."enum_Users_sfiscalregime" DEFAULT '48'::public."enum_Users_sfiscalregime",
    "deletedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: credit_payment_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_payment_records (
    id uuid NOT NULL,
    "paymentId" uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    "paymentMethod" public."enum_credit_payment_records_paymentMethod" DEFAULT 'efectivo'::public."enum_credit_payment_records_paymentMethod" NOT NULL,
    notes text,
    "recordedBy" character varying(255) DEFAULT NULL::character varying,
    "recordedAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.credit_payment_records OWNER TO postgres;

--
-- Name: purchase_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_payments (
    id uuid NOT NULL,
    "purchaseOrderId" uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    "paymentMethod" public."enum_purchase_payments_paymentMethod" NOT NULL,
    "paymentDate" timestamp with time zone NOT NULL,
    reference character varying(255),
    notes text,
    "createdBy" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.purchase_payments OWNER TO postgres;

--
-- Name: COLUMN purchase_payments.reference; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.purchase_payments.reference IS 'Referencia del pago (número de transferencia, cheque, etc.)';


--
-- Name: Catalogos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Catalogos" ALTER COLUMN id SET DEFAULT nextval('public."Catalogos_id_seq"'::regclass);


--
-- Name: Compras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Compras" ALTER COLUMN id SET DEFAULT nextval('public."Compras_id_seq"'::regclass);


--
-- Data for Name: Catalogos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Catalogos" (id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Categories" (id, name, description, "isActive", "parentId", "createdAt", "updatedAt") FROM stdin;
b4a7619f-55b3-4566-816a-e79aebb4f74e	Micropigmentacion	Categoría: Micropigmentacion	t	\N	2025-07-22 20:01:45.075+00	2025-07-22 20:01:45.075+00
a775e55d-09b6-4afe-ace3-681554fbdcc2	Cejas	Categoría: Cejas	t	\N	2025-07-22 20:01:45.249+00	2025-07-22 20:01:45.249+00
a57c55f9-082e-4892-8cf0-07a34fd02dd0	Organización	Categoría: Organización	t	\N	2025-07-22 20:01:45.418+00	2025-07-22 20:01:45.418+00
e86d4c63-095c-4cd0-a95e-db06bae5bc73	Pestañas	Categoría: Pestañas	t	\N	2025-07-22 20:01:45.596+00	2025-07-22 20:01:45.596+00
bc7fc608-2973-459e-b80a-36ff904e88ba	Accesorios	Categoría: Accesorios	t	\N	2025-07-22 20:01:45.763+00	2025-07-22 20:01:45.763+00
897e7357-2084-426f-b7c0-5d567cc2115c	Piel	Categoría: Piel	t	\N	2025-07-22 20:01:45.935+00	2025-07-22 20:01:45.935+00
4ddfab51-dd1b-4d51-a43a-0ca7c9aea258	Labios	Categoría: Labios	t	\N	2025-07-22 20:01:46.094+00	2025-07-22 20:01:46.094+00
fd89886f-e5ea-4f7c-bd96-45efb9d5b5fa	HidraLips	Categoría: HidraLips	t	\N	2025-07-22 20:01:46.262+00	2025-07-22 20:01:46.262+00
e9f1935a-78f9-4973-9715-6422f94cc3bf	Agujas-Micropigmentacion	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:46.438+00	2025-07-22 20:01:46.438+00
46a5e4d8-7485-41ad-a5c9-bb742cefd405	Dermografos	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:46.606+00	2025-07-22 20:01:46.606+00
25e060f2-df20-4e3f-8b90-496ce70629e5	Henna	Subcategoría de Cejas	t	a775e55d-09b6-4afe-ace3-681554fbdcc2	2025-07-22 20:01:46.794+00	2025-07-22 20:01:46.794+00
19c08dc4-4431-4644-81bb-e421f31bfc5c	Carritos	Subcategoría de Organización	t	a57c55f9-082e-4892-8cf0-07a34fd02dd0	2025-07-22 20:01:46.97+00	2025-07-22 20:01:46.97+00
3c196b55-5493-4ad3-a326-caf63389974b	Anestesias	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:47.134+00	2025-07-22 20:01:47.134+00
5efe5221-b32e-413b-8672-73ec8f98d028	Cintas	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:47.315+00	2025-07-22 20:01:47.315+00
2b0301fc-990c-4bcf-83dc-85b47de5d64d	Pieles Sinteticas	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:47.477+00	2025-07-22 20:01:47.477+00
91a2beaf-477e-40ee-bda8-854de5f3883f	Accesorios-Pestañas	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:47.648+00	2025-07-22 20:01:47.648+00
c2aae64d-2b82-48f4-ab82-dd630f31a694	Pinza	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:47.818+00	2025-07-22 20:01:47.818+00
f913302c-298a-4f30-ab76-b0365d06ce56	Marcacion	Subcategoría de Cejas	t	a775e55d-09b6-4afe-ace3-681554fbdcc2	2025-07-22 20:01:47.99+00	2025-07-22 20:01:47.99+00
89bc690a-31cd-440c-92c7-4867c5094801	Accesorios-Cejas	Subcategoría de Cejas	t	a775e55d-09b6-4afe-ace3-681554fbdcc2	2025-07-22 20:01:48.164+00	2025-07-22 20:01:48.164+00
94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	Depilacion	Subcategoría de Cejas	t	a775e55d-09b6-4afe-ace3-681554fbdcc2	2025-07-22 20:01:48.332+00	2025-07-22 20:01:48.332+00
35639cb3-1245-43f2-bf67-ce263b87f768	Pinceles	Subcategoría de Cejas	t	a775e55d-09b6-4afe-ace3-681554fbdcc2	2025-07-22 20:01:48.497+00	2025-07-22 20:01:48.497+00
f838182e-a7e3-42e3-ae14-fcb221a00edb	Laminado	Subcategoría de Cejas	t	a775e55d-09b6-4afe-ace3-681554fbdcc2	2025-07-22 20:01:48.662+00	2025-07-22 20:01:48.662+00
eb5d9a56-9b4e-4446-bbae-fe6285b163ef	Microblading	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:48.824+00	2025-07-22 20:01:48.824+00
4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	Pestaña	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:48.993+00	2025-07-22 20:01:48.993+00
6df4b718-38b4-4c79-9142-04b043b41d3b	Consumibles	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:49.165+00	2025-07-22 20:01:49.165+00
675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	Limpieza-Pestañas	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:49.332+00	2025-07-22 20:01:49.332+00
6109c404-c644-42ae-966d-4c3fd0264331	Adhesivos	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:49.504+00	2025-07-22 20:01:49.504+00
9b91b329-7b38-484d-9ff1-05ff19e99a77	Bonder	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:49.674+00	2025-07-22 20:01:49.674+00
bd019c40-c16e-4c76-a6a7-c5f3c8262967	Removedores	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:49.84+00	2025-07-22 20:01:49.84+00
a5ca359e-b2a9-4fcc-9089-cd561bb75526	Lifting	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:50.005+00	2025-07-22 20:01:50.005+00
80f51444-e4d0-49d6-b00b-d1f3a16869cb	Fotografia	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:50.17+00	2025-07-22 20:01:50.17+00
db6b0d86-a6b0-4220-9994-9e66a63d7e78	Aerografos	Subcategoría de Cejas	t	a775e55d-09b6-4afe-ace3-681554fbdcc2	2025-07-22 20:01:50.333+00	2025-07-22 20:01:50.333+00
80fbe3d4-73e6-4322-89aa-538b0940a416	Hidratacion-Micropigmentacion	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:50.501+00	2025-07-22 20:01:50.501+00
31c49144-e352-4c71-b743-2af1f537cf48	Anillos-Pestañas	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:50.685+00	2025-07-22 20:01:50.685+00
de7923ed-199b-49a7-acbc-7d5c95602030	Accesorios-Micropigmentacion	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:50.86+00	2025-07-22 20:01:50.86+00
82cc227d-8d5e-44a6-976b-6cc94c8945cf	Anillos-Micropigmentacion	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:51.034+00	2025-07-22 20:01:51.034+00
56ce58c6-380f-4fa9-8500-b2b302dc92a0	Accesorios-varios	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:51.225+00	2025-07-22 20:01:51.225+00
aa47efdd-6485-45b1-b1f6-cde44e771a89	Acrilicos	Subcategoría de Organización	t	a57c55f9-082e-4892-8cf0-07a34fd02dd0	2025-07-22 20:01:51.415+00	2025-07-22 20:01:51.415+00
ee4b89d5-f19b-48b5-9b69-e8d764849d83	Lifing	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:51.584+00	2025-07-22 20:01:51.584+00
a8bc7e68-cf10-4d78-aa09-1e589e3a03ce	Agujas-Piel	Subcategoría de Piel	t	897e7357-2084-426f-b7c0-5d567cc2115c	2025-07-22 20:01:51.747+00	2025-07-22 20:01:51.747+00
87f3bbdb-980d-4f28-9bc4-b9022639904b	Hidratacion-Pestañas	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:51.909+00	2025-07-22 20:01:51.909+00
eba6e6f9-16a5-4ce1-8e32-ae660ab880e1	Primer	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:52.074+00	2025-07-22 20:01:52.074+00
0f6dde1f-a4c5-43b3-854a-5e49e833c4da	Pigmentos	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:52.24+00	2025-07-22 20:01:52.24+00
6562fd99-f728-4961-9983-f4adc2ec60ca	Hidratacion-Piel	Subcategoría de Piel	t	897e7357-2084-426f-b7c0-5d567cc2115c	2025-07-22 20:01:52.406+00	2025-07-22 20:01:52.406+00
8971f543-e025-4631-80b7-0215d86df2f3	Boster	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:52.574+00	2025-07-22 20:01:52.574+00
fa7e3c65-5e90-4b1e-9b2b-12a94a76385c	Optivisores	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:52.741+00	2025-07-22 20:01:52.741+00
8bc67f76-98f0-4a23-a517-3d2a5e96cbb2	Limpieza-Accesorios	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:52.909+00	2025-07-22 20:01:52.909+00
40912d36-64c9-42c6-928d-a9281164c891	Tanques Adhesivos	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:53.096+00	2025-07-22 20:01:53.096+00
a7ec1206-acef-4afb-a63b-bc5ca09f6d0a	Nanomisters	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:53.266+00	2025-07-22 20:01:53.266+00
0fa132a0-f358-49ad-86ea-e0fff769dea7	Cintas-Accesorios	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:53.432+00	2025-07-22 20:01:53.432+00
705161cf-bfe6-418a-b561-3d4f79b91b58	Organización-Accesorios	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:53.615+00	2025-07-22 20:01:53.615+00
1dababba-299d-43ab-9d36-1bb00ee07229	Bioseguridad	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:53.781+00	2025-07-22 20:01:53.781+00
c9d06054-4bf0-49eb-ad50-8f186d4d9728	Ventiladores	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:53.943+00	2025-07-22 20:01:53.943+00
1e22b2e2-e8e4-4895-8221-5a923c6e7440	Marcacion-Accesorios	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:54.108+00	2025-07-22 20:01:54.108+00
90f4707c-be37-4313-bbc7-1362b3d3ece1	Aros de luz	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:54.277+00	2025-07-22 20:01:54.277+00
47218622-5244-478a-812d-01fd30411e28	Henna - Accesorios	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:54.446+00	2025-07-22 20:01:54.446+00
786480b7-f6e8-4f03-9512-98cf8f6b3232	Espejos	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:54.611+00	2025-07-22 20:01:54.611+00
67f612e6-8f2c-47a3-ab40-a1c4d145a7dd	Tijeras	Subcategoría de Accesorios	t	bc7fc608-2973-459e-b80a-36ff904e88ba	2025-07-22 20:01:54.779+00	2025-07-22 20:01:54.779+00
82785278-b03d-4108-a3c5-d752e9a1a52a	Labios-Micropigmentacion	Subcategoría de Micropigmentacion	t	b4a7619f-55b3-4566-816a-e79aebb4f74e	2025-07-22 20:01:54.954+00	2025-07-22 20:01:54.954+00
88ebcb64-faa3-4ded-9caf-f2a003fb8e43	Henna -Labios	Subcategoría de Labios	t	4ddfab51-dd1b-4d51-a43a-0ca7c9aea258	2025-07-22 20:01:55.122+00	2025-07-22 20:01:55.122+00
950034c3-2568-4f29-9cf1-0ed14e656104	Anillo-Pestañass	Subcategoría de Pestañas	t	e86d4c63-095c-4cd0-a95e-db06bae5bc73	2025-07-22 20:01:55.297+00	2025-07-22 20:01:55.297+00
2c23ddde-902b-41b0-b231-c9602ae9bc5f	Acido Hialuronico	Subcategoría de HidraLips	t	fd89886f-e5ea-4f7c-bd96-45efb9d5b5fa	2025-07-22 20:01:55.463+00	2025-07-22 20:01:55.463+00
3fca2124-fdc6-4630-a69e-104137aba89c	Maquinas	Subcategoría de Piel	t	897e7357-2084-426f-b7c0-5d567cc2115c	2025-07-22 20:01:55.627+00	2025-07-22 20:01:55.627+00
0c7bd844-3663-4f3b-b51d-401d9d8606f7	Organización-Varios	Subcategoría de Organización	t	a57c55f9-082e-4892-8cf0-07a34fd02dd0	2025-07-22 20:01:55.811+00	2025-07-22 20:01:55.811+00
\.


--
-- Data for Name: Compras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Compras" (id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Cotizacions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cotizacions" (id, "userId", total, status, "validUntil", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DetalleCotizacions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DetalleCotizacions" (id, "quoteId", "productId", quantity, price, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DiscountRules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DiscountRules" (id, name, "discountType", "discountValue", "conditionType", "minQuantity", "minAmount", "maxQuantity", "maxAmount", "applicableFor", "productId", "categoryId", "startDate", "endDate", "isActive", priority, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Distributors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Distributors" (id, "userId", "discountPercentage", "creditLimit", "currentCredit", "paymentTerm", "minimumPurchase", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Expenses" (id, "expenseNumber", "categoryType", description, amount, "expenseDate", "paymentMethod", vendor, "invoiceNumber", "receiptUrl", notes, status, "dueDate", "createdBy", "approvedBy", "approvedAt", "isRecurring", "recurringFrequency", "createdAt", "updatedAt", "isFromPurchaseOrder", "purchaseOrderId") FROM stdin;
\.


--
-- Data for Name: OrderItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItems" (id, "orderId", "productId", quantity, "unitPrice", "appliedDiscount", subtotal, "discountRuleId", "createdAt", "updatedAt") FROM stdin;
7c05e937-b9fc-448b-b4cf-f36e5bc769e4	31c808db-d534-4fac-b8c6-f66bcfa9f9cb	6a14141f-3995-4da9-b8c9-533e079bceca	1	39000.00	0.00	39000.00	\N	2025-08-01 16:21:21.937+00	2025-08-01 16:21:21.937+00
dd908e78-3f81-440b-84e9-1cf8741fff68	909cb2b7-2258-42ac-8957-94fbc494e708	21925050-d82b-48f2-8484-f98fcd2cc11f	1	57000.00	0.00	57000.00	\N	2025-08-01 16:23:30.936+00	2025-08-01 16:23:30.936+00
f7ce26f2-ec95-4550-b0d5-d81acd1e9c7f	8849dc08-8b34-4bb1-8c0b-601c4a94b435	56404365-729e-4ce7-8f6b-88943acea686	1	25000.00	0.00	25000.00	\N	2025-08-01 17:03:28.277+00	2025-08-01 17:03:28.277+00
0a90b51f-ee83-47d3-8bdc-ee7bd2b72223	8849dc08-8b34-4bb1-8c0b-601c4a94b435	27d9d386-e9d2-497c-bab7-935e6567be01	1	12000.00	0.00	12000.00	\N	2025-08-01 17:03:28.303+00	2025-08-01 17:03:28.303+00
67591304-9f58-4642-ae89-f10238d1c669	0f3d7d5f-8a07-47e7-93ef-00e3201a770a	2d5aebcb-189e-4308-a68a-44017212be6b	1	18000.00	0.00	18000.00	\N	2025-08-01 17:24:02.087+00	2025-08-01 17:24:02.087+00
c6cb2ba5-616e-49b8-9631-ceecaf592e54	0f3d7d5f-8a07-47e7-93ef-00e3201a770a	9698a4fb-911f-4b59-a90a-29a44d092405	1	39000.00	0.00	39000.00	\N	2025-08-01 17:24:02.108+00	2025-08-01 17:24:02.108+00
1f571a3b-5575-45f9-b6e8-ad622a9d6bb9	74ac437b-ac15-4822-a158-b6cf3db55f62	1a54b641-43ba-428d-a1b8-ff21f53bb2c5	1	150000.00	0.00	150000.00	\N	2025-08-01 17:55:06.329+00	2025-08-01 17:55:06.329+00
427162cc-94d5-4635-842a-217a529fd6b1	1986d292-bc7d-4c93-8675-e90c91b5a91c	1dfb106b-025f-4248-a57b-1866119cd28d	1	34000.00	0.00	34000.00	\N	2025-08-01 18:37:38.888+00	2025-08-01 18:37:38.888+00
297ed66d-7fb1-40a9-aa14-6c98f58d8d82	1986d292-bc7d-4c93-8675-e90c91b5a91c	59ed16d4-825d-4dc6-87c9-a4850d98dea1	1	34000.00	0.00	34000.00	\N	2025-08-01 18:37:38.912+00	2025-08-01 18:37:38.912+00
b8691631-798f-454b-935a-82f37ecdea7c	60acaeeb-29fa-4563-a6af-9f0ccb7b2e2b	bde48ef3-dc46-4b05-8a2a-a01130d3ac68	1	17500.00	0.00	17500.00	\N	2025-08-01 18:49:25.863+00	2025-08-01 18:49:25.863+00
42f8d8da-8f88-4744-ad7c-7e2794e0c246	83b17af9-f865-4a50-b6bc-931fa14dc67b	84a8256e-310a-4030-b87a-a0275471eaf4	1	28000.00	0.00	28000.00	\N	2025-08-01 19:25:22.008+00	2025-08-01 19:25:22.008+00
260e8563-5f4f-4aa4-b2ef-a9d84cdde163	f8abb318-4692-46a2-a696-a1fb27f64737	27d9d386-e9d2-497c-bab7-935e6567be01	1	12000.00	0.00	12000.00	\N	2025-08-01 19:27:57.201+00	2025-08-01 19:27:57.201+00
2d7088cd-18b1-43d9-b2d5-a3eef5dbae0d	f8abb318-4692-46a2-a696-a1fb27f64737	feb35d47-beec-44e6-b94c-be843333326d	1	18000.00	0.00	18000.00	\N	2025-08-01 19:27:57.222+00	2025-08-01 19:27:57.222+00
436855fb-5818-4349-9bfc-03cf4d9fc672	d11c4bad-c841-4e73-8870-88ea3da0fd2a	d953e957-6777-42da-b5d0-c2594232aa75	1	67000.00	0.00	67000.00	\N	2025-08-01 19:38:10.543+00	2025-08-01 19:38:10.543+00
8beebc74-d276-4f37-b329-4987624c2a22	3c8c54a5-e0d2-49d4-b78e-0a9d93655ce8	58b45fe9-c75e-4b05-ac3e-7e2454782d80	1	67000.00	0.00	67000.00	\N	2025-08-01 19:58:00.242+00	2025-08-01 19:58:00.242+00
a6e119ce-4e56-4fbe-9a05-2126f99a3f06	038a8ae7-8554-48bd-b254-832b7a056f3e	f6beb310-3d4b-4c08-806e-9a4df03ffa37	1	63000.00	0.00	63000.00	\N	2025-08-01 20:50:25.18+00	2025-08-01 20:50:25.18+00
bc51ba94-9d1e-4342-8535-220514fa1d5a	038a8ae7-8554-48bd-b254-832b7a056f3e	58db3b62-5f99-4039-bc9a-5a3cf2fd77f6	1	15000.00	0.00	15000.00	\N	2025-08-01 20:50:25.198+00	2025-08-01 20:50:25.198+00
6303635e-b2a0-4396-bf58-78c60f7aa87a	038a8ae7-8554-48bd-b254-832b7a056f3e	d953e957-6777-42da-b5d0-c2594232aa75	1	67000.00	0.00	67000.00	\N	2025-08-01 20:50:25.215+00	2025-08-01 20:50:25.215+00
1308f7dd-2e7e-4e3d-9d39-41f53bcc927a	038a8ae7-8554-48bd-b254-832b7a056f3e	13afdf8c-9b35-4605-b8e6-c4dc26937b94	1	13000.00	0.00	13000.00	\N	2025-08-01 20:50:25.233+00	2025-08-01 20:50:25.233+00
98018dd0-62fc-4b90-84e9-ffe41393af95	038a8ae7-8554-48bd-b254-832b7a056f3e	8fb65187-e07e-447b-9ad3-5201d075f52c	1	15000.00	0.00	15000.00	\N	2025-08-01 20:50:25.25+00	2025-08-01 20:50:25.25+00
316fdbab-7801-4421-bff6-5c595e52fa2c	ebad5246-b40d-48ef-a35f-9c9843ea9520	4554a12b-364d-49bd-9f62-e0ebd5ae6459	1	85000.00	0.00	85000.00	\N	2025-08-01 21:09:27.698+00	2025-08-01 21:09:27.698+00
d0130ae7-1edd-47a5-8068-0aedbef1f3b9	ebad5246-b40d-48ef-a35f-9c9843ea9520	7b1858f8-0dd3-4e5d-ae3a-e7bf94ae10ea	1	8500.00	0.00	8500.00	\N	2025-08-01 21:09:27.718+00	2025-08-01 21:09:27.718+00
700efe85-1d4d-4bd4-ac24-4df34154f8bb	ebad5246-b40d-48ef-a35f-9c9843ea9520	b6f35145-4fba-4461-ae09-047fd2ec5c89	12	1000.00	0.00	12000.00	\N	2025-08-01 21:09:27.74+00	2025-08-01 21:09:27.74+00
686823d2-8588-4ffd-b369-0f10c6a2c3b6	ebad5246-b40d-48ef-a35f-9c9843ea9520	082c4bf3-a10a-4471-9680-0c34826e079a	1	7000.00	0.00	7000.00	\N	2025-08-01 21:09:27.76+00	2025-08-01 21:09:27.76+00
da868c36-2a9b-4ded-8f2e-e7253599a44b	ebad5246-b40d-48ef-a35f-9c9843ea9520	12bc46fe-77dc-4d29-a5ad-ea3c551048e8	1	2000.00	0.00	2000.00	\N	2025-08-01 21:09:27.778+00	2025-08-01 21:09:27.778+00
aeb89ad3-d083-4ddf-8550-b8021c0f0ce8	c03c8111-4ec4-458b-9ef2-74f9eebbf891	536ee397-8092-43d2-a16e-e872f6869ab5	1	21000.00	0.00	21000.00	\N	2025-08-01 21:14:48.718+00	2025-08-01 21:14:48.718+00
1430ecf1-6b5b-4d02-ae2a-53baa19ea3b3	c03c8111-4ec4-458b-9ef2-74f9eebbf891	f61fc097-0444-40a1-a761-047e30dcc753	2	18000.00	0.00	36000.00	\N	2025-08-01 21:14:48.74+00	2025-08-01 21:14:48.74+00
f9cdb1ca-9c31-4a2e-a91b-cd6f39f7e24e	c03c8111-4ec4-458b-9ef2-74f9eebbf891	b85903db-c7f1-4531-a6f4-30ff14927a61	1	18000.00	0.00	18000.00	\N	2025-08-01 21:14:48.756+00	2025-08-01 21:14:48.756+00
fa5c5c64-9ca1-4d60-9d45-ab5eb94f69cf	c03c8111-4ec4-458b-9ef2-74f9eebbf891	63cc5329-2b4b-4027-8cf8-bc4085c16cb4	1	18000.00	0.00	18000.00	\N	2025-08-01 21:14:48.774+00	2025-08-01 21:14:48.774+00
4e4bda42-591a-451f-bff9-265f5218e42a	c03c8111-4ec4-458b-9ef2-74f9eebbf891	e6a1af40-6b3e-478d-beda-7f950cce4dda	2	6800.00	0.00	13600.00	\N	2025-08-01 21:14:48.792+00	2025-08-01 21:14:48.792+00
a0acae8f-64a3-4d17-bfbf-028ce8dfd683	9f9e1622-ac87-4c51-947b-b262196df05b	d15f51ba-7e47-42ba-a3f9-3971ffb760a9	1	19000.00	0.00	19000.00	\N	2025-08-01 21:36:15.715+00	2025-08-01 21:36:15.715+00
8ae04f4a-2761-42a4-babb-7642e0312ce7	81d140ff-85a8-4dba-92e6-94e94b581a20	cd8ca6cb-d6d2-45cf-8b6b-f6002d53b0ff	1	41500.00	0.00	41500.00	\N	2025-08-01 21:57:43.038+00	2025-08-01 21:57:43.038+00
7ed949c3-244e-460d-b3c1-d2444ce8548d	fb969e5b-3abd-4bf4-a486-9cdddcf3eb18	37536919-a91f-4b76-9df1-1554758f4e32	1	53000.00	0.00	53000.00	\N	2025-08-02 14:30:37.459+00	2025-08-02 14:30:37.459+00
9a154742-58ed-4951-acba-9dca56649aab	95448dfa-2c96-4bbf-9ba6-d8800d87cf11	25b28307-044c-4431-b78b-5bac35dee657	10	1500.00	0.00	15000.00	\N	2025-08-02 14:43:15.056+00	2025-08-02 14:43:15.056+00
b3861adc-6cfc-4649-80c8-e779868eba63	10fc20bf-8ce6-46f2-bb1a-2477d82c806a	1b93bf5c-948e-4290-8bc2-5d6af8cfdc06	1	25000.00	0.00	25000.00	\N	2025-08-02 15:04:05.608+00	2025-08-02 15:04:05.608+00
73715adb-61eb-490d-bbec-fa60b9536e53	10fc20bf-8ce6-46f2-bb1a-2477d82c806a	e3d506fb-0bde-4e48-a172-32b6ef337062	1	4500.00	0.00	4500.00	\N	2025-08-02 15:04:05.63+00	2025-08-02 15:04:05.63+00
e66330f0-cc84-4f95-8250-bde737fbf124	10fc20bf-8ce6-46f2-bb1a-2477d82c806a	a5f04e2c-5ac8-49d4-ae4c-db4e866260e4	1	4500.00	0.00	4500.00	\N	2025-08-02 15:04:05.648+00	2025-08-02 15:04:05.648+00
68cc4e4c-0c2d-4fc1-a7ff-2302f266758d	d1384c1e-6aa7-47aa-9e1b-60fdd6498af5	d15f51ba-7e47-42ba-a3f9-3971ffb760a9	1	19000.00	0.00	19000.00	\N	2025-08-02 15:21:34.776+00	2025-08-02 15:21:34.776+00
e36cfa01-3ba6-455b-9d8f-289aa6bdc00e	d1384c1e-6aa7-47aa-9e1b-60fdd6498af5	6d4b2822-e334-41a8-aa1f-48eea162972f	1	1000.00	0.00	1000.00	\N	2025-08-02 15:21:34.796+00	2025-08-02 15:21:34.796+00
c41e7204-363e-44bd-8021-fb2520329eb0	d1384c1e-6aa7-47aa-9e1b-60fdd6498af5	b6f35145-4fba-4461-ae09-047fd2ec5c89	10	1000.00	0.00	10000.00	\N	2025-08-02 15:21:34.812+00	2025-08-02 15:21:34.812+00
fcc1829f-e30c-45ea-bbe5-3e8f36e3244a	984d6cbf-55f4-4fd2-8fd7-abfe3bdb5c1b	64613f12-7047-4519-8b75-1ba0ae2b092f	1	9000.00	0.00	9000.00	\N	2025-08-02 15:26:13.644+00	2025-08-02 15:26:13.644+00
eed010a0-9ec8-4caa-bb7d-d3c7d932385e	aa76049d-ab83-40d9-85fa-c60f40729bd9	74af35f2-0f29-46ed-ba04-814cd7ccd9c9	1	40000.00	0.00	40000.00	\N	2025-08-02 17:08:40.968+00	2025-08-02 17:08:40.968+00
ae8787a0-c59f-42b5-b5d6-012bfb6608a1	aa76049d-ab83-40d9-85fa-c60f40729bd9	b0af2ebc-ffe3-4bd4-a330-7002c35e9933	1	29000.00	0.00	29000.00	\N	2025-08-02 17:08:40.986+00	2025-08-02 17:08:40.986+00
5589edc9-c951-4169-a798-e6f06e0b6f38	8db1ad14-0cff-4132-af8c-284b30954f1f	9049399f-80fd-4970-8fba-54b0daf0846d	1	40000.00	0.00	40000.00	\N	2025-08-02 17:12:42.072+00	2025-08-02 17:12:42.072+00
5cde96f0-b33b-447a-9791-6073d813a1fd	8db1ad14-0cff-4132-af8c-284b30954f1f	59ed16d4-825d-4dc6-87c9-a4850d98dea1	1	34000.00	0.00	34000.00	\N	2025-08-02 17:12:42.09+00	2025-08-02 17:12:42.09+00
7163036e-0ff3-4b5a-9692-43a910556860	8db1ad14-0cff-4132-af8c-284b30954f1f	230d606e-db95-4432-baaf-29e66a2aa66a	1	34000.00	0.00	34000.00	\N	2025-08-02 17:12:42.106+00	2025-08-02 17:12:42.106+00
47750a3e-c6ae-4a09-8d65-55f1ba856ac7	8db1ad14-0cff-4132-af8c-284b30954f1f	d3c395d8-2b2c-4f8d-8658-a1a0edccdd7c	1	34000.00	0.00	34000.00	\N	2025-08-02 17:12:42.122+00	2025-08-02 17:12:42.122+00
ca8c96a8-a476-4190-9f89-d2416ca6f0c7	8a50c03a-616e-4f4f-ae88-030efbd7c38e	59ed16d4-825d-4dc6-87c9-a4850d98dea1	1	34000.00	0.00	34000.00	\N	2025-08-02 17:13:43.912+00	2025-08-02 17:13:43.912+00
a7504699-5b11-4319-8b26-a1d1d3112ddd	8a50c03a-616e-4f4f-ae88-030efbd7c38e	4c875746-6bad-4f34-8b2d-1002db8bea82	1	77000.00	0.00	77000.00	\N	2025-08-02 17:13:43.931+00	2025-08-02 17:13:43.931+00
8ed73f55-0f69-4593-a053-794d419e5f15	02ea92b4-8e56-4098-85e9-e49547d62d2c	25b28307-044c-4431-b78b-5bac35dee657	4	1500.00	0.00	6000.00	\N	2025-08-02 17:15:54.581+00	2025-08-02 17:15:54.581+00
91977514-1b97-4c6c-b49e-82d65fdc2f73	84385c13-0609-48ea-8d5b-de40f792ee09	14ef87b3-54ce-4a34-82b0-c0e531080237	1	55000.00	0.00	55000.00	\N	2025-08-02 17:24:22.506+00	2025-08-02 17:24:22.506+00
16e261e7-44cf-414e-8296-614875ca4e74	84385c13-0609-48ea-8d5b-de40f792ee09	ecd2257c-7fe6-4c86-8385-bf6b03360ac1	1	28000.00	0.00	28000.00	\N	2025-08-02 17:24:22.523+00	2025-08-02 17:24:22.523+00
d4dc4fea-7f36-413b-90f4-7ef5e4d62844	fa6bfabb-897b-4b8b-9146-b3936326fb40	4ae77f56-eaa2-4bd6-9485-82f3428ae87e	1	16000.00	0.00	16000.00	\N	2025-08-02 18:04:52.921+00	2025-08-02 18:04:52.921+00
\.


--
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Orders" (id, "orderNumber", "userId", subtotal, discount, tax, total, status, "paymentStatus", "orderType", "cashierId", notes, "shippingAddress", "appliedDiscounts", "createdAt", "updatedAt") FROM stdin;
31c808db-d534-4fac-b8c6-f66bcfa9f9cb	202508010001	GENERIC_001	39000.00	0.00	0.00	39000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 16:21:21.927+00	2025-08-01 16:21:21.998+00
909cb2b7-2258-42ac-8957-94fbc494e708	202508010002	GENERIC_001	57000.00	0.00	0.00	57000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 16:23:30.928+00	2025-08-01 16:23:30.964+00
8849dc08-8b34-4bb1-8c0b-601c4a94b435	202508010003	1122923481	37000.00	0.00	0.00	37000.00	completed	completed	local	33213655		\N	[]	2025-08-01 17:03:28.268+00	2025-08-01 17:03:28.333+00
0f3d7d5f-8a07-47e7-93ef-00e3201a770a	202508010004	GENERIC_001	57000.00	0.00	0.00	57000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 17:24:02.079+00	2025-08-01 17:24:02.132+00
74ac437b-ac15-4822-a158-b6cf3db55f62	202508010005	GENERIC_001	150000.00	0.00	0.00	150000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 17:55:06.318+00	2025-08-01 17:55:06.422+00
1986d292-bc7d-4c93-8675-e90c91b5a91c	202508010006	GENERIC_001	68000.00	0.00	0.00	68000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 18:37:38.879+00	2025-08-01 18:37:38.941+00
60acaeeb-29fa-4563-a6af-9f0ccb7b2e2b	202508010007	1122511173	17500.00	0.00	0.00	17500.00	completed	completed	local	33213655		\N	[]	2025-08-01 18:49:25.854+00	2025-08-01 18:49:25.889+00
83b17af9-f865-4a50-b6bc-931fa14dc67b	202508010008	GENERIC_001	28000.00	0.00	0.00	28000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 19:25:22+00	2025-08-01 19:25:22.033+00
f8abb318-4692-46a2-a696-a1fb27f64737	202508010009	1098151432	30000.00	0.00	0.00	30000.00	confirmed	pending	local	33213655		\N	[]	2025-08-01 19:27:57.192+00	2025-08-01 19:27:57.248+00
d11c4bad-c841-4e73-8870-88ea3da0fd2a	202508010010	GENERIC_001	67000.00	0.00	0.00	67000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]\n[PAGO COMBINADO: 2 métodos - efectivo: $ 25.000, bancolombia: $ 42.000]	\N	[]	2025-08-01 19:38:10.535+00	2025-08-01 19:38:10.579+00
3c8c54a5-e0d2-49d4-b78e-0a9d93655ce8	202508010011	GENERIC_001	67000.00	0.00	0.00	67000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 19:58:00.232+00	2025-08-01 19:58:00.272+00
038a8ae7-8554-48bd-b254-832b7a056f3e	202508010012	GENERIC_001	173000.00	0.00	0.00	173000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 20:50:25.17+00	2025-08-01 20:50:25.276+00
ebad5246-b40d-48ef-a35f-9c9843ea9520	202508010013	GENERIC_001	114500.00	0.00	0.00	114500.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 21:09:27.691+00	2025-08-01 21:09:27.803+00
c03c8111-4ec4-458b-9ef2-74f9eebbf891	202508010014	GENERIC_001	106600.00	0.00	0.00	106600.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 21:14:48.709+00	2025-08-01 21:14:48.817+00
9f9e1622-ac87-4c51-947b-b262196df05b	202508010015	GENERIC_001	19000.00	0.00	0.00	19000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 21:36:15.703+00	2025-08-01 21:36:15.742+00
81d140ff-85a8-4dba-92e6-94e94b581a20	202508010016	GENERIC_001	41500.00	0.00	0.00	41500.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-01 21:57:43.029+00	2025-08-01 21:57:43.065+00
fb969e5b-3abd-4bf4-a486-9cdddcf3eb18	202508020001	GENERIC_001	53000.00	0.00	0.00	53000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 14:30:37.451+00	2025-08-02 14:30:37.484+00
95448dfa-2c96-4bbf-9ba6-d8800d87cf11	202508020002	GENERIC_001	15000.00	0.00	0.00	15000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 14:43:15.048+00	2025-08-02 14:43:15.082+00
10fc20bf-8ce6-46f2-bb1a-2477d82c806a	202508020003	GENERIC_001	34000.00	0.00	0.00	34000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 15:04:05.6+00	2025-08-02 15:04:05.674+00
d1384c1e-6aa7-47aa-9e1b-60fdd6498af5	202508020004	GENERIC_001	30000.00	0.00	0.00	30000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 15:21:34.768+00	2025-08-02 15:21:34.834+00
984d6cbf-55f4-4fd2-8fd7-abfe3bdb5c1b	202508020005	GENERIC_001	9000.00	0.00	0.00	9000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 15:26:13.637+00	2025-08-02 15:26:13.667+00
aa76049d-ab83-40d9-85fa-c60f40729bd9	202508020006	GENERIC_001	69000.00	0.00	0.00	69000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 17:08:40.96+00	2025-08-02 17:08:41.009+00
8db1ad14-0cff-4132-af8c-284b30954f1f	202508020007	GENERIC_001	142000.00	0.00	0.00	142000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 17:12:42.063+00	2025-08-02 17:12:42.146+00
8a50c03a-616e-4f4f-ae88-030efbd7c38e	202508020008	GENERIC_001	111000.00	0.00	0.00	111000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 17:13:43.899+00	2025-08-02 17:13:43.953+00
02ea92b4-8e56-4098-85e9-e49547d62d2c	202508020009	GENERIC_001	6000.00	0.00	0.00	6000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 17:15:54.572+00	2025-08-02 17:15:54.606+00
84385c13-0609-48ea-8d5b-de40f792ee09	202508020010	GENERIC_001	83000.00	0.00	0.00	83000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 17:24:22.499+00	2025-08-02 17:24:22.544+00
fa6bfabb-897b-4b8b-9146-b3936326fb40	202508020011	GENERIC_001	16000.00	0.00	0.00	16000.00	completed	completed	local	33213655	\n[Venta a Cliente Local - Sin registro]	\N	[]	2025-08-02 18:04:52.913+00	2025-08-02 18:04:52.946+00
\.


--
-- Data for Name: Payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payments" (id, "orderId", amount, method, status, "paymentDetails", "dueDate", "transactionId", "createdAt", "updatedAt") FROM stdin;
df22a9d8-f8bd-412d-9c9c-0f1838942bef	31c808db-d534-4fac-b8c6-f66bcfa9f9cb	39000.00	tarjeta	completed	{"cardType": "debito", "finalTotal": 39000, "originalTotal": 39000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010001-TARJETA	2025-08-01 16:21:21.992+00	2025-08-01 16:21:21.992+00
fcc14754-4b28-4bce-9e85-d77d9241966c	909cb2b7-2258-42ac-8957-94fbc494e708	57000.00	efectivo	completed	{"finalTotal": 57000, "originalTotal": 57000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010002-EFECTIVO	2025-08-01 16:23:30.957+00	2025-08-01 16:23:30.957+00
a7b072e5-c6de-4666-a257-472303155734	8849dc08-8b34-4bb1-8c0b-601c4a94b435	37000.00	nequi	completed	{"finalTotal": 37000, "originalTotal": 37000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010003-NEQUI	2025-08-01 17:03:28.325+00	2025-08-01 17:03:28.325+00
f955d1b0-8345-487f-93d1-4d7c2f164238	0f3d7d5f-8a07-47e7-93ef-00e3201a770a	57000.00	bancolombia	completed	{"finalTotal": 57000, "phoneNumber": "3170648823", "originalTotal": 57000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010004-BANCOLOMBIA	2025-08-01 17:24:02.126+00	2025-08-01 17:24:02.126+00
c153389d-f7ce-4232-92c5-1c77b8005457	74ac437b-ac15-4822-a158-b6cf3db55f62	150000.00	bancolombia	completed	{"finalTotal": 150000, "phoneNumber": "3103014627", "originalTotal": 150000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010005-BANCOLOMBIA	2025-08-01 17:55:06.413+00	2025-08-01 17:55:06.413+00
90ea1411-ae30-4aaa-8330-854e73735f09	1986d292-bc7d-4c93-8675-e90c91b5a91c	68000.00	bancolombia	completed	{"finalTotal": 68000, "originalTotal": 68000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010006-BANCOLOMBIA	2025-08-01 18:37:38.934+00	2025-08-01 18:37:38.934+00
5c258047-a600-4db1-87ca-3a7ba01b0241	60acaeeb-29fa-4563-a6af-9f0ccb7b2e2b	17500.00	bancolombia	completed	{"finalTotal": 17500, "originalTotal": 17500, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010007-BANCOLOMBIA	2025-08-01 18:49:25.883+00	2025-08-01 18:49:25.883+00
452e47f4-52b5-4e9e-86b1-034965970948	83b17af9-f865-4a50-b6bc-931fa14dc67b	28000.00	bancolombia	completed	{"finalTotal": 28000, "originalTotal": 28000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010008-BANCOLOMBIA	2025-08-01 19:25:22.026+00	2025-08-01 19:25:22.026+00
ff5f6010-ccd3-4031-8f4b-f444f93a2476	f8abb318-4692-46a2-a696-a1fb27f64737	30000.00	credito	pending	{"finalTotal": 30000, "originalTotal": 30000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	2025-08-31 19:27:57.24+00	202508010009-CREDITO	2025-08-01 19:27:57.241+00	2025-08-01 19:27:57.241+00
024a3aeb-9568-4cd5-badf-f5522a8e6072	d11c4bad-c841-4e73-8870-88ea3da0fd2a	25000.00	efectivo	completed	{"finalTotal": 67000, "originalTotal": 67000, "rulesDiscount": 0, "combinedPayments": [{"amount": "25000", "method": "efectivo"}, {"amount": "42000", "method": "bancolombia"}], "extraDiscountType": "percentage", "isCombinedPayment": true, "combinedPaymentNote": "Pago 1 de 2 (efectivo)", "extraDiscountAmount": 0, "appliedDiscountRules": [], "combinedPaymentIndex": 1, "combinedPaymentTotal": 2, "combinedPaymentMethod": "efectivo", "extraDiscountPercentage": 0}	\N	202508010010-COMBINED-1-EFECTIVO	2025-08-01 19:38:10.565+00	2025-08-01 19:38:10.565+00
ceecf8b1-01d6-44d2-a2e0-557eb58d336d	d11c4bad-c841-4e73-8870-88ea3da0fd2a	42000.00	bancolombia	completed	{"finalTotal": 67000, "originalTotal": 67000, "rulesDiscount": 0, "combinedPayments": [{"amount": "25000", "method": "efectivo"}, {"amount": "42000", "method": "bancolombia"}], "extraDiscountType": "percentage", "isCombinedPayment": true, "combinedPaymentNote": "Pago 2 de 2 (bancolombia)", "extraDiscountAmount": 0, "appliedDiscountRules": [], "combinedPaymentIndex": 2, "combinedPaymentTotal": 2, "combinedPaymentMethod": "bancolombia", "extraDiscountPercentage": 0}	\N	202508010010-COMBINED-2-BANCOLOMBIA	2025-08-01 19:38:10.571+00	2025-08-01 19:38:10.571+00
33cfbf8c-4db7-49c1-b212-97dedd6cfc00	3c8c54a5-e0d2-49d4-b78e-0a9d93655ce8	67000.00	bancolombia	completed	{"finalTotal": 67000, "originalTotal": 67000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010011-BANCOLOMBIA	2025-08-01 19:58:00.265+00	2025-08-01 19:58:00.265+00
06716ee1-8e35-4509-a543-d2d20b52d35b	038a8ae7-8554-48bd-b254-832b7a056f3e	173000.00	bancolombia	completed	{"finalTotal": 173000, "originalTotal": 173000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010012-BANCOLOMBIA	2025-08-01 20:50:25.27+00	2025-08-01 20:50:25.27+00
90152619-439f-4500-8ba8-73643fd9650d	ebad5246-b40d-48ef-a35f-9c9843ea9520	114500.00	bancolombia	completed	{"finalTotal": 114500, "originalTotal": 114500, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010013-BANCOLOMBIA	2025-08-01 21:09:27.797+00	2025-08-01 21:09:27.797+00
c5179f25-981a-43ca-ade6-f185a691c60a	c03c8111-4ec4-458b-9ef2-74f9eebbf891	106600.00	bancolombia	completed	{"finalTotal": 106600, "originalTotal": 106600, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010014-BANCOLOMBIA	2025-08-01 21:14:48.809+00	2025-08-01 21:14:48.809+00
4fabb28d-90c6-4169-aa49-45b44d5b93d0	9f9e1622-ac87-4c51-947b-b262196df05b	19000.00	bancolombia	completed	{"finalTotal": 19000, "originalTotal": 19000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010015-BANCOLOMBIA	2025-08-01 21:36:15.735+00	2025-08-01 21:36:15.735+00
c1478c0c-74fd-447e-831c-030d68a936b2	81d140ff-85a8-4dba-92e6-94e94b581a20	41500.00	efectivo	completed	{"finalTotal": 41500, "originalTotal": 41500, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508010016-EFECTIVO	2025-08-01 21:57:43.058+00	2025-08-01 21:57:43.058+00
5bdeec82-75fc-41aa-b6d4-a639c7a185ed	fb969e5b-3abd-4bf4-a486-9cdddcf3eb18	53000.00	bancolombia	completed	{"finalTotal": 53000, "originalTotal": 53000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020001-BANCOLOMBIA	2025-08-02 14:30:37.478+00	2025-08-02 14:30:37.478+00
21fc79f9-c793-4f52-a0b4-1d7fb2466bb2	95448dfa-2c96-4bbf-9ba6-d8800d87cf11	15000.00	efectivo	completed	{"finalTotal": 15000, "originalTotal": 15000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020002-EFECTIVO	2025-08-02 14:43:15.076+00	2025-08-02 14:43:15.076+00
0294f3df-b07d-4522-a586-917e9ec354a1	10fc20bf-8ce6-46f2-bb1a-2477d82c806a	34000.00	bancolombia	completed	{"finalTotal": 34000, "originalTotal": 34000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020003-BANCOLOMBIA	2025-08-02 15:04:05.667+00	2025-08-02 15:04:05.667+00
529c36e8-8e30-4d1f-9d35-e9c97b3bf763	d1384c1e-6aa7-47aa-9e1b-60fdd6498af5	30000.00	bancolombia	completed	{"finalTotal": 30000, "originalTotal": 30000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020004-BANCOLOMBIA	2025-08-02 15:21:34.828+00	2025-08-02 15:21:34.828+00
0af03bff-7401-4e2b-9cd5-78a5b8b4a8cb	984d6cbf-55f4-4fd2-8fd7-abfe3bdb5c1b	9000.00	bancolombia	completed	{"finalTotal": 9000, "originalTotal": 9000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020005-BANCOLOMBIA	2025-08-02 15:26:13.662+00	2025-08-02 15:26:13.662+00
c8942c47-5ae8-4183-8232-e2e2e3f421d0	aa76049d-ab83-40d9-85fa-c60f40729bd9	69000.00	efectivo	completed	{"finalTotal": 69000, "originalTotal": 69000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020006-EFECTIVO	2025-08-02 17:08:41.003+00	2025-08-02 17:08:41.003+00
b4e8bef4-c756-4b69-abb0-8b3fcccfbce9	8db1ad14-0cff-4132-af8c-284b30954f1f	142000.00	bancolombia	completed	{"finalTotal": 142000, "originalTotal": 142000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020007-BANCOLOMBIA	2025-08-02 17:12:42.141+00	2025-08-02 17:12:42.141+00
ef023bc5-69bf-4e0c-8101-219191a9384b	8a50c03a-616e-4f4f-ae88-030efbd7c38e	111000.00	bancolombia	completed	{"finalTotal": 111000, "originalTotal": 111000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020008-BANCOLOMBIA	2025-08-02 17:13:43.948+00	2025-08-02 17:13:43.948+00
0710da98-6045-42cd-8182-1279953c566f	02ea92b4-8e56-4098-85e9-e49547d62d2c	6000.00	efectivo	completed	{"finalTotal": 6000, "originalTotal": 6000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020009-EFECTIVO	2025-08-02 17:15:54.6+00	2025-08-02 17:15:54.6+00
6d02e8a6-5c75-44ea-a4a9-b514a3c49776	84385c13-0609-48ea-8d5b-de40f792ee09	83000.00	bancolombia	completed	{"finalTotal": 83000, "originalTotal": 83000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020010-BANCOLOMBIA	2025-08-02 17:24:22.538+00	2025-08-02 17:24:22.538+00
12a3a4c8-fa61-43f8-a6a0-2c5fb98f5f82	fa6bfabb-897b-4b8b-9146-b3936326fb40	16000.00	bancolombia	completed	{"finalTotal": 16000, "originalTotal": 16000, "rulesDiscount": 0, "extraDiscountType": "percentage", "isCombinedPayment": false, "extraDiscountAmount": 0, "appliedDiscountRules": [], "extraDiscountPercentage": 0}	\N	202508020011-BANCOLOMBIA	2025-08-02 18:04:52.94+00	2025-08-02 18:04:52.94+00
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Products" (id, sku, name, description, "purchasePrice", price, "distributorPrice", stock, "minStock", "isPromotion", "isFacturable", "promotionPrice", "categoryId", tags, image_url, "specificAttributes", "isActive", "createdAt", "updatedAt") FROM stdin;
65ab5dc2-b3cb-4b9c-b984-9808c9dee848	F00002	DERMOGRAFO U1 THUNDERLORD	Micropigmentacion - Dermografos	440000.80	580000.00	580000.00	3	5	f	t	\N	46a5e4d8-7485-41ad-a5c9-bb742cefd405	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753380023/fucsia-products/wjiwrby4cuahltpmrtcp.jpg}	{}	t	2025-07-22 20:01:56.693+00	2025-07-24 18:00:24.398+00
f6beb310-3d4b-4c08-806e-9a4df03ffa37	F00004	HENNA MENELA CASTAÑO MEDIO	Cejas - Henna	49266.00	63000.00	56700.00	3	5	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753383985/fucsia-products/rjuuoe9an27z7fnlaa0d.jpg}	{}	t	2025-07-22 20:01:57.342+00	2025-08-01 20:50:25.187+00
e3d506fb-0bde-4e48-a172-32b6ef337062	F00008	CINTA TRANSPORE DE COLORES	Pestañas - Cintas	1686.00	4500.00	4050.00	200	100	f	t	\N	5efe5221-b32e-413b-8672-73ec8f98d028	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384187/fucsia-products/vu6q47isknuzyrqb6l2x.webp}	{}	t	2025-07-22 20:01:58.653+00	2025-08-02 15:04:05.636+00
609798f8-dd0d-4139-9c84-4f27d0681131	F00006	ANESTESIA JPRO	Micropigmentacion - Anestesias	16256.00	28000.00	25200.00	20	5	f	f	\N	3c196b55-5493-4ad3-a326-caf63389974b	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384114/fucsia-products/srzwd4axtjjb2cfezsiy.png}	{}	t	2025-07-22 20:01:58+00	2025-07-24 19:08:35.458+00
6d4b2822-e334-41a8-aa1f-48eea162972f	F00022	PALOS DE NARANJO x 10 UND	Cejas - depilacion	416.00	1000.00	900.00	31	5	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753385500/fucsia-products/yj5ichxoskgywi5sydoz.jpg}	{}	t	2025-07-22 20:02:03.24+00	2025-08-02 15:21:34.802+00
845043c5-dba7-4a6d-ac92-e6e3952f8055	F00011	PIEL LISA SILICONA 	Micropigmentacion - Pieles Sinteticas	6768.00	13500.00	12150.00	10	5	t	t	10000.00	2b0301fc-990c-4bcf-83dc-85b47de5d64d	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384335/fucsia-products/txcn0gorjbo57vccjt8u.png}	{}	t	2025-07-22 20:01:59.625+00	2025-07-24 19:12:16.049+00
89bc72c2-ca0d-45d2-8dad-00c77e5b997f	F00013	PIEL LISA NUDE	Micropigmentacion - Pieles Sinteticas	6162.00	12000.00	10800.00	0	5	t	t	11000.00	2b0301fc-990c-4bcf-83dc-85b47de5d64d	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384561/fucsia-products/deh9dozoyniy30izuqdg.png}	{}	t	2025-07-22 20:02:00.282+00	2025-07-25 15:16:56.345+00
9119d261-a3bc-4d55-83c8-3bd14a1387f6	F00014	BROCHA BLANCA	Pestañas - Accesorios-Pestañas	2488.00	4500.00	4050.00	8	6	f	t	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384755/fucsia-products/wtong7w8f7t9xxaujpo6.jpg}	{}	t	2025-07-22 20:02:00.614+00	2025-07-24 19:19:15.473+00
93b80ec2-2043-4dd1-948c-6d16f112083b	F00017	BROCHA ROSADA PESTAÑAS	Pestañas - Accesorios-Pestañas	3000.00	5000.00	4500.00	10	4	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384949/fucsia-products/cyvkqtapbm0mazeocf3r.jpg}	{}	t	2025-07-22 20:02:01.603+00	2025-07-24 19:22:29.642+00
1628714f-5245-44dd-9542-5793b272b3db	F00018	KIT PINZAS DEPILACION	Pestañas - Pinza	10295.00	16000.00	14400.00	3	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753385180/fucsia-products/zjdi6qoevuuntxdl84zl.png}	{}	t	2025-07-22 20:02:01.931+00	2025-07-24 19:26:20.698+00
97dc9a12-037f-4259-8994-62c287a7daf1	F00019	HILO PARA DISEÑO BLANCO	Cejas - Marcacion	5712.00	14000.00	12600.00	10	15	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753385278/fucsia-products/aatz21guwdpko49mcxgo.jpg}	{}	t	2025-07-22 20:02:02.265+00	2025-07-24 19:27:58.88+00
62359ac0-1139-4520-a75b-ce6216ba21ec	F00021	PALOS DE NARANJOX100	Cejas - Depilacion	3311.00	8200.00	7380.00	6	6	t	f	7000.00	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753385489/fucsia-products/elryp2xh6ta69bkilfxr.jpg}	{}	t	2025-07-22 20:02:02.916+00	2025-07-24 19:31:30.378+00
160be1c6-7fde-4f22-aa25-b5bdb030a583	F00024	MANILLA SOPORTE DE PESTAÑAS	Pestañas - Accesorios-Pestañas	4333.00	14000.00	12600.00	15	6	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753386981/fucsia-products/oaja912vvc0byqzari2k.png}	{}	t	2025-07-22 20:02:03.903+00	2025-07-24 19:56:22.283+00
a5f04e2c-5ac8-49d4-ae4c-db4e866260e4	F00009	CINTA TRANSPORE TRANSPARENTE	Pestañas - Cintas	2000.00	4500.00	4050.00	50	50	f	t	\N	5efe5221-b32e-413b-8672-73ec8f98d028	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384213/fucsia-products/avmrhnlmue1zxxfuxc9f.jpg}	{}	t	2025-07-22 20:01:58.975+00	2025-08-02 15:04:05.654+00
9c3a2a08-79e8-4b58-b5b4-5da2a97e24ea	F00027	PINCEL DIAGONAL NEGRO GRANDE	Cejas - Pinceles	3235.00	15000.00	13500.00	23	5	f	t	\N	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753387289/fucsia-products/xnbmcnhxrivmgd9tf7hz.jpg}	{}	t	2025-07-22 20:02:04.902+00	2025-07-24 20:01:31.499+00
57d1443c-a98d-4b34-8386-362e0b3b3fdb	F00029	PINCEL RECTO PEQUEÑO NEGRO	Cejas - Pinceles	5046.00	7500.00	6750.00	10	5	f	t	\N	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753387770/fucsia-products/ym7qyyd36rxwd9crjlku.png}	{}	t	2025-07-22 20:02:05.575+00	2025-07-24 20:09:30.437+00
bec456e2-562b-47fa-9e3d-71b758a3fc26	F00032	PINCEL RECTO DELGADO ROSA (HENNA) 	Cejas - Pinceles	5046.00	9000.00	8100.00	6	5	t	t	7500.00	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753387837/fucsia-products/t01okvtochvvsxp84ftr.png}	{}	t	2025-07-22 20:02:06.586+00	2025-07-24 20:10:38.09+00
1a54b641-43ba-428d-a1b8-ff21f53bb2c5	F00005	CARRO AUXILIAR	Carro auxiliar para todas tus herramientas, disponible en color rosado, blanco y negro, tres compartimientos con rodachines, disponible bajo pedido	107160.00	150000.00	145000.00	6	5	f	f	\N	19c08dc4-4431-4644-81bb-e421f31bfc5c	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384076/fucsia-products/jyb8218omuqbnmukvec6.webp}	{}	t	2025-07-22 20:01:57.671+00	2025-08-01 17:55:06.337+00
a32cfa59-d549-45f4-9843-90aa460e136d	F00035	DEPILADOR  PLATEADO/DORADO	Cejas - depilacion	3000.00	6000.00	5400.00	30	5	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753388192/fucsia-products/tuisygjl4nb42knngnxd.jpg,https://res.cloudinary.com/dwgmbqsil/image/upload/v1753388193/fucsia-products/ud5qnjn3ujznocploudy.png}	{}	t	2025-07-22 20:02:07.646+00	2025-07-24 20:16:33.691+00
8fb65187-e07e-447b-9ad3-5201d075f52c	F00026	PINCEL DIAGONAL GRANDE ROSADO	Cejas - Pinceles	9794.00	15000.00	13500.00	27	8	f	t	\N	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753387237/fucsia-products/hh4vwhtcoiw8f4riqhdl.png}	{}	t	2025-07-22 20:02:04.559+00	2025-08-01 20:50:25.257+00
eed7c07d-7703-4044-a7fe-c3579c7df739	F00037	LAPIZ DISEÑO CERRADO CAFE	Cejas - Marcacion	2116.00	8000.00	7200.00	35	5	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753388494/fucsia-products/xtgxb1yyl9ckcbgcyusq.png}	{}	t	2025-07-22 20:02:08.325+00	2025-07-24 20:21:35.098+00
58b99ce5-de7b-4269-b865-4a37b734d398	F00038	TEBORY - INDUCTOR MANUAL	Micropigmentacion - Microblading	4305.00	13000.00	11700.00	25	2	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753388560/fucsia-products/od437htmjkdbhfoqbutk.jpg}	{}	t	2025-07-22 20:02:08.663+00	2025-07-24 20:22:41.495+00
e441f631-eadf-4545-a019-4f92979631e6	F00041	HENNA MENELA CASTAÑO CLARO	Cejas - Henna	52182.00	63000.00	56700.00	14	5	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753389514/fucsia-products/feklxiumzitdlsrklw1n.webp}	{}	t	2025-07-22 20:02:09.652+00	2025-07-24 20:38:34.461+00
3f641201-9aa6-408c-b3b9-b793bb1441a9	F00043	ORGANIZADOR DE PINZAS CUADRADO	Pestañas - Accesorios-Pestañas	19043.00	30000.00	27000.00	7	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753389771/fucsia-products/vsyxw3pesej4z4nozhen.webp}	{}	t	2025-07-22 20:02:10.316+00	2025-07-24 20:42:51.714+00
81f159cd-0952-4a23-9fdf-4e0f4fddf881	F00050	PINZA DORADA VOLUMEN CON NANOTECNOLOGIA 	Pestañas - Pinza	22000.00	35000.00	31500.00	0	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390061/fucsia-products/joxaybghft3jrs7ynqws.webp}	{}	t	2025-07-22 20:02:12.288+00	2025-07-24 20:47:41.802+00
a8587959-7ba9-4b8e-b2ec-4720a13ac330	F00046	PINZA CURVA DECEMARS MJP-02-US	Pestañas - Pinza	19909.00	30000.00	27000.00	2	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390151/fucsia-products/lwocxya9myqi99gnrszj.png}	{}	t	2025-07-22 20:02:10.981+00	2025-07-24 20:49:12.014+00
e783c5b4-8891-4d28-95b2-3c49c21d458a	F00051	PINZA CURVA VETUS SP-15	Pestañas - Pinza	12805.00	23000.00	20700.00	2	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390373/fucsia-products/e2n5ojaaf1wkws7norkj.webp,https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390373/fucsia-products/h9w5k8a5gssns2c7wiyk.jpg}	{}	t	2025-07-22 20:02:12.612+00	2025-07-24 20:52:54.059+00
fc902425-5d49-4163-adfe-9644fbd73e67	F00052	PINZA DELFIN DECEMARS MJP-05-US	Pestañas - Pinza	19909.00	30000.00	27000.00	2	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390624/fucsia-products/hkxcfwe0mee3lcbdxdt7.webp}	{}	t	2025-07-22 20:02:12.947+00	2025-07-24 20:57:04.789+00
aa507823-4513-40c1-9a60-cc4db9b788f5	F00054	PINZA CURVA DORADA NAGARAKU N-03-2	Pestañas - Pinza	29000.00	42000.00	37800.00	2	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753392563/fucsia-products/ub54qibges87y4pe8lld.webp}	{}	t	2025-07-22 20:02:13.618+00	2025-07-24 21:29:23.444+00
b6f35145-4fba-4461-ae09-047fd2ec5c89	F00080	PARCHES DE HIDROGEL	Pestañas - Consumibles	328.00	1000.00	700.00	2890	200	f	f	\N	6df4b718-38b4-4c79-9142-04b043b41d3b	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547620/fucsia-products/mgfzld7snlvvfvisvmnm.png}	{}	t	2025-07-22 20:02:22.055+00	2025-08-02 15:21:34.817+00
0526de5c-bcc5-4f36-9ae6-80bccddd8978	F00056	PINZA ESCAMAS RECTA DORADA	Pestañas - Pinza	9562.00	25000.00	22500.00	4	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454611/fucsia-products/njrvoilsw1ssj18ewc8i.png}	{}	t	2025-07-22 20:02:14.289+00	2025-07-25 14:43:32.223+00
adcba531-b8bd-4c11-805a-2f89eda6f39d	F00059	PINZA L ESCAMAS ROSA/AZUL	Pestañas - Pinza	19834.00	25000.00	22500.00	3	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753540810/fucsia-products/jmfysicat3c1x5gqwquk.jpg}	{}	t	2025-07-22 20:02:15.263+00	2025-07-26 14:40:10.74+00
3a275ec2-1aba-442d-bcdd-0e2041099bfa	F00060	PINZAS KIT CURVA RECTA	Pestañas - Pinza	26000.00	35000.00	31500.00	10	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753540901/fucsia-products/etyjnkpqfymen4sjdenb.png}	{}	t	2025-07-22 20:02:15.584+00	2025-07-26 14:41:42.169+00
4b6e1a6b-0a8c-409d-a12d-4d23e24c6aa3	F00079	PINZA NANOTECNOLOGÍA VOLUMEN	Pestañas - Pinza	18855.00	27000.00	24300.00	0	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547533/fucsia-products/aebn9uoad2krsasmgv3r.png}	{}	t	2025-07-22 20:02:21.718+00	2025-07-26 16:32:13.66+00
7fc247e7-2cbd-46df-9fab-da78ab72c7e8	F00061	PINZA LAGRIMAL CON NANOTECNOLOGÍA 	Pestañas - Pinza	20216.00	27000.00	24300.00	0	1	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753541043/fucsia-products/kjhqgcrola3hp12aixfx.webp}	{}	t	2025-07-22 20:02:15.912+00	2025-07-26 14:44:04.23+00
b6f2061f-9f1b-486f-b045-d00a22fae370	F00068	PINZA NAGARAKU HUECOS RECTA NH-12	Pestañas - Pinza	10799.00	25000.00	22500.00	3	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546181/fucsia-products/moeugv9flamajmjxkgel.png}	{}	t	2025-07-22 20:02:17.964+00	2025-07-26 16:09:41.512+00
82ad599f-9fd8-40c3-a2d4-9b602fb4cdaf	F00064	PINZA LANKIZ RECTA ORO ROSA	Pestañas - Pinza	12191.00	24000.00	21600.00	2	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753541700/fucsia-products/llltct3qhbqyfkvydzsg.png}	{}	t	2025-07-22 20:02:16.911+00	2025-07-26 14:55:01.108+00
77408a41-979f-4174-9d66-e0a480dc0b42	F00067	PINZA NAGARAKU HUECOS CURVA NH-15	Pestañas - Pinza	10868.00	25000.00	22500.00	0	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546123/fucsia-products/h0hjcieymd8qnd8uc3rh.png}	{}	t	2025-07-22 20:02:17.622+00	2025-07-26 16:08:44.124+00
0c0c7215-3873-4f81-9307-10a1ec18cacd	F00070	PINZA RECTA NAGARAKU ST-11 	Pestañas - Pinza	16039.00	28000.00	25200.00	4	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546329/fucsia-products/a5kcxniu9ldepa71gcsy.png}	{}	t	2025-07-22 20:02:18.611+00	2025-07-26 16:12:10.214+00
734d8d33-3702-44c2-a85f-c581c48564c2	F00071	PINZA STAR RECTA TORNAZOL	Pestañas - Pinza	7160.00	24000.00	21600.00	11	6	t	f	15000.00	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546402/fucsia-products/jzenawc69rgzxalzrqtx.webp}	{}	t	2025-07-22 20:02:18.932+00	2025-07-26 16:13:22.595+00
9b63843e-4bd1-4b07-af42-c8330d5777d3	F00073	PINZA RECTA ESCAMAS ROSA/AZUL	Pestañas - Pinza	11556.00	25000.00	22500.00	2	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546588/fucsia-products/jvlxnoiftinwxlo0babw.png}	{}	t	2025-07-22 20:02:19.592+00	2025-07-26 16:16:29.678+00
e015a7fc-d9c1-47b1-b7b9-1d9263635e5e	F00075	PINZA RECTA Y CURVA TORNAZOL	Pestañas - Pinza	10121.00	18000.00	16200.00	0	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546999/fucsia-products/tdgj8y9uonrsnk4p3rzb.jpg}	{}	t	2025-07-22 20:02:20.297+00	2025-07-26 16:23:19.754+00
433d360e-a99d-4ba9-af06-e329558121e1	F00076	PINZA VOLUMEN DORADA 	Pestañas - Pinza	14800.00	22000.00	19800.00	0	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547105/fucsia-products/iwij4pb8zojvtdzde1gg.png}	{}	t	2025-07-22 20:02:20.676+00	2025-07-26 16:25:05.803+00
09a3d029-7525-41aa-b143-2cc23673534d	F00078	PINZA VOLUMEN RUSO NANOTECNOLOGIA 	Pestañas - Pinza	19000.00	29000.00	26100.00	0	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547330/fucsia-products/n7emofyiydtp8rpwufxz.png}	{}	t	2025-07-22 20:02:21.354+00	2025-07-26 16:28:50.534+00
1b93bf5c-948e-4290-8bc2-5d6af8cfdc06	F00049	PINZA CURVA NAGARAKU N-01	Pestañas - Pinza	14081.00	25000.00	22500.00	2	6	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753391055/fucsia-products/reb8ufgdecpndmayj5pc.webp}	{}	t	2025-07-22 20:02:11.962+00	2025-08-02 15:04:05.616+00
8183e074-2396-48d5-9936-bc818b66f38c	F00104	DEZHMA LIBERTY	Alto poder de unión. Tiempo de secado 0.5seg. Semanas de retención: 7 ~ 8 semanas, viscosidad muy fina\r\nhumor medio.\r\nTemperatura ideal: 20-27 ‘c\r\nNivel de humedad ideal: 40-70%	40000.00	67000.00	60300.00	8	6	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393035/fucsia-products/dchell4i51cgnl3u3gc5.jpg}	{}	t	2025-07-22 20:02:29.984+00	2025-07-24 21:37:15.728+00
58db3b62-5f99-4039-bc9a-5a3cf2fd77f6	F00084	PINZA STAR TIPO L PLATEADA	Pestañas - Pinza	7160.00	24000.00	21600.00	2	6	t	f	15000.00	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547819/fucsia-products/cgfjk2rgmr34zip0jz8a.webp}	{}	t	2025-07-22 20:02:23.416+00	2025-08-01 20:50:25.204+00
b0af2ebc-ffe3-4bd4-a330-7002c35e9933	F00114	ADHESIVO PARA LIFTING BALSAMO  PESTAÑAS DURAZNO	Pestañas - Lifting	20646.00	29000.00	26100.00	2	4	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393828/fucsia-products/goylflvqo5fcy9ijce5d.png}	{}	t	2025-07-22 20:02:33.228+00	2025-08-02 17:08:40.991+00
58b45fe9-c75e-4b05-ac3e-7e2454782d80	F00102	DEZHMA EFICAZ	Pestañas - Adhesivos	40153.00	67000.00	60300.00	12	10	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753392897/fucsia-products/owxnmki6ututf8xk7ddh.jpg}	{}	t	2025-07-22 20:02:29.332+00	2025-08-01 19:58:00.25+00
da268d35-f5e9-40a9-896c-3619ae58dd66	F00109	REMOVEDOR DEZHMA 	Pestañas - Removedores	21000.00	31000.00	27900.00	8	4	f	t	\N	bd019c40-c16e-4c76-a6a7-c5f3c8262967	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393401/fucsia-products/zmebv6qb59lyujypr5yd.webp}	{}	t	2025-07-22 20:02:31.592+00	2025-07-24 21:43:22.039+00
7d84eacb-5b9e-4943-8f42-a1e83efa8df6	F00110	REMOVEDOR DE PESTAÑAS LASH GLUE	Pestañas - Removedores	10587.00	20000.00	18000.00	11	5	f	f	\N	bd019c40-c16e-4c76-a6a7-c5f3c8262967	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393463/fucsia-products/n2xpyv1aabzzhcqjzg0a.png}	{}	t	2025-07-22 20:02:31.915+00	2025-07-24 21:44:23.752+00
4ae77f56-eaa2-4bd6-9485-82f3428ae87e	F00111	REMOVEDOR EN CREMA FUNMIX	Pestañas - Removedores	5547.00	21000.00	18900.00	35	5	t	f	16000.00	bd019c40-c16e-4c76-a6a7-c5f3c8262967	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393562/fucsia-products/gazegk7h9ztncdweskrj.webp}	{}	t	2025-07-22 20:02:32.245+00	2025-08-02 18:04:52.927+00
ecec0079-ac34-4c00-a9b2-69892f20ed67	F00153	0.15D 12MM NAGARAKU 	Pestañas - Pestaña	10500.00	18000.00	16200.00	30	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753394037/fucsia-products/uo3ht1o32lux5egmv9qg.webp}	{}	t	2025-07-22 20:02:45.449+00	2025-07-24 21:53:57.683+00
556cad87-c838-4ebc-b184-ffc77d2d968e	F00081	PINZA RECTA DECEMARS MPJ-06-US	Pestañas - Pinza	19909.00	30000.00	27000.00	10	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547465/fucsia-products/blvjausdrr98vfzklazo.png}	{}	t	2025-07-22 20:02:22.382+00	2025-07-26 16:31:06.294+00
3bba3496-5317-4640-84c5-cd5419693f3e	F00082	CERA 125 MLG NATURAL	Cejas - depilacion	4833.00	9000.00	8100.00	5	3	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547693/fucsia-products/l8k7pse1632yb83hqb1g.jpg}	{}	t	2025-07-22 20:02:22.718+00	2025-07-26 16:34:53.942+00
4c875746-6bad-4f34-8b2d-1002db8bea82	F00107	SUPERBONDER DEZHMA	Pestañas - Bonder	62000.00	77000.00	69300.00	8	6	f	t	\N	9b91b329-7b38-484d-9ff1-05ff19e99a77	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393164/fucsia-products/fwxyisxj9tfgckcftrvy.jpg}	{}	t	2025-07-22 20:02:30.946+00	2025-08-02 17:13:43.937+00
5800e4b6-20d0-4ed1-bd77-7224c0992dbc	F00086	0,16 16CF  AGUJA MICROBLADING SESGADA	Micropigmentacion - Agujas-Micropigmentacion	15000.00	3500.00	3150.00	29	5	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753548037/fucsia-products/hq1wxlj1wihmxzjjbxes.png}	{}	t	2025-07-22 20:02:24.11+00	2025-07-26 16:40:38.469+00
7d7294cf-320b-4eb3-822f-aab06a89a00c	F00087	PINZA RECTA VETUS ST-11	Pestañas - Pinza	12066.00	23000.00	20700.00	8	5	f	t	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753548219/fucsia-products/hco0rhgfvhg0dozm58dd.png}	{}	t	2025-07-22 20:02:24.438+00	2025-07-26 16:43:39.777+00
10c3dc13-e0a4-4e42-8f22-968b6e545906	F00089	PINZA DORADA VOLUMEN CON NANOTECNOLOGIA 	Pinza volumen Dorada - con escamas para mejor agarre rectificada, con muy buena duración. 	22000.00	35000.00	31500.00	2	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753560065/fucsia-products/r0wi2yzy3bt4tbik0jct.jpg}	{}	t	2025-07-22 20:02:25.084+00	2025-07-26 20:01:06.29+00
37f8ecd0-16cd-49cc-84fa-66457c8ec278	F00091	PINZA ORO ROSA RECTA	pinza para pestañas de aislar, ORO ROSA	8568.00	16000.00	14400.00	9	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753560785/fucsia-products/v1lkhnnxe2u8msjp8lzz.jpg}	{}	t	2025-07-22 20:02:25.724+00	2025-07-26 20:13:06.061+00
3c226482-65d2-4580-8d52-e357b3774758	F00094	SHAMPOO DEZHMA 150ML	Shampoo especialmente diseñado para la limpieza antes de la aplicacion de las pestañas, pelo a pelo, cluster, punto a punto. \r\n\r\nHipoalergenico, ofrece limpieza profunda y mejora la retencion de tus aplicaciones. 	20000.00	34000.00	34000.00	6	4	f	t	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753562854/fucsia-products/d7zbxvwn8jxesyyrrn06.jpg}	{}	t	2025-07-22 20:02:26.702+00	2025-07-26 20:47:34.3+00
17ff26d4-3f2d-4fcd-9642-1c97315732f3	F00096	SHAMPOO PARA CEJAS Y PESTAÑAS 150ML	Shampoo para la limpieza de cejas y pestañas	10900.00	16000.00	16000.00	25	5	f	f	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753563134/fucsia-products/ukylt2gm1rlytskvbmzf.jpg}	{}	t	2025-07-22 20:02:27.364+00	2025-07-26 20:52:15.386+00
9024848f-295b-4d31-a72b-c351da2052ea	F00097	SHAMPOO 50ML 	Shampoo especializado para lashistas y artistas de cejas, limpieza profunda que genera mejor retención. 	10619.00	16000.00	15000.00	5	5	f	f	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753564727/fucsia-products/mhoi6mnc7xoesuedsrji.jpg}	{}	t	2025-07-22 20:02:27.686+00	2025-07-26 21:18:47.583+00
8f0ae0fa-5339-481b-9d2e-12f9ef912c93	F00099	ESTUCHE PARA PINZAS PLATEADO	Pestañas - Pinza	5103.00	13000.00	11700.00	1	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753568803/fucsia-products/rpr8grmwjnkdrdizahlu.jpg}	{}	t	2025-07-22 20:02:28.349+00	2025-07-26 22:26:44.162+00
ada1f368-e187-4bde-b157-bea6eceb9e09	F00120	0.03D 9MM  NAGARAKU	Pestañas - Pestaña	10500.00	18500.00	16000.00	5	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454254/fucsia-products/wlbqb3o6gtsqaom8t0zd.jpg}	{"D": "9MM"}	t	2025-07-22 20:02:35.187+00	2025-07-26 22:30:23.066+00
3937bf37-e7a2-4b83-82d0-0ae63dd36c65	F00118	LENTE MACRO PARA FOTOGRAFIA ROSADO	Accesorios - Fotografia	15399.00	33000.00	29700.00	5	6	f	f	\N	80f51444-e4d0-49d6-b00b-d1f3a16869cb	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753394504/fucsia-products/stiuuxgxblamaotjciho.png}	{}	t	2025-07-22 20:02:34.534+00	2025-07-24 22:01:44.994+00
79ab5fc7-2595-48ec-b6cf-f045010f8390	F00119	LENTE FOTOGRAFIA CON LUZ	Accesorios - Fotografia	59000.00	99000.00	89100.00	0	5	t	f	85000.00	80f51444-e4d0-49d6-b00b-d1f3a16869cb	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753394575/fucsia-products/vdrilcwbxlvxwisrhx6g.jpg}	{}	t	2025-07-22 20:02:34.862+00	2025-07-24 22:02:55.55+00
f61fc097-0444-40a1-a761-047e30dcc753	F00150	0.15D 9MM NAGARAKU 	Pestañas - Pestaña	8941.00	18000.00	16200.00	14	8	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753474215/fucsia-products/nh57jnvm7eo7qx7oaooy.jpg}	{}	t	2025-07-22 20:02:44.476+00	2025-08-01 21:14:48.746+00
9f0c6e2f-bb98-4465-9578-a71a17f76442	F00122	0.03D 11MM  NAGARAKU	Pestañas - Pestaña	10500.00	18500.00	16650.00	8	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454384/fucsia-products/dqux7vzmbyhhlfbvapaz.jpg}	{}	t	2025-07-22 20:02:35.852+00	2025-07-25 14:39:44.968+00
c13fbf78-36e6-4817-a6a2-5c98f160be2a	F00121	0.03D 10MM  NAGARAKU	Pestañas - Pestaña	10500.00	18500.00	16650.00	7	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454334/fucsia-products/uunfvitrwblrtehepxsz.jpg}	{}	t	2025-07-22 20:02:35.527+00	2025-07-25 14:38:55.497+00
51b3bd76-a92e-4daa-8c1a-946a26d1dcc7	F00123	0.03D 12MM  NAGARAKU	Pestañas - Pestaña	10500.00	18500.00	16650.00	16	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454412/fucsia-products/emp5hkfsh15x7r5j0zbl.jpg}	{}	t	2025-07-22 20:02:36.186+00	2025-07-25 14:40:13.5+00
6f4edc09-ed90-4431-8b5a-41ae815bd28f	F00124	0.03D 13MM  NAGARAKU	Pestañas - Pestaña	15348.00	18500.00	16650.00	15	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454436/fucsia-products/swq0fb0wp9mdns5atuzy.jpg}	{}	t	2025-07-22 20:02:36.515+00	2025-07-25 14:40:37.169+00
879a42ce-5fe6-49ff-b4d7-0fb00a50ad2e	F00126	0.03D 15MM  NAGARAKU	Pestañas - Pestaña	10500.00	18500.00	16650.00	4	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454720/fucsia-products/jfl41wak2j3abtyvev02.webp}	{}	t	2025-07-22 20:02:37.207+00	2025-07-25 14:45:20.589+00
740abd53-e201-4b88-bcc3-36c4c51c131b	F00127	0.05D 9MM NAGARAKU 	Pestañas - Pestaña	11445.00	18000.00	16200.00	12	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454822/fucsia-products/v4eirooldrslsgbuw84l.webp}	{}	t	2025-07-22 20:02:37.532+00	2025-07-25 14:47:03.351+00
6683f355-951c-4bcb-9c24-4030f4be8c6a	F00128	0.05D 10MM NAGARAKU 	Pestañas - Pestaña	9811.00	18000.00	16200.00	10	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454974/fucsia-products/uihzjgzxsuo9otuh8saj.jpg}	{}	t	2025-07-22 20:02:37.863+00	2025-07-25 14:49:34.52+00
f3fe770f-cc11-43b4-8d27-8e733d859542	F00130	0.05D 12MM NAGARAKU 	Pestañas - Pestaña	10254.00	18000.00	16200.00	16	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753455502/fucsia-products/io7dwrbm4frhiaofwj5k.webp}	{}	t	2025-07-22 20:02:38.524+00	2025-07-25 14:58:22.871+00
e0c6703e-416f-4369-abcb-d32acd32e0ac	F00134	0.07D 8MM NAGARAKU 	Pestañas - Pestaña	9574.00	18000.00	16200.00	10	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753456874/fucsia-products/lwewnwfxia0fw7je4z40.webp}	{}	t	2025-07-22 20:02:39.506+00	2025-07-25 15:21:15.082+00
c3bafb52-95ce-4156-9f88-dba492ce17e9	F00132	0.05D 14MM NAGARAKU 	Pestañas - Pestaña	11102.00	18000.00	16200.00	8	3	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753456527/fucsia-products/kbhgys0t4hmkgxq93zhs.png}	{}	t	2025-07-22 20:02:39.187+00	2025-07-25 15:15:27.929+00
b83cb92a-49e6-4bdd-9d1b-5a14709a927f	F00136	0.07D 10MM NAGARAKU 	Pestañas - Pestaña	9682.00	18000.00	16200.00	28	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753457054/fucsia-products/itpntad4pnxcq5x8gukd.webp}	{}	t	2025-07-22 20:02:40.155+00	2025-07-25 15:24:15.072+00
55c5a92c-1435-4573-8a84-bf3f6dc8e0ea	F00138	0.07D 12MM NAGARAKU 	Pestañas - Pestaña	9682.00	18000.00	16200.00	23	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753457127/fucsia-products/uzwjxoz3zyrgv5prc64h.webp}	{}	t	2025-07-22 20:02:40.824+00	2025-07-25 15:25:27.513+00
c51aa5d7-d290-4a0a-8587-e4403a753364	F00139	0.07D 13MM NAGARAKU 	Pestañas - Pestaña	10500.00	18000.00	16200.00	33	12	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753457514/fucsia-products/lgdfogjcxtz67gd1gywl.jpg}	{}	t	2025-07-22 20:02:41.155+00	2025-07-25 15:31:55.035+00
2d5aebcb-189e-4308-a68a-44017212be6b	F00141	0.07D 15MM NAGARAKU 	Pestañas - Pestaña	9656.00	18000.00	16200.00	9	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753457590/fucsia-products/xfewp22aees4rkimwops.jpg}	{}	t	2025-07-22 20:02:41.829+00	2025-08-01 17:59:40.457+00
ae1cb529-5e65-4d58-a40f-da6c02234678	F00144	0.10D 10MM  NAGARAKU	Pestañas - Pestaña	7946.00	18000.00	16200.00	7	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753468242/fucsia-products/kpsmjssymschdyzncvc7.jpg}	{}	t	2025-07-22 20:02:42.498+00	2025-07-25 18:30:42.723+00
0109fbb3-dd2b-4b1b-b63d-902815cb9da8	F00145	0.10D 11MM  NAGARAKU	Pestañas - Pestaña	7946.00	18000.00	16200.00	9	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753468263/fucsia-products/a4mtmqdr9yigq4lpeo6f.jpg}	{}	t	2025-07-22 20:02:42.817+00	2025-07-25 18:31:03.603+00
cf84378c-4611-489a-bf17-684e3eee0fcc	F00147	0.10D 13MM  NAGARAKU	Pestañas - Pestaña	8005.00	18000.00	16200.00	10	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753468733/fucsia-products/qze6cfwdqqschk7zahcx.jpg}	{}	t	2025-07-22 20:02:43.473+00	2025-07-25 18:38:53.987+00
95b173ce-1294-4bde-97bc-88c913665c9a	F00149	0.10D 15MM  NAGARAKU	Pestañas - Pestaña	8005.00	18000.00	16200.00	4	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753468979/fucsia-products/pzjrvwsznzpkoqo9zxx0.png}	{}	t	2025-07-22 20:02:44.121+00	2025-07-25 18:43:00.164+00
f830b30e-b9ab-418b-8385-5c415d139f56	F00163	0.20D 15MM  NAGARAKU	Pestañas - Pestaña	8281.00	18000.00	16200.00	16	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:48.744+00	2025-07-22 20:02:48.744+00
c5b43faa-53c7-46f9-9def-d156ef4c044d	F00164	0.07D Y 8MM NAGARAKU	Pestañas - Pestaña	16698.00	30000.00	27000.00	12	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:49.063+00	2025-07-22 20:02:49.063+00
4670accf-dc49-4483-9169-ec410196e697	F00165	0.07D Y 9MM NAGARAKU	Pestañas - Pestaña	15939.00	30000.00	27000.00	10	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:49.381+00	2025-07-22 20:02:49.381+00
7b3fd279-7d86-4c50-b59b-2faaffa68ad6	F00166	0.07D Y 10MM NAGARAKU	Pestañas - Pestaña	18181.00	30000.00	27000.00	18	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:49.71+00	2025-07-22 20:02:49.71+00
f1dad39e-cfe2-474a-ae97-21d2bf48fb56	F00167	 0.07D Y 11MM NAGARAKU	Pestañas - Pestaña	12297.00	30000.00	27000.00	13	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:50.03+00	2025-07-22 20:02:50.03+00
422e2380-da85-41c4-b1e1-4cba750b0e93	F00168	0.07D Y 12MM NAGARAKU 	Pestañas - Pestaña	17867.00	30000.00	27000.00	16	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:50.36+00	2025-07-22 20:02:50.36+00
1cbac03d-e7d1-456b-8fa2-decba2860a99	F00169	0.07D Y 13MM NAGARAKU	Pestañas - Pestaña	14732.00	30000.00	27000.00	13	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:50.683+00	2025-07-22 20:02:50.683+00
73b7acc9-d295-4b61-a807-a43f11e00043	F00170	 0.07D Y 14MM NAGARAKU	Pestañas - Pestaña	15483.00	30000.00	27000.00	9	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:51.01+00	2025-07-22 20:02:51.01+00
8395bb8f-087a-46c5-8d67-d6d9f6e4a5c9	F00171	 0.07D Y 15MM NAGARAKU	Pestañas - Pestaña	17984.00	30000.00	27000.00	5	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:51.332+00	2025-07-22 20:02:51.332+00
1e06ef6e-5cd7-41ef-b7e6-f379aec38b4a	F00172	0.07D W 3D 8MM NAGARAKU  	Pestañas - Pestaña	16811.00	34000.00	30600.00	16	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:51.662+00	2025-07-22 20:02:51.662+00
1177285d-4bdb-4903-ac5e-8d3c51f5d183	F00173	0.07D W 3D 9MM NAGARAKU 	Pestañas - Pestaña	26500.00	34000.00	30600.00	11	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:51.984+00	2025-07-22 20:02:51.984+00
1f5088c4-f385-4b94-ba00-dc73767d8a5d	F00174	0.07D W 3D  10MM NAGARAKU 	Pestañas - Pestaña	22500.00	34000.00	30600.00	9	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:52.315+00	2025-07-22 20:02:52.315+00
d862f0bb-d8e8-4ae5-835e-49bbcf2e9607	F00175	0.07D W 3D 11MM NAGARAKU 	Pestañas - Pestaña	22047.00	34000.00	30600.00	7	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:52.655+00	2025-07-22 20:02:52.655+00
1967d635-4c1f-488a-a33e-f6b76f198741	F00176	0.07D W 3D 12MM NAGARAKU 	Pestañas - Pestaña	22123.00	34000.00	30600.00	13	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:52.982+00	2025-07-22 20:02:52.982+00
d073bad5-805f-46b6-a700-77b2b553e429	F00177	0.07D W 3D 13MM NAGARAKU 	Pestañas - Pestaña	23473.00	34000.00	30600.00	11	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:53.296+00	2025-07-22 20:02:53.296+00
2b68462a-f5ae-4f9f-ae3e-bf26fbd0e65f	F00178	0.07D W 3D  14MM NAGARAKU 	Pestañas - Pestaña	24547.00	34000.00	30600.00	15	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:53.622+00	2025-07-22 20:02:53.622+00
3a5b874e-ff4d-4a18-8883-10192661828c	F00179	0.07D W 3D  15MM NAGARAKU 	Pestañas - Pestaña	25000.00	34000.00	30600.00	11	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:53.947+00	2025-07-22 20:02:53.947+00
e4982825-a935-42e1-9084-be5f6a7acad7	F00185	0.07D W 4D 14MM NAGARAKU	Pestañas - Pestaña	24200.00	34000.00	30600.00	14	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:55.883+00	2025-07-22 20:02:55.883+00
05e64031-aca1-49b9-8ba3-6458defaa994	F00186	0.07D W 4D 15MM NAGARAKU	Pestañas - Pestaña	24200.00	34000.00	30600.00	4	4	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:56.203+00	2025-07-22 20:02:56.203+00
4de30e77-6a44-4cb7-8c31-d47fb0134666	F00187	0.07D W 5D 9MM NAGARAKU	Pestañas - Pestaña	29500.00	41500.00	37350.00	6	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:56.535+00	2025-07-22 20:02:56.535+00
392ae9d8-3724-4e54-9692-5e1f9eb078fc	F00188	0.07D W 5D 10MM NAGARAKU	Pestañas - Pestaña	29500.00	41500.00	37350.00	10	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:56.866+00	2025-07-22 20:02:56.866+00
3d3928c6-f4dc-4129-85ad-33e76f955db2	F00190	0.07D W 5D 12MM NAGARAKU	Pestañas - Pestaña	29500.00	41500.00	37350.00	6	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:57.51+00	2025-07-22 20:02:57.51+00
497a0583-5171-49bf-aaf7-ef3b2a2a44af	F00191	0.07D W 5D 13MM NAGARAKU	Pestañas - Pestaña	29500.00	41500.00	37350.00	10	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:57.842+00	2025-07-22 20:02:57.842+00
0f04fd62-0d41-4a90-9b49-153442513d34	F00192	0.07D W 6D 9MM NAGARAKU	Pestañas - Pestaña	26830.00	43000.00	38700.00	7	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:58.198+00	2025-07-22 20:02:58.198+00
83686cf3-2e56-4211-88b2-7e5442fe9540	F00193	0.07D W 6D 10MM NAGARAKU	Pestañas - Pestaña	26645.00	43000.00	38700.00	12	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:58.522+00	2025-07-22 20:02:58.522+00
1cb227f5-6239-456b-8d35-50332fcb6115	F00194	0.07D W 6D 11MM NAGARAKU	Pestañas - Pestaña	32184.00	43000.00	38700.00	13	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:58.842+00	2025-07-22 20:02:58.842+00
aa4ddac4-2712-460e-bf3a-e44c4ba2254a	F00156	0.15D 15MM NAGARAKU 	Pestañas - Pestaña	9509.00	18000.00	16200.00	19	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753475110/fucsia-products/mhwfktsw7jyqmqdqi8kx.png}	{}	t	2025-07-22 20:02:46.422+00	2025-07-25 20:25:10.725+00
867a75d8-0dba-47c2-b033-de900ef7fc0a	F00158	0.20D 10MM  NAGARAKU	Pestañas - Pestaña	8005.00	18000.00	16200.00	13	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753475281/fucsia-products/hlk181x8zayhwc4mtdgy.webp}	{}	t	2025-07-22 20:02:47.076+00	2025-07-25 20:28:01.331+00
77603f4f-50cd-4aa7-afc4-641e82454898	F00160	0.20D 12MM  NAGARAKU	Pestañas - Pestaña	8282.00	18000.00	16200.00	11	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753475754/fucsia-products/nahbwczji4sf9ymuaouq.png}	{}	t	2025-07-22 20:02:47.77+00	2025-07-25 20:35:54.774+00
872f685d-aa5f-49c0-a819-a9a82f1b437c	F00162	0.20D NAGARAKU	Pestañas - Pestaña	8281.00	18000.00	16200.00	12	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753568984/fucsia-products/igqzshtcnl4miwfkw2w8.webp}	{"D": "14MM"}	t	2025-07-22 20:02:48.416+00	2025-07-26 22:29:44.66+00
1dfb106b-025f-4248-a57b-1866119cd28d	F00184	0.07D W 4D 13MM NAGARAKU	Pestañas - Pestaña	24200.00	34000.00	30600.00	12	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:55.565+00	2025-08-01 18:37:38.897+00
59ed16d4-825d-4dc6-87c9-a4850d98dea1	F00181	0.07D W 4D 10MM NAGARAKU	Pestañas - Pestaña	24200.00	34000.00	30600.00	5	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:54.593+00	2025-08-02 17:13:43.919+00
cd8ca6cb-d6d2-45cf-8b6b-f6002d53b0ff	F00189	0.07D W 5D 11MM NAGARAKU	Pestañas - Pestaña	29500.00	41500.00	37350.00	9	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:57.182+00	2025-08-01 21:57:43.045+00
9049399f-80fd-4970-8fba-54b0daf0846d	F00180	0.07D W 4D 9MM NAGARAKU	Pestañas - Pestaña	27030.00	40000.00	36000.00	18	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:54.274+00	2025-08-02 17:12:42.078+00
488a9d5a-b47a-49cb-9a23-68f9f533347a	F00195	0.07D W 6D 12MM NAGARAKU	Pestañas - Pestaña	29682.00	43000.00	38700.00	12	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:59.164+00	2025-07-22 20:02:59.164+00
5fbb6a06-c748-4bd3-b14d-6c5e2db457e2	F00196	0.07D W 6D 13MM NAGARAKU	Pestañas - Pestaña	29789.00	43000.00	38700.00	12	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:59.484+00	2025-07-22 20:02:59.484+00
7f83b560-336b-4338-8096-b6c564b945c9	F00197	0.07D W 6D 14MM NAGARAKU	Pestañas - Pestaña	29636.00	43000.00	38700.00	13	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:59.804+00	2025-07-22 20:02:59.804+00
c61f0a91-386f-4a75-a7e7-22097d611268	F00198	0.07D W 7D 13MM NAGARAKU	Pestañas - Pestaña	43921.00	55000.00	49500.00	6	3	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:00.126+00	2025-07-22 20:03:00.126+00
578aa07b-bfdb-464a-b2fa-ba18c07be34d	F00199	AEROGRAFO 	Cejas - Aerografos	90000.00	120000.00	108000.00	1	2	f	f	\N	db6b0d86-a6b0-4220-9994-9e66a63d7e78	{}	{}	\N	t	2025-07-22 20:03:00.445+00	2025-07-22 20:03:00.445+00
bb2476c8-0aab-4df3-a820-5f3a4f33d664	F00200	PALETA PARA ADHESIVO DEZHMA	Pestañas - Adhesivos	600.00	1500.00	1350.00	9	10	f	f	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{}	\N	t	2025-07-22 20:03:00.78+00	2025-07-22 20:03:00.78+00
ea78f2f3-7f02-4370-83ca-f698541c1b3b	F00201	PESTAÑAS AUTOFLORACION	Pestañas - Pestaña	19001.00	26000.00	23400.00	4	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:01.101+00	2025-07-22 20:03:01.101+00
3cbb5724-eb88-424a-9bb5-818360354a79	F00202	0.07D MIX NAGARAKU 16-20MM	Pestañas - Pestaña	15842.00	24000.00	21600.00	4	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:01.419+00	2025-07-22 20:03:01.419+00
a65a772f-8df8-464d-9491-c53fc90db401	F00205	0.20C MIX NAGARAKU 	Pestañas - Pestaña	10179.00	21000.00	18900.00	17	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:02.543+00	2025-07-22 20:03:02.543+00
ca5cf014-7fb3-4d38-98c9-b66152f3b3ec	F00206	0.03D MIX NAGARAKU 	Pestañas - Pestaña	9046.00	21000.00	18900.00	5	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:02.907+00	2025-07-22 20:03:02.907+00
4dd9de9a-3367-4917-97ec-e9afe05d3dd8	F00207	0.05D MIX NAGARAKU 	Pestañas - Pestaña	14467.00	21000.00	18900.00	9	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:03.323+00	2025-07-22 20:03:03.323+00
b96bf07f-6e9d-41e0-b712-8b1b78f32554	F00208	0.07D MIX NAGARAKU 7-15MM	Pestañas - Pestaña	10500.00	21000.00	18900.00	23	12	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:03.691+00	2025-07-22 20:03:03.691+00
88ceb268-22b4-47f7-a757-5e8d3ce6cd61	F00209	0.10D MIX NAGARAKU	Pestañas - Pestaña	10000.00	21000.00	18900.00	11	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:04.035+00	2025-07-22 20:03:04.035+00
d4b9426f-a37e-479e-ba8c-d96427229e5c	F00210	0.15D MIX NAGARAKU 	Pestañas - Pestaña	11500.00	21000.00	18900.00	23	12	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:04.377+00	2025-07-22 20:03:04.377+00
53216890-8537-421d-b193-0afd27d213bd	F00211	0.20D MIX NAGARAKU	Pestañas - Pestaña	8728.00	21000.00	18900.00	22	12	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:04.703+00	2025-07-22 20:03:04.703+00
9efceae5-8070-4398-a6c3-9d93b00a8595	F00212	0.10D MIX AZUL NAGARAKU	Pestañas - Pestaña	5240.00	23000.00	20700.00	6	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:05.026+00	2025-07-22 20:03:05.026+00
738e7ef2-8fae-48c8-aca8-e76611386a27	F00213	STAR 0.12 D MIX	Pestañas - Pestaña	10925.00	22000.00	19800.00	4	4	t	f	12000.00	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:05.351+00	2025-07-22 20:03:05.351+00
8e62c526-21cd-4aac-a3a4-5f81c36d696e	F00214	STAR 0.20 D MIX	Pestañas - Pestaña	10088.00	22000.00	19800.00	5	4	t	f	12000.00	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:05.678+00	2025-07-22 20:03:05.678+00
1608a6f4-634f-4d55-9b72-e066e1af1981	F00215	NAGARAKU 0.15L MIX 8-15MM	Pestañas - Pestaña	23388.00	34000.00	30600.00	0	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:05.996+00	2025-07-22 20:03:05.996+00
d9385940-00aa-4d43-a8c5-168e635ec77a	F00216	0.15D LC NAGARAKU MIX 7- 15 MM 	PESTAÑAS NAGARAKU MIX CURVATURA L 	13181.00	23000.00	20700.00	1	3	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:06.327+00	2025-07-22 20:03:06.327+00
2cc718d4-dcd9-4ecf-b890-83d7407c61d3	F00217	0.07D W 3D MIX 8-15 NAGARAKU	Pestañas - Pestaña	23000.00	39000.00	35100.00	17	12	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:06.665+00	2025-07-22 20:03:06.665+00
5a8daacb-da8a-4840-8d35-b6e646b7c6b5	F00218	0.07D W 4D MIX 	Pestañas - Pestaña	26490.00	42000.00	37800.00	23	8	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:07.021+00	2025-07-22 20:03:07.021+00
e1fc975b-7e97-403c-91d7-a1ef33232667	F00219	0.07D W 5D MIX 	Pestañas - Pestaña	34000.00	50000.00	45000.00	3	8	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:07.382+00	2025-07-22 20:03:07.382+00
0c8a1e46-87e5-4b33-8cb9-954b5a2bcd69	F00221	0.07D 12MM NAGARAKU COLOR	Pestañas - Pestaña	9328.00	22000.00	19800.00	4	3	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:08.026+00	2025-07-22 20:03:08.026+00
dcec006a-88a5-4dd6-885f-000f085ee793	F00222	MARRON 0.07D Y MIX 8-14	Pestañas - Pestaña	20000.00	33000.00	29700.00	6	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:08.589+00	2025-07-22 20:03:08.589+00
82ed8a41-299a-4e8a-857f-4cfdedd7ceb0	F00223	MARRON 0.07D W 3D MIX 8-14	Pestañas - Pestaña	25000.00	35000.00	31500.00	2	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:08.987+00	2025-07-22 20:03:08.987+00
f2c3e776-e07d-40c0-9fe2-732f156c98b8	F00225	DEZHMA MIX Y	Pestañas - Pestaña	30000.00	38000.00	34200.00	8	4	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:09.777+00	2025-07-22 20:03:09.777+00
4f102cd2-e515-43c3-9320-fb02445ce85c	F00226	DEZHMA MIX 3D 	Pestañas - Pestaña	30000.00	40000.00	36000.00	5	4	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:10.106+00	2025-07-22 20:03:10.106+00
f7bd7dea-65a2-4363-9125-e3c86e95a064	F00227	DEZHMA MIX 4D 	Pestañas - Pestaña	35000.00	45000.00	40500.00	6	4	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:10.427+00	2025-07-22 20:03:10.427+00
938ad33a-a41d-4f98-b19c-100b46a3b939	F00228	DEZHMA MIX 5D 	Pestañas - Pestaña	38000.00	48000.00	43200.00	6	4	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:10.769+00	2025-07-22 20:03:10.769+00
c260160c-72a0-4b4a-86bc-6b0727051f04	F00229	PESTAÑAS CON APLIQUE DE MARIPOSA 	Pestañas - Pestaña	17762.00	26000.00	23400.00	4	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:11.088+00	2025-07-22 20:03:11.088+00
cce50b65-cd05-4752-927f-1eb95e275d49	F00230	PINZA CURVA TWEEZERS ROSA	Pestañas - Pinza	3000.00	8500.00	7650.00	19	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:03:11.408+00	2025-07-22 20:03:11.408+00
c09688b4-f85b-44da-8f42-1eedda1b618d	F00231	CERA PERLA HARD WAX VIOEMI 300G ROSE	Cejas - depilacion	10000.00	18000.00	16200.00	5	5	f	t	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:11.747+00	2025-07-22 20:03:11.747+00
68dd85bf-0ecb-427f-a6e9-327953ce6d06	F00233	PESTAÑAS PUNTO CLUSTER CLÁSICA 68	Pestañas - Pestaña	13259.00	29000.00	26100.00	25	6	t	f	22000.00	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:12.066+00	2025-07-22 20:03:12.066+00
69c0f9be-247b-4233-be52-053b19970211	F00234	PESTAÑAS PUNTO CLUSTER VOLUMEN 66	Pestañas - Pestaña	13259.00	29000.00	26100.00	22	5	t	f	22000.00	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:12.384+00	2025-07-22 20:03:12.384+00
147bbf47-7ea4-4f5a-ad7b-36d20d883379	F00235	ESPEJO RETROVISOR MARIPOSA	Pestañas - Accesorios-Pestañas	14970.00	22000.00	19800.00	0	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:12.755+00	2025-07-22 20:03:12.755+00
6a14141f-3995-4da9-b8c9-533e079bceca	F00224	0.07D Y MIX 8-15 NAGARAKU	Pestañas - Pestaña	19000.00	39000.00	35100.00	15	12	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:09.321+00	2025-08-01 16:21:21.944+00
536ee397-8092-43d2-a16e-e872f6869ab5	F00203	0.07C MIX NAGARAKU 	Pestañas - Pestaña	10500.00	21000.00	18900.00	5	3	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:01.753+00	2025-08-01 21:14:48.727+00
14ef87b3-54ce-4a34-82b0-c0e531080237	F00220	0.07D W 6D MIX 	Pestañas - Pestaña	31170.00	55000.00	49500.00	19	8	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:07.704+00	2025-08-02 17:24:22.512+00
a045dfcb-392a-4b56-b40c-1e6dd1ad4cc5	F00236	ESPEJO CUADRADO RETROVISOR	Pestañas - Accesorios-Pestañas	8305.00	22000.00	19800.00	11	6	t	f	17000.00	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:13.08+00	2025-07-22 20:03:13.08+00
11ef7537-bb53-4e65-9895-77e66eca8320	F00237	LUPA ESPEJO RETROVISOR CORAZON	Pestañas - Accesorios-Pestañas	6646.00	19000.00	17100.00	9	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:13.414+00	2025-07-22 20:03:13.414+00
4a2f8555-0279-4a2a-bae6-0bb9c05e4043	F00238	ESPEJO CORAZON BRILLOS RETROVISOR	Pestañas - Accesorios-Pestañas	15114.00	25000.00	22500.00	4	2	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:13.746+00	2025-07-22 20:03:13.746+00
bf2e7fab-4cb5-4c2d-91e8-e8aabbbc2544	F00240	VITAMINA YODI E+B3	Micropigmentacion - Hidratacion-Micropigmentacion	903.00	2200.00	1980.00	171	100	f	f	\N	80fbe3d4-73e6-4322-89aa-538b0940a416	{}	{}	\N	t	2025-07-22 20:03:14.399+00	2025-07-22 20:03:14.399+00
7a31719a-3441-4493-9890-0312aa62b5b1	F00241	CUCHILLAS DORCO X5	Cejas - Depilacion	916.00	3000.00	2700.00	24	5	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:14.745+00	2025-07-22 20:03:14.745+00
8e319863-fa04-4984-b6c4-fb654a949be5	F00242	FLOR PARA ADHESIVO *50U	Pestañas - Anillos-Pestañas	3202.00	6000.00	5400.00	9	1	f	f	\N	31c49144-e352-4c71-b743-2af1f537cf48	{}	{}	\N	t	2025-07-22 20:03:15.084+00	2025-07-22 20:03:15.084+00
3d347153-c862-4fcd-92bb-de2c847d57e8	F00243	AISLADOR DE PESTAÑAS 	Pestañas - Accesorios-Pestañas	12166.00	25000.00	22500.00	2	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:15.424+00	2025-07-22 20:03:15.424+00
f8e17045-d896-4789-8adc-485e3a12996c	F00244	PALETA PARA PESTAÑAS	Pestañas - Accesorios-Pestañas	13000.00	21000.00	18900.00	8	2	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:15.746+00	2025-07-22 20:03:15.746+00
46137b7f-a149-4f17-8657-48b2b5889da3	F00245	PALETA MARIPOSA PARA PESTAÑAS	Pestañas - Accesorios-Pestañas	26127.00	32000.00	28800.00	2	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:16.065+00	2025-07-22 20:03:16.065+00
ef0e5a2d-3204-4d6a-9af0-563dc1b0ba05	F00247	PALETA TRANSPARENTE VIDRIO PESTAÑAS	Pestañas - Accesorios-Pestañas	5220.00	10000.00	9000.00	5	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:16.389+00	2025-07-22 20:03:16.389+00
401c99d7-e1d4-4b83-966c-15edf0ca9070	F00248	TIRA PARA MARCO DE CEJAS	Cejas - Aerografos	3711.00	11000.00	9900.00	13	5	f	f	\N	db6b0d86-a6b0-4220-9994-9e66a63d7e78	{}	{}	\N	t	2025-07-22 20:03:16.718+00	2025-07-22 20:03:16.718+00
fea5312b-399b-40f3-944b-0dc4f2899a16	F00249	MEDIDOR DE PESTAÑAS 	Pestañas - Accesorios-Pestañas	1219.00	4500.00	4050.00	22	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:17.048+00	2025-07-22 20:03:17.048+00
fa21ac36-11dc-48ff-a829-3cfe936e1cb5	F00250	PARCHES REUTULIZABLES PARA LIFTING	Pestañas - Accesorios-Pestañas	7000.00	12000.00	10800.00	1	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:17.366+00	2025-07-22 20:03:17.366+00
12d500e6-eb4f-4f4c-98c0-a9672e07c20c	F00251	POMADA DE MARCACION PARA MICROPIGMENTACION	Cejas - Depilacion	11000.00	21000.00	18900.00	9	5	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:17.698+00	2025-07-22 20:03:17.698+00
10dba515-fe9d-452f-b7c7-7d68063438d5	F00252	ESPONJA PARA PRACTICA ROSADA U	Pestañas - Accesorios-Pestañas	700.00	1200.00	1080.00	134	10	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:18.015+00	2025-07-22 20:03:18.015+00
e4896d33-8492-49ad-94b0-ebaa73b6e1f5	F00254	MANTEQUILLA HIDRATANTE X 20GR PROTÓN	Micropigmentacion - Hidratacion-Micropigmentacion	5477.00	11000.00	9900.00	0	5	f	t	\N	80fbe3d4-73e6-4322-89aa-538b0940a416	{}	{}	\N	t	2025-07-22 20:03:18.336+00	2025-07-22 20:03:18.336+00
f4fc19c8-056e-4449-808b-15fa74bd4e73	F00255	MANTEQUILLA HIDRATANTE X 20GR CEREZA	Micropigmentacion - Hidratacion-Micropigmentacion	5477.00	11000.00	9900.00	7	5	f	t	\N	80fbe3d4-73e6-4322-89aa-538b0940a416	{}	{}	\N	t	2025-07-22 20:03:18.659+00	2025-07-22 20:03:18.659+00
460ef631-8b03-45f1-8396-cb1ef061439f	F00256	EXFOLIANTE PARA CEJAS SANDIA	Micropigmentacion - Hidratacion-Micropigmentacion	14468.00	28000.00	25200.00	8	5	f	t	\N	80fbe3d4-73e6-4322-89aa-538b0940a416	{}	{}	\N	t	2025-07-22 20:03:18.975+00	2025-07-22 20:03:18.975+00
ac064368-6933-4daf-9d64-12ae66d8f222	F00261	MALETA PARA LASHISTA GRANDE	Pestañas - Accesorios-Pestañas	89298.00	130000.00	117000.00	1	1	f	t	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:20.608+00	2025-07-22 20:03:20.608+00
53b8d404-7a63-452c-8a35-bbd15ee7fdde	F00262	ROSETAS PARA ADHESIVO X UNIDAD	Pestañas - Adhesivos	233.00	700.00	630.00	123	12	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{}	\N	t	2025-07-22 20:03:20.942+00	2025-07-22 20:03:20.942+00
2b7ecf30-96c5-4909-b4ea-1573564ed0ed	F00263	STIKER AISLANTE PARPADO PRO	Pestañas - Cintas	7236.00	11000.00	9900.00	7	2	f	t	\N	5efe5221-b32e-413b-8672-73ec8f98d028	{}	{}	\N	t	2025-07-22 20:03:21.276+00	2025-07-22 20:03:21.276+00
ec6794ee-09ed-43a6-938a-18360de055f7	F00264	COBAN 	Micropigmentacion - Accesorios-Micropigmentacion	2300.00	6500.00	5850.00	100	30	f	t	\N	de7923ed-199b-49a7-acbc-7d5c95602030	{}	{}	\N	t	2025-07-22 20:03:21.597+00	2025-07-22 20:03:21.597+00
d799512b-4038-4816-b010-26fe09bafd26	F00265	DESTAPADOR ADHESIVO	Pestañas - Adhesivos	4652.00	9000.00	8100.00	14	5	f	f	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{}	\N	t	2025-07-22 20:03:21.922+00	2025-07-22 20:03:21.922+00
0b124a02-f3a6-40a7-83fe-cfd506d1146e	F00267	REPUESTOS MEZCLADOR HENNA X UNIDAD	Cejas - Henna	173.00	500.00	450.00	75	5	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:22.577+00	2025-07-22 20:03:22.577+00
7e0cf72b-5658-47a8-a424-126e26bcca82	F00268	PALETA LIFTING FUCSIA	Pestañas - Accesorios-Pestañas	1500.00	3000.00	2700.00	14	10	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:22.899+00	2025-07-22 20:03:22.899+00
3e24d379-0974-4959-876f-8b1dda0078ed	F00269	PINZA PALETA DOBLE LARGA LIFTING 	Pestañas - Pinza	410.81	1500.00	1350.00	13	10	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:03:23.232+00	2025-07-22 20:03:23.232+00
728933dc-6727-4505-a2bf-7952a095bdcc	F00270	LUPA ESPEJO ROSADA 	Pestañas - Accesorios-Pestañas	2000.00	4500.00	4050.00	6	6	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:23.554+00	2025-07-22 20:03:23.554+00
ff46d39c-e0ba-4542-91ae-439b357a4b3e	F00271	BIGUDIES CORONA ROSADOS	El "BIGUDIES CORONA ROSADOS" es tu aliado ideal para realzar la belleza de tus pestañas con estilo y dejarles la mejor horma. Creados bajo la categoría de "LIFTING", estos bigudies rosados ofrecen una solución innovadora y efectiva para resaltar tu mirada de forma única. ¡Potencia tu belleza con Fucsiainsumos! ¡Hazte con los tuyos ahora y eleva tu look al siguiente nivel!	10526.00	40000.00	36000.00	8	5	t	f	37000.00	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:23.883+00	2025-07-22 20:03:23.883+00
c71fbffa-e181-4fa6-add3-9ff46999ea68	F00272	BIGUDIES INFERIORES MORADOS	Pestañas - Lifting	9243.00	15000.00	13500.00	5	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:24.203+00	2025-07-22 20:03:24.203+00
e00ff441-8fee-47f8-8119-27cd02b0cbd6	F00302	CASTAÑO CLARO HENNA BEAUTY	Cejas - Henna	11468.00	22000.00	19800.00	11	5	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:33.564+00	2025-07-22 20:03:33.564+00
c8cc8ffc-90bb-494d-8193-316c97c600fc	F00257	ANESTESIA TKTX 55%	Micropigmentacion - Anestesias	16257.00	26000.00	23400.00	14	4	f	t	\N	3c196b55-5493-4ad3-a326-caf63389974b	{"anestesia topica",tktx}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753557461/fucsia-products/lrsj4qec1pvhb7eeajfk.webp}	{}	t	2025-07-22 20:03:19.302+00	2025-07-26 19:17:42.005+00
621d294a-b1fd-40db-bc78-ee5b81ce5cc6	F00260	MALETA PEQUEÑA CON DIVISIONES	Pestañas - Accesorios-Pestañas	50064.00	80000.00	72000.00	1	5	f	t	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:20.283+00	2025-07-31 21:43:32.441+00
12bc46fe-77dc-4d29-a5ad-ea3c551048e8	F00266	CINTA LEVANTAMIENTO BLANCA/ROSADA	Pestañas - Cintas	853.00	2000.00	1800.00	26	20	f	f	\N	5efe5221-b32e-413b-8672-73ec8f98d028	{}	{}	\N	t	2025-07-22 20:03:22.256+00	2025-08-01 21:09:27.784+00
25b28307-044c-4431-b78b-5bac35dee657	F00239	VITAMINA A+ VITAMINA E 	Micropigmentacion - Hidratacion-Micropigmentacion	707.00	1500.00	1350.00	265	100	f	t	\N	80fbe3d4-73e6-4322-89aa-538b0940a416	{}	{}	\N	t	2025-07-22 20:03:14.074+00	2025-08-02 17:15:54.588+00
1fb08599-e5c7-4a20-8833-8750edf913e3	F00273	BIGUDI ALTA RESISTENCIA X6 UNDS COLORES TALLA S M Y L 	La nueva colección de BIGUDI ALTA RESISTENCIA X6 UNDS en colores vibrantes llegó para potenciar tu belleza de manera única. Con tallas S, M y L, lograrás un levantamiento perfecto en tus pestañas.  resaltando tu mirada de forma natural y duradera. ¡Descubre la calidad y resistencia que solo Fucsiainsumos puede ofrecerte! ¡Potencia tu belleza hoy mismo!	2049.00	7000.00	6300.00	2	6	t	f	9500.00	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:24.521+00	2025-07-22 20:03:24.521+00
0ba14a50-a134-40ac-9a5c-d06652e566a0	F00274	ANILLOS CON TAPA X100	Micropigmentacion - Anillos-Micropigmentacion	10000.00	17000.00	15300.00	6	5	f	t	\N	82cc227d-8d5e-44a6-976b-6cc94c8945cf	{}	{}	\N	t	2025-07-22 20:03:24.844+00	2025-07-22 20:03:24.844+00
f1793ee4-921b-4d3a-b30f-604ef147568e	F00275	ANILLO SILICONA X 100	Micropigmentacion - Anillos-Micropigmentacion	4703.00	10000.00	9000.00	63	6	t	t	11000.00	82cc227d-8d5e-44a6-976b-6cc94c8945cf	{}	{}	\N	t	2025-07-22 20:03:25.17+00	2025-07-22 20:03:25.17+00
f295b835-0031-41e9-8a42-7249973241bc	F00276	ANILLOS SIN DIVISIÓN X100	Pestañas - Pestaña	1751.00	7000.00	6300.00	30	12	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:25.493+00	2025-07-22 20:03:25.493+00
ab3d9f4c-c135-4a39-8ac6-78f0b4cc839b	F00277	ANILLOS CON DIVISIÓN X100	Pestañas - Pestaña	1751.00	7000.00	6300.00	26	15	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:25.819+00	2025-07-22 20:03:25.819+00
3c273221-33ac-4381-a90e-8055dd84f0e0	F00278	ANILLOS PARA ARMAR ABANICOS CORAZON X100	Material ergonómico: el soporte para pegamento de extensión de pestañas está hecho de plástico de alta calidad que es duradero, no tiene olor peculiar y es seguro de usar. Además, la superficie lisa del soporte del anillo reduce la adherencia no deseada de cualquier pegamento, líquido o pigmento\nAdhesivo y ajustable: estos anillos de pegamento para pestañas con cinta adhesiva y extremos abiertos los hacen flexibles y fáciles de ajustar. Se puede estirar sin romperse para adaptarse a la mayoría de tamaños y hacer que tus dedos se sientan cómodos en el trabajo\nDesechable y fácil de usar: el soporte para pegamento para pestañas funciona muy bien con cepillos de precisión para hacer pequeños retoques detallados una cincha sin problemas. Las copas profundas evitan el goteo de productos a base de líquidos. Lo mejor para un uso rápido, fácil de limpiar, se puede desechar después de un solo uso	5000.00	10000.00	9000.00	5	12	f	t	\N	31c49144-e352-4c71-b743-2af1f537cf48	{}	{}	\N	t	2025-07-22 20:03:26.137+00	2025-07-22 20:03:26.137+00
b6f34ae0-2ca1-4065-9647-ff05aea96bbf	F00280	KIT LAMINADO DQ CEJAS GRANDE	El "KIT LAMINADO DQ CEJAS GRANDE" de Fucsiainsumos es el aliado perfecto para realzar tu mirada. Con tecnología de vanguardia y resultados duraderos, este kit garantiza cejas perfectamente definidas y con un efecto laminado profesional. ¡Experimenta la belleza y la confianza que brinda un look impecable en cada mirada! Haz tuyos unos ojos cautivadores con Fucsiainsumos. 	50000.00	90000.00	81000.00	5	4	t	f	75000.00	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{}	\N	t	2025-07-22 20:03:26.784+00	2025-07-22 20:03:26.784+00
3fb1cf54-c7eb-47f0-b128-e2b7b50a5b6b	F00281	KIT LAMINADO DQ DE CEJAS PEQUEÑO	Cejas - Laminado	20534.00	35000.00	31500.00	0	6	f	f	\N	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{}	\N	t	2025-07-22 20:03:27.103+00	2025-07-22 20:03:27.103+00
b593f298-36c1-4ebf-b4e2-7ddb06dd09d7	F00284	MICROBRUSH X 100 	Accesorios - Accesorios-varios	2377.00	8000.00	7200.00	152	12	f	f	\N	56ce58c6-380f-4fa9-8500-b2b302dc92a0	{}	{}	\N	t	2025-07-22 20:03:27.752+00	2025-07-22 20:03:27.752+00
76cd511e-6e74-47d6-aef2-8d854c7bb74c	F00285	CAMPO DE MESA X50 ROSADO / NEGRO 	Accesorios - Accesorios-varios	14182.00	24000.00	21600.00	21	12	f	t	\N	56ce58c6-380f-4fa9-8500-b2b302dc92a0	{}	{}	\N	t	2025-07-22 20:03:28.071+00	2025-07-22 20:03:28.071+00
93e1582b-f179-47b8-a480-a57ac1d6c9c1	F00286	APLICADORES X50	Accesorios - Accesorios-varios	6145.00	9000.00	9000.00	104	100	f	t	\N	56ce58c6-380f-4fa9-8500-b2b302dc92a0	{}	{}	\N	t	2025-07-22 20:03:28.392+00	2025-07-22 20:03:28.392+00
0c32e1ef-d594-4057-935b-2428203dbb56	F00288	PESTAÑAS DE PRACTICA 8MM	Pestañas - Accesorios-Pestañas	6710.00	14000.00	12600.00	21	6	f	t	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:29.042+00	2025-07-22 20:03:29.042+00
c25e3d37-5e26-4ef4-881d-ad3c5236f9a1	F00289	AGUJA THUNDER 1P 0.25	Micropigmentacion - Agujas-Micropigmentacion	3060.00	6000.00	5400.00	32	60	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:03:29.367+00	2025-07-22 20:03:29.367+00
d5c33818-42d9-4f3b-9494-4fdde4355666	F00290	AGUJA THUNDER 1P RS 0.35	Micropigmentacion - Agujas-Micropigmentacion	3060.00	6000.00	5400.00	0	5	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:03:29.694+00	2025-07-22 20:03:29.694+00
ea6fdb23-7696-4382-ab32-208eb3620773	F00291	AGUJA THUNDER 3RS 0.30	Micropigmentacion - Agujas-Micropigmentacion	3060.00	6000.00	5400.00	64	60	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:03:30.03+00	2025-07-22 20:03:30.03+00
7293067f-553b-4492-9349-e910fb520d51	F00292	7CF 0.25 AGUJA MICROBLADING SESGADA	Micropigmentacion - Microblading	1000.00	3500.00	3150.00	12	5	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{}	\N	t	2025-07-22 20:03:30.354+00	2025-07-22 20:03:30.354+00
2904ca17-977a-4aa4-99d6-b57e71519f21	F00293	5 PUNTAS AGUJA MICROBLADING PUNTILLISMO	Micropigmentacion - Microblading	1000.00	3500.00	3150.00	6	5	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{}	\N	t	2025-07-22 20:03:30.673+00	2025-07-22 20:03:30.673+00
f1e02220-57aa-4b6a-a820-798b6b349dba	F00294	19U 0.18 AGUJA MICROBLADING LENGUA DE GATO	Micropigmentacion - Microblading	1000.00	3500.00	3150.00	0	5	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{}	\N	t	2025-07-22 20:03:30.994+00	2025-07-22 20:03:30.994+00
4c6b6752-4a30-4b07-9895-3cb36f163aff	F00295	ORGANIZADOR ACRILICO TRANSPARENTE	Organización - Acrilicos	18500.00	26000.00	23400.00	4	5	f	f	\N	aa47efdd-6485-45b1-b1f6-cde44e771a89	{}	{}	\N	t	2025-07-22 20:03:31.314+00	2025-07-22 20:03:31.314+00
3c680f25-0131-4daf-877f-385986968d78	F00296	12U 0.18 MICROBLADING LENGUA DE GATO	Micropigmentacion - Microblading	1000.00	3500.00	3150.00	12	5	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{}	\N	t	2025-07-22 20:03:31.636+00	2025-07-22 20:03:31.636+00
99c6d4d3-c126-4bca-83e3-b835cdcac42b	F00297	16U 0.25 AGUJA MICROBLADING LENGUA DE GATO	Micropigmentacion - Microblading	1000.00	3500.00	3150.00	9	5	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{}	\N	t	2025-07-22 20:03:31.96+00	2025-07-22 20:03:31.96+00
cb640a38-6965-4963-ba6c-e7cfb657b7a6	F00298	18U 0.18 AGUJA MICROBLADING LENGUA DE GATO	Micropigmentacion - Microblading	1000.00	3500.00	3150.00	23	5	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{}	\N	t	2025-07-22 20:03:32.282+00	2025-07-22 20:03:32.282+00
aa10c693-ee7f-48cf-8854-e5e2057d465c	F00299	21U 0.18 AGUJA MICROBLADING LENGUA DE GATO	Micropigmentacion - Microblading	1000.00	3500.00	3150.00	0	5	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{}	\N	t	2025-07-22 20:03:32.603+00	2025-07-22 20:03:32.603+00
6e2e63af-4fa7-42d9-8130-951d226169dd	F00300	AGUJA PERLA NEGRA 1RL 0.25 - 0.30	Micropigmentacion - Agujas-Micropigmentacion	2997.00	5000.00	4500.00	50	50	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:03:32.925+00	2025-07-22 20:03:32.925+00
7b1858f8-0dd3-4e5d-ae3a-e7bf94ae10ea	F00287	CEPILLOS X 50 UND	Una gran manera de mantener la máscara limpia, la cabeza de cepillo suave pero firme puede obtener cada pequeña pestaña.\nEl cabezal del cepillo es flexible, puedes obtener cualquier ángulo que desees.\nLa cabeza tipo tornillo es fácil de enrollar las pestañas y peinar las cejas que hacen que las raíces de las pestañas sean más claras y naturales.	4459.00	8500.00	7650.00	160	50	f	t	\N	56ce58c6-380f-4fa9-8500-b2b302dc92a0	{}	{}	\N	t	2025-07-22 20:03:28.716+00	2025-08-01 21:09:27.724+00
37536919-a91f-4b76-9df1-1554758f4e32	F00283	KIT BEAUTY LAMINADO PEQUEÑO	Cejas - Laminado	36182.00	53000.00	47700.00	3	4	f	t	\N	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{}	\N	t	2025-07-22 20:03:27.434+00	2025-08-02 14:30:37.465+00
d30b247f-76cf-481d-9a0d-7c2a5b811bb8	F00303	NEGRO HENNA BEAUTY	Cejas - Henna	12141.00	22000.00	19800.00	5	5	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:33.904+00	2025-07-22 20:03:33.904+00
beb3f0d3-9431-4026-926f-71720a6a1d00	F00304	PAPEL OSMOTICO 	Pestañas - Lifing	3522.00	12000.00	10800.00	11	10	t	t	10000.00	ee4b89d5-f19b-48b5-9b69-e8d764849d83	{}	{}	\N	t	2025-07-22 20:03:34.223+00	2025-07-22 20:03:34.223+00
d2df4d02-4e1d-4365-a308-800ed25d77c2	F00305	LAPICEROS EN GEL ROSADO	Cejas - Marcacion	2735.00	13000.00	11700.00	30	10	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:03:34.54+00	2025-07-22 20:03:34.54+00
55f22ad6-eb30-44d0-9202-1363c3801781	F00308	PERFILADORES *3	Cejas - Depilacion	1935.00	5000.00	4500.00	6	5	f	t	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:35.197+00	2025-07-22 20:03:35.197+00
486a29bc-dc55-402c-9ecc-56442b87907c	F00309	CERA 250 MLG NATURAL	Cejas - Depilacion	15000.00	17500.00	15750.00	6	3	f	t	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:35.518+00	2025-07-22 20:03:35.518+00
5dbd1387-4163-43cc-b9dc-5c02e60a9c37	F00310	ALMOHADA PARA LASHISTA	Pestañas - Accesorios-Pestañas	66585.00	95000.00	85500.00	7	1	t	t	90000.00	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:03:35.839+00	2025-07-22 20:03:35.839+00
25d37760-2857-4f2c-9479-7d9f3a6ad2e3	F00311	SABANA ELASTICA CUBRE CAMILLA	Accesorios - Accesorios-varios	40324.00	55000.00	49500.00	8	2	f	t	\N	56ce58c6-380f-4fa9-8500-b2b302dc92a0	{}	{}	\N	t	2025-07-22 20:03:36.18+00	2025-07-22 20:03:36.18+00
3870e7e4-9ddd-4cbd-80be-d15ba01b5fbe	F00312	AGUJA DERMAPEN NANO	Piel - Agujas-Piel	4000.00	5500.00	4950.00	29	5	f	t	\N	a8bc7e68-cf10-4d78-aa09-1e589e3a03ce	{}	{}	\N	t	2025-07-22 20:03:36.503+00	2025-07-22 20:03:36.503+00
59de2ac9-daf4-4bdb-8371-1e995ac95a2e	F00313	AGUJA DERMAPEN 12 PUNTAS	Piel - Agujas-Piel	4000.00	5500.00	4950.00	25	5	f	t	\N	a8bc7e68-cf10-4d78-aa09-1e589e3a03ce	{}	{}	\N	t	2025-07-22 20:03:36.827+00	2025-07-22 20:03:36.827+00
06592b50-0526-4d86-9fee-f42fecefd853	F00314	AGUJA DERMAPEN 36 AGUJAS 	Piel - Agujas-Piel	3625.00	5500.00	4950.00	52	5	f	t	\N	a8bc7e68-cf10-4d78-aa09-1e589e3a03ce	{}	{}	\N	t	2025-07-22 20:03:37.157+00	2025-07-22 20:03:37.157+00
0c277811-5e4f-42ce-a964-ed9b168c08b1	F00315	AGUJA DERMAPEN 42 PUNTAS	Piel - Agujas-Piel	4000.00	5500.00	4950.00	23	5	f	t	\N	a8bc7e68-cf10-4d78-aa09-1e589e3a03ce	{}	{}	\N	t	2025-07-22 20:03:37.504+00	2025-07-22 20:03:37.504+00
b46909ae-2bcf-40e1-b9f0-35bcb3095b15	F00317	AGUJA CHARMANT 2 1RL	Micropigmentacion - Agujas-Micropigmentacion	4000.00	7000.00	6300.00	2	2	f	f	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:03:38.152+00	2025-07-22 20:03:38.152+00
fb6bfdb4-4c00-4a3a-8cfc-50360f57a956	F00318	AGUJA CHARMANT 1 1RL	Micropigmentacion - Agujas-Micropigmentacion	4000.00	7000.00	6300.00	2	2	f	f	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:03:38.474+00	2025-07-22 20:03:38.474+00
9a4b6645-c04e-4197-bfd1-e6dbde9d7440	F00319	AGUJA CHARMANT 2 2 PUNTAS	Micropigmentacion - Agujas-Micropigmentacion	4000.00	7000.00	6300.00	2	5	f	f	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:03:38.801+00	2025-07-22 20:03:38.801+00
1b11ea43-3059-42aa-a49c-d4aa6f51bd40	F00320	APLICADOR DE HENNA LUJO	Cejas - Henna	5243.00	9000.00	8100.00	38	5	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:39.143+00	2025-07-22 20:03:39.143+00
7e6f76d3-a531-4d4d-8893-50a9cfb49a8e	F00321	APLICADORES DE HENNA X100 U	Cejas - Henna	2180.00	7000.00	6300.00	80	6	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:39.467+00	2025-07-22 20:03:39.467+00
b5613695-b9d6-4277-8ad0-cdf5884dae45	F00323	HENNA CAFE CLARO DQ	Cejas - Henna	20499.00	40000.00	36000.00	16	3	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:40.109+00	2025-07-22 20:03:40.109+00
e47f3170-8b97-4278-99ad-11ac2d3cdf15	F00324	HENNA CAFE OSCURO DQ	Cejas - Henna	20717.00	40000.00	36000.00	0	5	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:40.43+00	2025-07-22 20:03:40.43+00
505c27a3-6e55-4b9f-9374-d7f0d3cd8a04	F00325	HENNA CASTAÑO OSCURO DQ	Cejas - Henna	20587.00	40000.00	36000.00	5	3	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:40.754+00	2025-07-22 20:03:40.754+00
e0d6cf72-592e-4024-bcb4-f77ed3ee8b20	F00326	HENNA CHOCOLATE DQ	Cejas - Henna	20499.00	40000.00	36000.00	9	3	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:41.129+00	2025-07-22 20:03:41.129+00
e17e926a-b261-4a1e-962a-7ca6641e5273	F00327	BOTOX DQ PARA CEJAS PESTAÑAS	Pestañas - Hidratacion-Pestañas	12619.00	23000.00	20700.00	6	4	f	f	\N	87f3bbdb-980d-4f28-9bc4-b9022639904b	{}	{}	\N	t	2025-07-22 20:03:41.465+00	2025-07-22 20:03:41.465+00
e4107fca-bc6b-40a0-9f0c-4baefd25a459	F00329	PRIMER DQ	Pestañas - Primer	7895.00	18000.00	16200.00	10	5	f	f	\N	eba6e6f9-16a5-4ce1-8e32-ae660ab880e1	{}	{}	\N	t	2025-07-22 20:03:41.804+00	2025-07-22 20:03:41.804+00
36d07a48-951c-4940-b576-d9f5fe3d462c	F00328	KIT LIFTING  DQ	Pestañas - Lifting	58534.00	75000.00	67500.00	2	6	t	f	60000.00	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:42.123+00	2025-07-22 20:03:42.123+00
1532c86b-f72c-40b1-ac70-9ef4dcdccc5a	F00330	PIGMENTO PURÉ DARK CHOCO	Micropigmentacion - Pigmentos	16133.00	22000.00	19800.00	5	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:03:42.448+00	2025-07-22 20:03:42.448+00
57e5c876-f106-4a24-b770-3a19e2811d27	F00331	PASO 2 LIFTING DQ	Pestañas - Lifting	10534.00	16000.00	14400.00	3	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:42.772+00	2025-07-22 20:03:42.772+00
f39640bd-2aaa-4472-aa90-82ecf41d69b5	F00332	PASO 3 LIFTING DQ	Pestañas - Lifting	10534.00	16000.00	14400.00	3	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:43.094+00	2025-07-22 20:03:43.094+00
f4691fc6-3012-43d9-b9a8-1d7a811675b7	F00333	PASO 4 LIFTING DQ	Pestañas - Lifting	10534.00	16000.00	14400.00	11	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:43.412+00	2025-07-22 20:03:43.412+00
cca0ab97-7169-497e-b693-b967ab7b0f63	F00334	SERUM FORTALECEDOR DE PESTAÑAS DQ	Pestañas - Hidratacion-Pestañas	10619.00	18000.00	16200.00	2	5	f	f	\N	87f3bbdb-980d-4f28-9bc4-b9022639904b	{}	{}	\N	t	2025-07-22 20:03:43.731+00	2025-07-22 20:03:43.731+00
96498f94-646d-46b6-b8a9-360992cf9b1f	F00335	TINTE PARA PESTAÑAS DQ 	Pestañas - Lifting	10619.00	22000.00	19800.00	5	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:44.053+00	2025-07-22 20:03:44.053+00
bf5e400d-3214-45be-a6f5-cd0259fde221	F00336	KIT LIFTING ICONSING	Pestañas - Lifting	33400.00	55000.00	49500.00	4	6	f	t	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:44.373+00	2025-07-22 20:03:44.373+00
8c9e8ec5-60cc-4b37-aa51-714c2ddba5f2	F00337	ROLLO LIENZO MIRACLE	Cejas - Depilacion	13940.00	19000.00	17100.00	5	5	f	t	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:44.691+00	2025-07-22 20:03:44.691+00
4668d778-875a-4ff3-8866-e2e59c84d9d3	F00338	LIENZO PARA DEPILACION *5 U	Cejas - Depilacion	700.00	2500.00	2250.00	2	10	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:45.018+00	2025-07-22 20:03:45.018+00
12db80b7-ae78-48cc-8338-15a20b0b2672	F00339	REMOVEDOR DE HENNA DQ *30 ML	Cejas - Henna	5537.00	15000.00	13500.00	9	4	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:45.341+00	2025-07-22 20:03:45.341+00
1b89e7cc-cedd-4f02-ac5a-7b2bf121d49d	F00340	PEGA SALON PRO	Pestañas - Adhesivos	7900.00	13000.00	11700.00	54	2	f	f	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{}	\N	t	2025-07-22 20:03:45.667+00	2025-07-22 20:03:45.667+00
018564d1-6cb9-479f-995e-001b351f63ce	F00341	TINTE PARA PESTAÑAS 	Pestañas - Lifting	7413.00	15000.00	13500.00	17	6	f	t	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:45.991+00	2025-07-22 20:03:45.991+00
6191a97c-37dd-4eb8-b3be-17b92f616043	F00342	AGUA DE ROSAS 35ML	Piel - Hidratacion-Piel	2620.00	4000.00	3600.00	2	4	f	f	\N	6562fd99-f728-4961-9983-f4adc2ec60ca	{}	{}	\N	t	2025-07-22 20:03:46.31+00	2025-07-22 20:03:46.31+00
65a83ea6-4f2b-4843-ad17-c19fce2cf866	F00343	KIT LIFTING VIOEMI	Pestañas - Lifting	36702.00	55000.00	49500.00	2	4	f	t	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:46.63+00	2025-07-22 20:03:46.63+00
236e5eec-03b6-4343-b998-6ec2049f2bd9	F00344	KIT LIFTING WAVE 	Pestañas - Lifting	38200.00	60000.00	54000.00	9	4	t	t	55000.00	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:46.954+00	2025-07-22 20:03:46.954+00
4554a12b-364d-49bd-9f62-e0ebd5ae6459	F00322	DEZHMA SELECT	Pestañas - Adhesivos	54500.00	85000.00	76500.00	6	6	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{}	\N	t	2025-07-22 20:03:39.787+00	2025-08-01 21:09:27.705+00
74af35f2-0f29-46ed-ba04-814cd7ccd9c9	F00316	CERA VIOEMI ROSE 800G	Cejas - Depilacion	25500.00	40000.00	36000.00	1	2	f	t	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:37.831+00	2025-08-02 17:08:40.974+00
d472d31d-42f0-4bc5-8bf3-15c05d57f51b	F00345	ADHESIVO PARA LIFTING PESTAÑAS	Pestañas - Lifting	10388.00	19000.00	17100.00	12	6	f	t	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:03:47.273+00	2025-07-22 20:03:47.273+00
e8002f4d-be0f-45b1-8242-c2b8fa1738b1	F00346	PRIMER- BANANA 10ML	Pestañas - Primer	6800.00	16000.00	14400.00	8	12	f	t	\N	eba6e6f9-16a5-4ce1-8e32-ae660ab880e1	{}	{}	\N	t	2025-07-22 20:03:47.611+00	2025-07-22 20:03:47.611+00
7ceb4355-6703-4152-92b4-2f4758d55bb6	F00348	OPTIVISOR CON LUZ LED	Accesorios - Optivisores	28640.00	45000.00	40500.00	4	5	f	t	\N	fa7e3c65-5e90-4b1e-9b2b-12a94a76385c	{}	{}	\N	t	2025-07-22 20:03:48.265+00	2025-07-22 20:03:48.265+00
f9546170-8c90-46c6-9130-b2a608dbeb1b	F00350	MORTERO CORAZON O FLOR	Cejas - Henna	5028.00	7000.00	6300.00	0	2	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:48.913+00	2025-07-22 20:03:48.913+00
e7729190-1cd3-40eb-92ee-32537ddf1f0d	F00351	PEGA ARDELL 	Pestañas - Adhesivos	12127.00	17000.00	15300.00	1	5	f	f	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{}	\N	t	2025-07-22 20:03:49.234+00	2025-07-22 20:03:49.234+00
e773c5fe-01c1-4b37-ae07-4065ebf24230	F00352	PESTAÑAS TIRA ATENEA	Pestañas - Pestaña	7821.00	12000.00	10800.00	3	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:03:49.555+00	2025-07-22 20:03:49.555+00
7165afb6-9b60-45e4-9953-df24781b553f	F00353	TANQUE PARA ADHESIVOS BLANCO / ROSADO	Accesorios - Tanques Adhesivos	12000.00	21000.00	18900.00	7	6	f	f	\N	40912d36-64c9-42c6-928d-a9281164c891	{}	{}	\N	t	2025-07-22 20:03:49.873+00	2025-07-22 20:03:49.873+00
86cebe90-2657-4488-b60e-be01c6a04cc0	F00354	TANQUE PARA ADHESIVOS ROSADO/NEGRO/BLANCO	Accesorios - Tanques Adhesivos	7800.00	14000.00	12600.00	21	6	f	f	\N	40912d36-64c9-42c6-928d-a9281164c891	{}	{}	\N	t	2025-07-22 20:03:50.191+00	2025-07-22 20:03:50.191+00
32d29581-f135-4530-be35-5a37b0e68b86	F00355	NANOMISTER BLANCO / AZUL / ROSADO	Accesorios - Nanomisters	8955.00	20000.00	18000.00	32	12	f	f	\N	a7ec1206-acef-4afb-a63b-bc5ca09f6d0a	{}	{}	\N	t	2025-07-22 20:03:50.51+00	2025-07-22 20:03:50.51+00
4d93001c-f9cc-40af-a514-d4801eb8f53a	F00356	NANOMISTER GOTA ROSADO/BLANCO	Accesorios - Nanomisters	10243.00	25000.00	22500.00	11	5	f	f	\N	a7ec1206-acef-4afb-a63b-bc5ca09f6d0a	{}	{}	\N	t	2025-07-22 20:03:50.834+00	2025-07-22 20:03:50.834+00
82eb7f8c-2d41-4a5e-82f5-618aa50347be	F00357	LAPIZ QUIRURGICO NEGRO 	Cejas - Marcacion	7000.00	10000.00	9500.00	47	20	f	f	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:03:51.159+00	2025-07-22 20:03:51.159+00
2d9592b0-c2e5-41c5-8e7c-5be9a7f5ec24	F00358	HENNA MENELA RUBIO OSCURO 	Cejas - Henna	52000.00	63000.00	56700.00	0	3	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:51.481+00	2025-07-22 20:03:51.481+00
b43e2cfa-2f5e-4bcd-b4b1-69f0e4ab40b0	F00359	MICROPORE BLANCO 	Accesorios - Cintas-Accesorios	1100.00	3000.00	2700.00	21	50	f	f	\N	0fa132a0-f358-49ad-86ea-e0fff769dea7	{}	{}	\N	t	2025-07-22 20:03:51.803+00	2025-07-22 20:03:51.803+00
8d5c1c14-f77a-42a8-ab67-5086d7bf9623	F00360	ORGANIZADOR DE PESTAÑAS	Accesorios - Organización-Accesorios	24846.00	38000.00	34200.00	2	5	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:03:52.123+00	2025-07-22 20:03:52.123+00
c64e7a2e-1566-4e7a-9a53-bc5e589c5f48	F00361	CERA 250 MLG ALOE	"¡Descubre el cuidado suave y efectivo de la ceramiel Belotti Aloe! 🌿✨ Esta fórmula, elaborada con ingredientes naturales, favorece la extracción del vello desde la raíz, ofreciendo resultados duraderos y efectivos. Es ideal para pieles sensibles, proporcionando una experiencia agradable y calmante. Gracias al Aloe Vera, calma, hidrata y protege tu piel durante la depilación. ¡Dale a tu piel el cuidado que se merece con Belotti Aloe! 💚	8835.00	17500.00	15750.00	8	6	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:52.481+00	2025-07-22 20:03:52.481+00
3655b78f-bf00-4c5a-b2c3-cc438464f73f	F00363	CERA 250 MLG CHOCOLATE	¡Descubre la innovadora ceramiel Belotti Chocolate! 🍫🌿 Formulada con ingredientes naturales, esta cera favorece una extracción eficaz del vello desde la raíz, mientras que el cacao aporta propiedades calmantes e hidratantes, ideal para pieles maltratadas y secas. ¡Disfruta de una piel suave y delicada con un toque de chocolate! ✨	8835.00	17500.00	15750.00	7	6	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:53.157+00	2025-07-22 20:03:53.157+00
2d7a92d6-e6ec-41cd-9534-85937c6bd4a4	F00364	CERA 250 MLG ORO	"¡Déjate cautivar por la elegancia y efectividad de la ceramiel Belotti Oro! 💫🌿 Formulada con ingredientes naturales, esta cera favorece una extracción del vello desde la raíz, mientras que las partículas doradas y su textura fina añaden un toque de lujo a tu rutina de cuidado. Apto para todo tipo de piel, esta ceramiel te brinda suavidad y resultados impecables. ✨	8836.00	17500.00	15750.00	4	6	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:53.488+00	2025-07-22 20:03:53.488+00
f6935b5a-5671-4f9b-9c50-7699004827ee	F00365	CERA 250 MLG AZULENO	"¡Descubre el poder calmante y efectivo de la ceramiel Belotti Azuleno! 💙🌿 Esta fórmula, elaborada con ingredientes naturales como aloe vera, manzanilla y miel, ofrece una experiencia de depilación única. Además, el azuleno presente en la fórmula disminuye el dolor y brinda un efecto relajante y refrescante. ¡Dale a tu piel el cuidado que se merece con Belotti Azuleno! ✨ 	8835.00	17500.00	15750.00	4	10	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:53.837+00	2025-07-22 20:03:53.837+00
1aa569bd-197d-4856-afac-69444ff0c9b5	F00366	OLLA PARA CERA METALICA ROSADA/MORADA	Cejas - Depilacion	35557.00	58000.00	52200.00	8	5	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:54.17+00	2025-07-22 20:03:54.17+00
db49ea69-b5de-4eec-ae8b-83367a41ad1c	F00367	PINZA RECTA TWEEZERS ROSA	Pestañas - Pinza	3000.00	8500.00	7650.00	30	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:03:54.51+00	2025-07-22 20:03:54.51+00
8fb1661f-4744-4078-bbb5-1435ba2a3390	F00368	CERA EN PERLAS X100 GR	Cejas - Depilacion	4528.00	8000.00	7200.00	2	2	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:54.845+00	2025-07-22 20:03:54.845+00
f9f012b6-b1d9-4c2e-9d2a-dd994d361ca1	F00369	CERA ROLL ON KONSUNG	Cejas - Depilacion	5938.00	11000.00	9900.00	1	2	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:55.182+00	2025-07-22 20:03:55.182+00
ed113043-2fab-4c6a-a780-db07fa9fbb37	F00370	CALENTADOR CERA VIOEMI ROLL ON	Cejas - Depilacion	19048.00	32000.00	28800.00	3	5	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:55.514+00	2025-07-22 20:03:55.514+00
4b8190b1-cadf-4dac-b1d7-ab60d0bedd36	F00371	CALENTADOR CERA ROLL ON MIRACLE	Cejas - Depilacion	32238.00	47000.00	42300.00	7	2	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:55.862+00	2025-07-22 20:03:55.862+00
78de7307-9cbe-44a2-9146-866dd29f7ef2	F00372	OLLA CERA	Cejas - Depilacion	30563.00	45000.00	42750.00	12	6	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:56.194+00	2025-07-22 20:03:56.194+00
cf836407-f51b-4726-a31e-71a4c4d1f5f0	F00373	GUARDIAN PARA AGUJAS 1L	Accesorios - Bioseguridad	5400.00	15000.00	13500.00	0	5	f	t	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:03:56.534+00	2025-07-22 20:03:56.534+00
5f4e8821-c3b3-4392-9bbb-06d08579215c	F00374	GUANTES NEGROS TALLA M	Accesorios - Bioseguridad	20925.00	28000.00	25200.00	3	5	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:03:56.868+00	2025-07-22 20:03:56.868+00
7c1ae45b-612c-4baa-a476-a6f2a4ad5fbd	F00415	ARO LUZ GRANDE	Accesorios - Aros de luz	287800.00	400000.00	360000.00	1	5	t	f	370000.00	90f4707c-be37-4313-bbc7-1362b3d3ece1	{}	{}	\N	t	2025-07-22 20:04:10.054+00	2025-07-22 20:04:10.054+00
ecd2257c-7fe6-4c86-8385-bf6b03360ac1	F00347	BOSTER BANANA / FRESA / MANGO	Pestañas - Boster	16458.00	28000.00	25200.00	21	8	f	t	\N	8971f543-e025-4631-80b7-0215d86df2f3	{}	{}	\N	t	2025-07-22 20:03:47.945+00	2025-08-02 17:24:22.528+00
5982d977-4877-4e50-96a4-5e023654c478	F00375	GUANTES ROSADOS TALLA M	Accesorios - Bioseguridad	24000.00	32000.00	28800.00	4	5	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:03:57.2+00	2025-07-22 20:03:57.2+00
40dc2a15-99a1-4a04-b913-61669bcd0434	F00376	ESTERILIZADOR FUCSIA	Accesorios - Bioseguridad	42000.00	65000.00	58500.00	1	1	f	t	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:03:57.545+00	2025-07-22 20:03:57.545+00
34fcedb6-fbb1-4877-9d60-34cf6ff0720e	F00378	VENTILADOR FIGURAS	Accesorios - Ventiladores	13176.00	26000.00	23400.00	4	6	f	f	\N	c9d06054-4bf0-49eb-ad50-8f186d4d9728	{}	{}	\N	t	2025-07-22 20:03:57.88+00	2025-07-22 20:03:57.88+00
fbeddcd2-275d-47c5-9c87-ffc107c0a10c	F00379	VENTILADOR GRANDE	Accesorios - Ventiladores	26160.00	39000.00	35100.00	1	5	f	f	\N	c9d06054-4bf0-49eb-ad50-8f186d4d9728	{}	{}	\N	t	2025-07-22 20:03:58.213+00	2025-07-22 20:03:58.213+00
44855273-7031-4e04-8302-cf6c8cd4fb3c	F00380	VENTILADOR SIN ASPA GRANDE	Accesorios - Ventiladores	27000.00	40000.00	36000.00	1	4	f	f	\N	c9d06054-4bf0-49eb-ad50-8f186d4d9728	{}	{}	\N	t	2025-07-22 20:03:58.55+00	2025-07-22 20:03:58.55+00
f2d3647f-ce6b-4d3b-ba44-793cc9060d38	F00381	VENTILADOR USB MORADO/ FUCSIA	Accesorios - Ventiladores	20100.00	38000.00	34200.00	6	6	t	f	36000.00	c9d06054-4bf0-49eb-ad50-8f186d4d9728	{}	{}	\N	t	2025-07-22 20:03:58.885+00	2025-07-22 20:03:58.885+00
7365ce47-4003-41a5-b172-cde3e6b2dca2	F00382	HILO ORGANICO	Cejas - Marcacion	11065.00	17000.00	15300.00	22	5	f	f	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:03:59.233+00	2025-07-22 20:03:59.233+00
f046a8a1-c279-47fc-8b1a-5c34018b7385	F00383	HILO PARA DISEÑO Y DEPILACION DE CEJAS 	Cejas - Marcacion	10904.00	15000.00	13500.00	10	4	f	f	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:03:59.564+00	2025-07-22 20:03:59.564+00
c36b60d9-13b3-48a1-bf37-96eb9a672e03	F00384	HILO VANITY	Cejas - Marcacion	9751.00	12000.00	10800.00	12	3	f	f	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:03:59.928+00	2025-07-22 20:03:59.928+00
b88b3150-5e24-4fc5-a9b1-a1d68d439edc	F00385	CERA ROLL ON  VIOEMI ROSE	Cejas - Depilacion	4048.00	11000.00	9900.00	12	5	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:04:00.259+00	2025-07-22 20:04:00.259+00
2cecd7dc-265b-45d1-9965-e57bf8955c7e	F00387	SOPORTE DERMOGRAFO	Micropigmentacion - Accesorios-Micropigmentacion	4971.00	15000.00	13500.00	11	3	f	f	\N	de7923ed-199b-49a7-acbc-7d5c95602030	{}	{}	\N	t	2025-07-22 20:04:00.943+00	2025-07-22 20:04:00.943+00
568b3c3f-73d7-4e57-b483-151081a4270c	F00388	SOPORTE CINTA	Accesorios - Organización-Accesorios	16000.00	23000.00	20700.00	0	5	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:01.289+00	2025-07-22 20:04:01.289+00
10bacf99-9795-4900-8b75-df72706820dd	F00390	TAPABOCAS ROSADOS *50	Accesorios - Bioseguridad	8700.00	20000.00	18000.00	5	5	t	f	18000.00	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:01.974+00	2025-07-22 20:04:01.974+00
6d41576e-e0e2-4204-b263-98d797af38df	F00391	CARTILLA COLORIMETRIA	Accesorios - Organización-Accesorios	6200.00	12500.00	11250.00	5	5	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:02.305+00	2025-07-22 20:04:02.305+00
57a23c60-3a9c-446f-98bb-df5f6142b3e3	F00392	HIGROMETRO	Accesorios - Organización-Accesorios	16193.00	23000.00	20700.00	6	3	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:02.636+00	2025-07-22 20:04:02.636+00
43b87e7c-ba17-436e-8279-0283ba771957	F00393	VERNIER - PIE DE REY	Diseño preciso: nuestras reglas de plástico de doble escala están diseñadas con un rango de escala preciso de 0.000-5.906 in (0-6 pulgadas), lo que puede ayudarte a medir la escala precisa de diferentes artículos sin hacer demasiados esfuerzos, pueden mostrar dos unidades de pulgadas y cm, muy cómodas de usar	3625.00	9000.00	8100.00	5	4	f	f	\N	1e22b2e2-e8e4-4895-8221-5a923c6e7440	{}	{}	\N	t	2025-07-22 20:04:02.992+00	2025-07-22 20:04:02.992+00
667b1fc3-76d2-48a7-9558-18c3ba6c0525	F00394	ARO LUZ	Accesorios - Aros de luz	18000.00	35000.00	31500.00	2	2	f	f	\N	90f4707c-be37-4313-bbc7-1362b3d3ece1	{}	{}	\N	t	2025-07-22 20:04:03.334+00	2025-07-22 20:04:03.334+00
cd6ab547-9e61-4074-b129-3683468bf7ef	F00395	MEZCLADOR ELECTRICO DE HENNA	Accesorios - Henna - Accesorios	9000.00	22000.00	19800.00	7	6	f	f	\N	47218622-5244-478a-812d-01fd30411e28	{}	{}	\N	t	2025-07-22 20:04:03.67+00	2025-07-22 20:04:03.67+00
951db90f-b710-4764-9696-c8d8a6436add	F00397	MANIQUI PRACTICA OJOS REMOVIBLES	Pestañas - Accesorios-Pestañas	48240.00	67000.00	60300.00	19	5	t	f	59000.00	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:04:04.329+00	2025-07-22 20:04:04.329+00
213a7540-a726-406d-9bd8-1ef4cccf4f13	F00398	MANIQUI PARA PRACTICA	Pestañas - Accesorios-Pestañas	14300.00	26000.00	23400.00	14	12	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:04:04.661+00	2025-07-22 20:04:04.661+00
a118470d-dc74-4f99-b6ed-0eefec9d5be7	F00399	MEZCLADOR PARA ADHESIVOS	Pestañas - accesorios-Pestañas	28749.00	39000.00	35100.00	10	3	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:04:04.994+00	2025-07-22 20:04:04.994+00
6e0097a4-5920-455f-a297-fed812441fd4	F00400	PADS LIMPIADORES DE ADHESIVO X 200	Pestañas - Limpieza-Pestañas	4000.00	10000.00	9000.00	18	6	f	f	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{}	\N	t	2025-07-22 20:04:05.328+00	2025-07-22 20:04:05.328+00
0d0fd4ef-4231-4d32-9f5c-b019132b2cb2	F00401	DISPENSADOR AGUA 150ML TRANSPARENTE	Accesorios - Limpieza-Accesorios	2600.00	5000.00	4500.00	19	5	f	f	\N	8bc67f76-98f0-4a23-a517-3d2a5e96cbb2	{}	{}	\N	t	2025-07-22 20:04:05.664+00	2025-07-22 20:04:05.664+00
607af11e-6542-4cb0-a384-1129d37edea7	F00402	DISPENSADOR AGUA NEGRO 250 ML 	Accesorios - Limpieza-Accesorios	3200.00	7000.00	6300.00	21	5	f	f	\N	8bc67f76-98f0-4a23-a517-3d2a5e96cbb2	{}	{}	\N	t	2025-07-22 20:04:05.997+00	2025-07-22 20:04:05.997+00
4962949d-4b25-4f23-b996-5eb76d01451b	F00403	0,25 17CF  AGUJA MICROBLADING SESGADA	Micropigmentacion - Agujas-Micropigmentacion	1500.00	3500.00	3150.00	28	5	f	f	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:04:06.337+00	2025-07-22 20:04:06.337+00
d678d77c-f4b4-4038-861a-be0e55e18113	F00404	DISPENSADOR AGUA 250ML TRANSPARENTE	Accesorios - Limpieza-Accesorios	3200.00	7000.00	6300.00	57	5	f	f	\N	8bc67f76-98f0-4a23-a517-3d2a5e96cbb2	{}	{}	\N	t	2025-07-22 20:04:06.673+00	2025-07-22 20:04:06.673+00
c6e0c8f9-73d5-4792-9102-bb7a89d18eae	F00405	DISPENSADOR AGUA ROSADO 250ML	Accesorios - Limpieza-Accesorios	2905.00	6000.00	5400.00	31	6	f	f	\N	8bc67f76-98f0-4a23-a517-3d2a5e96cbb2	{}	{}	\N	t	2025-07-22 20:04:07.022+00	2025-07-22 20:04:07.022+00
70eb1fe5-93f0-4566-87e1-08bcd10713a4	F00406	DISPENSADOR AGUA TRANSPARENTE 500 ML	Accesorios - Limpieza-Accesorios	3243.00	12000.00	10800.00	11	5	f	f	\N	8bc67f76-98f0-4a23-a517-3d2a5e96cbb2	{}	{}	\N	t	2025-07-22 20:04:07.357+00	2025-07-22 20:04:07.357+00
f690c771-6ccf-4394-a73c-daf2b5c73ec6	F00407	BOMBA AIRE O PERA	Pestañas - accesorios-Pestañas	2800.00	8000.00	7200.00	10	2	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:04:07.689+00	2025-07-22 20:04:07.689+00
6d2b505c-0b53-4bd5-8315-050764723a25	F00410	BANDEJA QUIRÚRGICA	Accesorios - Bioseguridad	13300.00	25000.00	22500.00	7	6	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:08.364+00	2025-07-22 20:04:08.364+00
7a99667d-30af-46b6-93c0-c4a91716ecde	F00411	ESPEJO MANO CUADRADO 	Accesorios - Espejos	9725.00	15000.00	13500.00	1	5	f	f	\N	786480b7-f6e8-4f03-9512-98cf8f6b3232	{}	{}	\N	t	2025-07-22 20:04:08.697+00	2025-07-22 20:04:08.697+00
1c5b9a04-0cda-4707-92a7-b052ffc49230	F00412	ESPEJO DE MANO DISEÑOS	Accesorios - Espejos	10000.00	16000.00	14400.00	3	5	f	f	\N	786480b7-f6e8-4f03-9512-98cf8f6b3232	{}	{}	\N	t	2025-07-22 20:04:09.038+00	2025-07-22 20:04:09.038+00
6fdc8610-ae9d-4f29-8e9b-d9a567b1eb5b	F00413	ESPEJO MANO DOBLE CARA ROSADO	Accesorios - Espejos	10043.00	15000.00	13500.00	1	6	f	f	\N	786480b7-f6e8-4f03-9512-98cf8f6b3232	{}	{}	\N	t	2025-07-22 20:04:09.377+00	2025-07-22 20:04:09.377+00
b8c26691-e048-4bbe-9e40-73057ae78732	F00414	COBERTOR PLASTICO DERMOGRAFO NEGRO	Accesorios - Bioseguridad	15182.00	25000.00	22500.00	4	5	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:09.713+00	2025-07-22 20:04:09.713+00
58047015-1e4d-4bc9-afaf-5b7fbb110487	F00396	GEL ALOE VERA Y COCO	Piel - Hidratacion-Piel	12000.00	18000.00	16200.00	8	5	f	f	\N	6562fd99-f728-4961-9983-f4adc2ec60ca	{}	{}	\N	t	2025-07-22 20:04:04.001+00	2025-08-01 16:44:15.478+00
feb35d47-beec-44e6-b94c-be843333326d	F00389	TAPABOCAS NEGROS *50U	Accesorios - Bioseguridad	8473.00	20000.00	18000.00	7	5	t	f	18000.00	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:01.643+00	2025-08-01 19:27:57.228+00
e6a1af40-6b3e-478d-beda-7f950cce4dda	F00386	MORTERO COPA  CIRCULO	Cejas - Henna	2227.00	6800.00	6120.00	23	5	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:04:00.608+00	2025-08-01 21:14:48.797+00
613960cc-7598-48af-926d-1474f7c82371	F00416	0.15D MIX ELLIPSE NAGARAKU 	Pestañas	18082.00	29000.00	26100.00	9	5	f	f	\N	e86d4c63-095c-4cd0-a95e-db06bae5bc73	{}	{}	\N	t	2025-07-22 20:04:10.395+00	2025-07-22 20:04:10.395+00
90b60cf9-2844-4110-9e33-e7e202994c91	F00418	PASO 2 LIFTING	Pestañas - Lifting	6300.00	16000.00	14400.00	9	2	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:11.068+00	2025-07-22 20:04:11.068+00
9df2dd0d-dac8-4d2c-9c65-9a4aba175826	F00419	PASO 3 LIFTING	Pestañas - Lifting	6200.00	14000.00	12600.00	13	2	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:11.4+00	2025-07-22 20:04:11.4+00
ac59b34e-5bc0-4ae2-af3b-47a2667aa5aa	F00420	PASO 4 LIFTING	Pestañas - Lifting	6200.00	14000.00	12600.00	9	2	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:11.731+00	2025-07-22 20:04:11.731+00
0fb0344b-9d3a-4d0a-bcad-168e841408f7	F00421	PIGMENTO PURE BRUNETTE	Micropigmentacion - Pigmentos	16133.00	22000.00	19800.00	3	5	f	f	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:12.067+00	2025-07-22 20:04:12.067+00
f29002f1-3d3d-4ee6-b67d-f511d36e68d4	F00422	PIGMENTO PURE FLAMINGO	Micropigmentacion - Pigmentos	16162.00	23500.00	21150.00	8	5	f	f	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:12.401+00	2025-07-22 20:04:12.401+00
f4c29fc9-2b73-42a9-befc-4c79d209a800	F00423	PIGMENTO PURE MUD PIE	Micropigmentacion - Pigmentos	16240.00	22000.00	19800.00	2	2	f	f	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:12.733+00	2025-07-22 20:04:12.733+00
181cdadd-4312-4e2d-a7a8-49797fe7441d	F00424	PIGMENTO PURE JET BLACK	Micropigmentacion - Pigmentos	17875.00	22000.00	19800.00	3	2	f	f	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:13.064+00	2025-07-22 20:04:13.064+00
2db55019-ea21-4f5e-b3c6-0b272c2fd236	F00425	PIGMENTO PURE NUDE	Micropigmentacion - Pigmentos	16351.00	22000.00	19800.00	4	5	f	f	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:13.395+00	2025-07-22 20:04:13.395+00
cb8be0b5-debe-4403-b531-056dc685f8f0	F00426	PIGMENTO PURE TOFFE	Micropigmentacion - Pigmentos	16133.00	22000.00	19800.00	6	5	f	f	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:13.725+00	2025-07-22 20:04:13.725+00
f5cfddbe-147d-4bb1-976b-824de49ea6fd	F00427	MAG COLOR NARANJA 5ML	Micropigmentacion - Pigmentos	80000.00	110000.00	99000.00	0	5	f	f	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:14.062+00	2025-07-22 20:04:14.062+00
625e3c56-2abe-41fb-a023-e3cc44b4dc6b	F00428	MAG COLOR 5ML NEGRO	Micropigmentacion - Pigmentos	80000.00	110000.00	110000.00	1	5	f	f	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:14.395+00	2025-07-22 20:04:14.395+00
078babbc-389d-4a68-9654-3c76701fdf6a	F00430	PIGMENTO MAG COLOR BLONDE 5ML	Micropigmentacion - Pigmentos	80000.00	110000.00	110000.00	0	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:14.729+00	2025-07-22 20:04:14.729+00
ba920318-5031-40a3-85f0-82802fdfda60	F00431	PIGMENTO MAG COLOR CASTHANO ESCURO 5ML	Micropigmentacion - Pigmentos	70063.00	110000.00	110000.00	2	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:15.075+00	2025-07-22 20:04:15.075+00
a0d54b9b-22dd-46f6-b17f-dff44f21d5e4	F00432	PIGMENTO MAG COLOR CASTHANO MEDIO 5ML	Micropigmentacion - Pigmentos	70064.00	110000.00	110000.00	2	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:15.406+00	2025-07-22 20:04:15.406+00
f7dc49ae-90fa-40d7-b052-3930414216d7	F00433	PIGMENTO MAG COLOR CORAL 5ML	Micropigmentacion - Pigmentos	75000.00	110000.00	110000.00	1	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:15.744+00	2025-07-22 20:04:15.744+00
4bb28ebe-35c8-4f66-9dc2-7b7d6baefff0	F00434	PIGMENTO MAG COLOR PIMENTA 5ML	Micropigmentacion - Pigmentos	80000.00	110000.00	110000.00	4	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:16.085+00	2025-07-22 20:04:16.085+00
10e3638c-5c6e-40a5-8f8b-805ddd1484e4	F00435	PIGMENTO MAG COLOR PITANGA 5ML	Micropigmentacion - Pigmentos	80000.00	110000.00	110000.00	2	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:16.418+00	2025-07-22 20:04:16.418+00
51acf69a-da2e-43f9-8b0d-12431ffab3e0	F00436	PIGMENTO MAG COLOR VERMELHO 5ML	Micropigmentacion - Pigmentos	71000.00	110000.00	110000.00	5	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:16.803+00	2025-07-22 20:04:16.803+00
2f138b1d-4b70-41e4-aa14-fc8e54631a99	F00437	EBONY PIGMENTO PERMABLEND 15ML 	Micropigmentacion - Pigmentos	135300.00	160000.00	160000.00	3	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:17.159+00	2025-07-22 20:04:17.159+00
cd0afe8f-27e4-4fea-929f-162232e83186	F00438	ESPRESSO PIGMENTO PERMABLEND 15ML	Micropigmentacion - Pigmentos	120300.00	160000.00	160000.00	5	5	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:17.5+00	2025-07-22 20:04:17.5+00
0cc0b2e5-b16d-4115-8a89-9d65a2a75b65	F00439	BOQUILLA PARA ADHESIVO	Pestañas - accesorios-Pestañas	135.00	1000.00	160000.00	162	15	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{}	\N	t	2025-07-22 20:04:17.875+00	2025-07-22 20:04:17.875+00
de32b310-7822-4779-8f6d-db41fdb8b41b	F00441	NEGRO TINTA PARA CEJAS	Cejas - Henna	24500.00	33000.00	29700.00	12	12	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:04:18.547+00	2025-07-22 20:04:18.547+00
f3aefe20-8455-4682-b25c-1fca3740ebbe	F00444	FIJADOR DE CEJAS MELU 	Cejas - Laminado	11500.00	19000.00	17100.00	20	5	f	f	\N	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{}	\N	t	2025-07-22 20:04:19.211+00	2025-07-22 20:04:19.211+00
13989364-4e86-4401-9c9d-a153405eabd1	F00445	BIGUDÍES OSO MORADOS 	Pestañas - Lifting	8000.00	40000.00	36000.00	5	5	t	f	37000.00	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:19.549+00	2025-07-22 20:04:19.549+00
2e802a52-b516-4add-a6e8-ef42552843e9	F00446	GUARDIÁN AGUJAS LUJO 	Accesorios - Bioseguridad	7000.00	10000.00	9000.00	13	5	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:19.883+00	2025-07-22 20:04:19.883+00
ea73e9e5-6fad-4ec8-a14e-fdde15e54f91	F00447	PULUK TOXTOX LASH VITAL	Pestañas - Hidratacion-Pestañas	18182.00	30000.00	27000.00	10	5	f	t	\N	87f3bbdb-980d-4f28-9bc4-b9022639904b	{}	{}	\N	t	2025-07-22 20:04:20.215+00	2025-07-22 20:04:20.215+00
314ab02d-f02c-4ed8-8267-2682a8cb6b9c	F00448	PULUK TOXTOX LASH VOLUMEN	Pestañas - Hidratacion-Pestañas	18200.00	30000.00	27000.00	9	5	f	t	\N	87f3bbdb-980d-4f28-9bc4-b9022639904b	{}	{}	\N	t	2025-07-22 20:04:20.546+00	2025-07-22 20:04:20.546+00
1b7e57ef-85da-4f63-a0bf-c21ec7072d04	F00450	MANTEQUILLA DE COCO 100G 	Piel - Hidratacion-Piel	19500.00	24000.00	21600.00	1	5	f	f	\N	6562fd99-f728-4961-9983-f4adc2ec60ca	{}	{}	\N	t	2025-07-22 20:04:20.894+00	2025-07-22 20:04:20.894+00
2a036ce2-3c19-417f-bf34-0e4455cdb1f9	F00451	Pomada 	Cejas - Marcacion	5800.00	10000.00	9000.00	40	5	f	f	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:04:21.24+00	2025-07-22 20:04:21.24+00
567bb346-ef30-4763-8cb5-991617ff9b77	F00452	BIGUDIES COLORES 	Pestañas - Lifting	7000.00	19000.00	17100.00	7	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:21.588+00	2025-07-22 20:04:21.588+00
93b67d1c-44e5-46ac-a13b-7b64709f2152	F00453	REGLAS PARA DISEÑO	Cejas - Marcacion	500.00	1000.00	900.00	98	5	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:04:21.917+00	2025-07-22 20:04:21.917+00
9644e33f-c6cd-40c3-af43-e2ef0e68ff3d	F00454	BAJALENGUASX100 UNDS	Cejas - Depilacion	10200.00	20000.00	18000.00	2	5	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:04:22.255+00	2025-07-22 20:04:22.255+00
996ee68f-742f-43ce-ba3d-7cf6ce5c381a	F00455	0.07L MIX NAGARAKU	PESTAÑAS NAGARAKU MIX CURVATURA L 	13181.00	23000.00	20700.00	3	5	f	f	\N	e86d4c63-095c-4cd0-a95e-db06bae5bc73	{}	{}	\N	t	2025-07-22 20:04:22.594+00	2025-07-22 20:04:22.594+00
d67ac0ba-0fdd-44be-9bbd-4b2052d4a30d	F00457	KIT DE PINZAS TORNASOL	Pestañas - Pinza	30000.00	45000.00	40500.00	4	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:22.979+00	2025-07-22 20:04:22.979+00
2b2ee894-c7a1-482b-bccc-de765c9ede4f	F00458	KIT PINZA CURVA Y RECTA 	Pestañas - Pinza	5600.00	18000.00	16200.00	11	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:23.311+00	2025-07-22 20:04:23.311+00
dfbe5b1d-9a34-4502-80ba-823e1db8f44d	F00459	CORRECTORES BROW PASTE	Cejas - Marcacion	19300.00	35000.00	31500.00	7	5	f	f	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:04:23.653+00	2025-07-22 20:04:23.653+00
d15f51ba-7e47-42ba-a3f9-3971ffb760a9	F00417	PASO 1 LIFTING	Pestañas - Lifting	7624.00	19000.00	17100.00	7	2	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:10.732+00	2025-08-02 15:21:34.783+00
69a33017-e870-46ba-a25d-7b5a107344f9	F00460	GORROS DESECHABLES 	Accesorios - Bioseguridad	150.00	500.00	450.00	876	300	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:23.999+00	2025-07-22 20:04:23.999+00
e774e68e-87ea-4909-a56f-539d28f67c16	F00461	CERA FRIA VIOEMI KIT DE DEPILACIÓN 	Cejas - Depilacion	14300.00	22000.00	19800.00	2	2	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:04:24.341+00	2025-07-22 20:04:24.341+00
30d843b5-87f6-45f6-9a81-a277225613b2	F00462	KIT LAMINADO ICOSING 	Cejas - Laminado	35300.00	55000.00	49500.00	7	3	f	f	\N	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{}	\N	t	2025-07-22 20:04:24.677+00	2025-07-22 20:04:24.677+00
7b541f28-ab2f-46b2-b1a3-4c34320098a7	F00463	ESPEJO DE MANO PESTAÑAS 	Accesorios - Espejos	9500.00	17000.00	15300.00	0	5	f	f	\N	786480b7-f6e8-4f03-9512-98cf8f6b3232	{}	{}	\N	t	2025-07-22 20:04:25.013+00	2025-07-22 20:04:25.013+00
a3856a7e-68e3-4b96-9da4-d7a80c86f288	F00464	PINZA CURVA ST-15	Pestañas - Pinza	10000.00	25000.00	22500.00	1	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:25.361+00	2025-07-22 20:04:25.361+00
049bf008-0b83-4470-b2f9-d0d1ae49fac6	F00465	PINZA RECTA DORADO ROSA 	Pestañas - Pinza	14100.00	24000.00	21600.00	6	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:25.699+00	2025-07-22 20:04:25.699+00
2fb2f432-4d09-405a-be70-a36850381575	F00466	PINZA LAGRIMAL DORADO ROSA 	Pestañas - Pinza	14100.00	24000.00	21600.00	3	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:26.035+00	2025-07-22 20:04:26.035+00
ea2c2f96-89aa-410a-9367-264cd4d39367	F00467	PINZA VOLUMEN  DORADO ROSA 	Pestañas - Pinza	15000.00	24000.00	21600.00	3	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:26.37+00	2025-07-22 20:04:26.37+00
1ab757fc-afe0-43a2-8e0a-d797b2c2999d	F00468	PINZA CURVA  DORADO ROSA 	Pestañas - Pinza	14100.00	24000.00	21600.00	2	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:26.701+00	2025-07-22 20:04:26.701+00
61373348-d157-4541-a8eb-103054fa376c	F00469	BANDEJA QUIRURGICA LABIOS 	Accesorios - Bioseguridad	20500.00	38000.00	34200.00	5	3	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:27.032+00	2025-07-22 20:04:27.032+00
75153d87-99aa-4ddc-8b2b-766dc3985ab0	F00470	MASCARA TRASPARENTE FACIAL 	Accesorios - Bioseguridad	20000.00	25000.00	22500.00	1	1	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:27.372+00	2025-07-22 20:04:27.372+00
46df3e69-3a22-4887-847c-ddbe301842f1	F00472	REMOVEDOR LIQUIDO VERDE 	Pestañas - Removedores	14300.00	20000.00	18000.00	5	2	f	f	\N	bd019c40-c16e-4c76-a6a7-c5f3c8262967	{}	{}	\N	t	2025-07-22 20:04:28.049+00	2025-07-22 20:04:28.049+00
1eada2ac-1b8a-4c34-888c-124f0c4e5c65	F00473	DELANTAL LIPS 	Accesorios - Bioseguridad	17300.00	30000.00	27000.00	1	5	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:28.386+00	2025-07-22 20:04:28.386+00
512fdfc0-7cb2-4a6f-9b15-65b1a38752f9	F00474	DELANTAL LASH 	Accesorios - Bioseguridad	13800.00	30000.00	27000.00	0	5	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:28.719+00	2025-07-22 20:04:28.719+00
80a7032f-ed1e-4995-bb74-094c4b342482	F00475	FORRO ALMOHADA PLASTICO TRASPARENTE 	Accesorios - Bioseguridad	25300.00	35000.00	31500.00	4	2	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:29.052+00	2025-07-22 20:04:29.052+00
b305bbe8-56b6-4308-a6cd-6c0f22dbb7a0	F00476	TIJERA ALTA PRECISION 	Accesorios - Tijeras	20300.00	26000.00	23400.00	4	2	f	f	\N	67f612e6-8f2c-47a3-ab40-a1c4d145a7dd	{}	{}	\N	t	2025-07-22 20:04:29.403+00	2025-07-22 20:04:29.403+00
d1539cec-c927-4ec7-a186-022520661190	F00477	PINCEL DOBLE PARA LABIOS 	Micropigmentacion - Labios-Micropigmentacion	12300.00	18000.00	16200.00	2	2	f	f	\N	82785278-b03d-4108-a3c5-d752e9a1a52a	{}	{}	\N	t	2025-07-22 20:04:29.735+00	2025-07-22 20:04:29.735+00
f10f4ee6-3983-48ab-ac1d-9c3c85604a64	F00478	HENNA PARA LABIOS (TONO ROJO)	Labios - Henna -Labios	6800.00	12000.00	10800.00	10	6	f	f	\N	88ebcb64-faa3-4ded-9caf-f2a003fb8e43	{}	{}	\N	t	2025-07-22 20:04:30.073+00	2025-07-22 20:04:30.073+00
1962e2ca-7791-4c5a-bf3d-989abb14a208	F00479	ACRILICO TRASPARENTE CON TAPA 	Accesorios - Organización-Accesorios	13000.00	26000.00	23400.00	1	2	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:30.409+00	2025-07-22 20:04:30.409+00
da5a769b-2c8a-4710-9053-55ddd9100c26	F00480	BANDA SILICONA DE PESTAÑAS 	Accesorios - Organización-Accesorios	3300.00	9000.00	8100.00	5	2	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:30.741+00	2025-07-22 20:04:30.741+00
76a35e9d-f25a-43b8-ba7a-16cf9b5deb12	F00481	OPTIVISOR NEGRO CON LUZ LED 	Accesorios - Optivisores	25000.00	39000.00	35100.00	4	2	f	t	\N	fa7e3c65-5e90-4b1e-9b2b-12a94a76385c	{}	{}	\N	t	2025-07-22 20:04:31.076+00	2025-07-22 20:04:31.076+00
9db232a5-0035-4cc2-9526-1532296f862e	F00482	SET MASCARILLA X5 PIEZAS 	Accesorios - Organización-Accesorios	9300.00	16000.00	14400.00	2	2	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:31.409+00	2025-07-22 20:04:31.409+00
91bf7d35-d2e3-435e-94b7-3922750788f8	F00483	PINCEL GOMA PUNTA DIAGONAL 	Cejas - Pinceles	3700.00	7000.00	6300.00	10	3	f	f	\N	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{}	\N	t	2025-07-22 20:04:31.754+00	2025-07-22 20:04:31.754+00
e2871354-52bd-4045-9635-5e548945144f	F00484	ORGANIZADOR DE PINZAS DE LUJO 	Pestañas - Pinza	21300.00	37000.00	33300.00	5	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:32.09+00	2025-07-22 20:04:32.09+00
71026c6b-dfd8-4b62-969a-476d3d9e63f9	F00485	GLUTARALDEIDO 250ML	Accesorios - Limpieza-Accesorios	4300.00	8000.00	7200.00	2	2	f	f	\N	8bc67f76-98f0-4a23-a517-3d2a5e96cbb2	{}	{}	\N	t	2025-07-22 20:04:32.431+00	2025-07-22 20:04:32.431+00
59fbdeed-17c8-4592-b78b-51bc8d43ed14	F00486	PRIMER DE FRESAS	Pestañas - Primer	9300.00	14000.00	12600.00	4	5	f	f	\N	eba6e6f9-16a5-4ce1-8e32-ae660ab880e1	{}	{}	\N	t	2025-07-22 20:04:32.766+00	2025-07-22 20:04:32.766+00
aea009fa-c439-4b33-a288-bea9723fdcf5	F00487	0.07D W 5D 14MM NAGARAKU	Pestañas - Pestaña	28300.00	41500.00	37350.00	12	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:33.104+00	2025-07-22 20:04:33.104+00
f6e4a0c9-67b5-4318-a5b5-002cf98d60fb	F00488	DEZHMA 3D CLOVER 9MM 	Pestañas - Pestaña	30000.00	40000.00	36000.00	5	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:33.435+00	2025-07-22 20:04:33.435+00
ab0f4e06-0ab4-4525-bf7f-744b750a9f50	F00489	DEZHMA 3D CLOVER 10MM 	Pestañas - Pestaña	30000.00	40000.00	36000.00	5	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:33.766+00	2025-07-22 20:04:33.766+00
6ae40dea-6f8e-4337-ac03-86cca3833cb5	F00490	DEZHMA 3D CLOVER 11MM 	Pestañas - Pestaña	30000.00	40000.00	36000.00	5	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:34.105+00	2025-07-22 20:04:34.105+00
68166609-6759-45a1-9cbb-8cdcd85b9f19	F00491	DEZHMA 3D CLOVER 12MM 	Pestañas - Pestaña	30000.00	40000.00	36000.00	3	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:34.445+00	2025-07-22 20:04:34.445+00
96410de9-f0ff-45f0-aeee-dfe866dc8363	F00492	DEZHMA 3D CLOVER 13MM 	Pestañas - Pestaña	30000.00	40000.00	36000.00	11	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:34.789+00	2025-07-22 20:04:34.789+00
b192a0c4-e279-41e7-9229-ba2a31d7b6c4	F00493	DEZHMA 4D CLOVER 9MM 	Pestañas - Pestaña	35000.00	45000.00	40500.00	5	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:35.123+00	2025-07-22 20:04:35.123+00
7ff4b262-79f7-4668-be43-c3087c1f5b2a	F00494	DEZHMA 4D CLOVER 10MM 	Pestañas - Pestaña	35000.00	45000.00	40500.00	3	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:35.465+00	2025-07-22 20:04:35.465+00
3ca1f268-cdad-4d87-95e2-af11fe54fde4	F00495	DEZHMA 4D CLOVER 11MM 	Pestañas - Pestaña	35000.00	45000.00	40500.00	4	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:35.8+00	2025-07-22 20:04:35.8+00
e82f7f21-556b-42da-be75-8e1780d6e5c4	F00496	DEZHMA 4D CLOVER 12MM 	Pestañas - Pestaña	35000.00	45000.00	40500.00	3	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:36.141+00	2025-07-22 20:04:36.141+00
9793d700-1011-4e35-88c5-a41dadf787a6	F00497	DEZHMA 4D CLOVER 13MM 	Pestañas - Pestaña	35000.00	45000.00	40500.00	7	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:36.476+00	2025-07-22 20:04:36.476+00
eac9425f-0976-4704-97f2-8207616e441e	F00498	DEZHMA 5D CLOVER 9MM 	Pestañas - Pestaña	38000.00	48000.00	43200.00	6	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:36.814+00	2025-07-22 20:04:36.814+00
bd8d1f9e-8907-4736-8f48-1981d4bdf8e1	F00499	DEZHMA 5D CLOVER 10MM 	Pestañas - Pestaña	38000.00	48000.00	43200.00	4	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:37.152+00	2025-07-22 20:04:37.152+00
c8640d95-1c89-4bc1-b892-fb2c007b19d3	F00500	DEZHMA 5D CLOVER 11MM 	Pestañas - Pestaña	38000.00	48000.00	43200.00	2	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:37.503+00	2025-07-22 20:04:37.503+00
0ae79883-3f19-45cf-8dcc-ea2c8c9ab03e	F00501	DEZHMA 5D CLOVER 12MM 	Pestañas - Pestaña	38000.00	48000.00	43200.00	4	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:37.836+00	2025-07-22 20:04:37.836+00
d703946a-0276-4d7c-945e-31598e735809	F00502	DEZHMA 5D CLOVER 13MM 	Pestañas - Pestaña	38000.00	48000.00	43200.00	4	3	f	t	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:38.167+00	2025-07-22 20:04:38.167+00
7e9d2ff8-d14d-4821-9a97-a38d1040691b	F00503	AGUJA MAST OCEAN 0.30	Micropigmentacion - Agujas-Micropigmentacion	3400.00	7000.00	6300.00	120	50	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:04:38.507+00	2025-07-22 20:04:38.507+00
d220017b-a013-4ed3-90dd-8a5dc9567829	F00504	AGUJA MAST OCEAN 0.35	Micropigmentacion - Agujas-Micropigmentacion	3400.00	7000.00	6300.00	120	50	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:04:38.847+00	2025-07-22 20:04:38.847+00
a36b7d61-be5e-4810-8c5b-19cf366ef4a8	F00505	AGUJA MAST OCEAN 0.40	Micropigmentacion - Agujas-Micropigmentacion	3400.00	7000.00	6300.00	45	50	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:04:39.182+00	2025-07-22 20:04:39.182+00
220ce66e-66b8-4fd0-a9aa-c4a464ae6911	F00506	BIGUDIES 7 PARES AZUL 	Especificaciones:\nNombre: Almohadilla permanente para pestañas\nMaterial: silicona\nEstándar: 7 pares/caja\nUso: una herramienta auxiliar para planchar pestañas, adecuada para pestañas de diferentes longitudes y diferentes grados de rizado.\n\nLista de embalaje:\n4 pares para pestañas superiores\n3 pares para pestañas inferiores	9400.00	22000.00	19800.00	3	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:39.522+00	2025-07-22 20:04:39.522+00
49028940-422b-4043-aa7d-af04b9339288	F00507	BIGUDIES AZUL CORONA 	Pestañas - Lifting	12000.00	37000.00	33300.00	2	5	t	f	37000.00	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:39.853+00	2025-07-22 20:04:39.853+00
9ae7a459-2e2f-454f-be7e-bc7fff34413b	F00508	ESPEJOS DE CORAZON PESTAÑAS	Accesorios - Espejos	26259.00	37000.00	33300.00	1	5	t	f	35000.00	786480b7-f6e8-4f03-9512-98cf8f6b3232	{}	{}	\N	t	2025-07-22 20:04:40.191+00	2025-07-22 20:04:40.191+00
e4e16331-b8f6-4ad2-b899-429970ac8a7c	F00509	PINZA LAGRIMAL DECEMARS MPJ-01-US 	Pestañas - Pinza	19909.00	30000.00	27000.00	4	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:40.525+00	2025-07-22 20:04:40.525+00
fe5041e8-72de-4d83-9103-b23766335207	F00510	AGUJA THUNDER 1P R 0.35	Micropigmentacion - Agujas-Micropigmentacion	3060.00	6000.00	5400.00	80	100	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:04:40.871+00	2025-07-22 20:04:40.871+00
68abe1f5-74d5-44a6-bb4d-09753c59246f	F00511	AGUJA THUNDER 3RL 0.25	Micropigmentacion - Agujas-Micropigmentacion	3060.00	6000.00	5400.00	108	100	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:04:41.206+00	2025-07-22 20:04:41.206+00
14458a12-476b-44f2-b706-dc2f1ba9e4eb	F00512	PINZA ESCAMAS TIPO RECTA TORNAZOL	Pestañas - Pinza	6422.00	18000.00	16200.00	4	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:41.545+00	2025-07-22 20:04:41.545+00
6ec0d999-709e-41e7-9057-fc36d6fb4782	F00513	PINZA ESCAMAS TIPO VOLUMEN RUSO TORNAZOL	Pestañas - Pinza	6422.00	18000.00	16200.00	1	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{}	\N	t	2025-07-22 20:04:41.879+00	2025-07-22 20:04:41.879+00
53a0ef59-26a9-444f-9474-d955f8a4a28b	F00514	BIGUIDIES REVERSIBLES DE LIFTING	Pestañas - Lifting	9000.00	28000.00	25200.00	5	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:42.219+00	2025-07-22 20:04:42.219+00
543aaf05-9c6c-4122-b331-0b943ce7dc48	F00515	BIGUIDIES PESCADO ROSADO	Pestañas - Lifting	18000.00	40000.00	36000.00	7	5	t	f	37000.00	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:42.556+00	2025-07-22 20:04:42.556+00
fbf2f7b8-fc46-40e6-93b1-f4b6507ebf7f	F00516	ALMOHADILLA PARA LAMINADO ROSADA	Cejas - Laminado	5000.00	15000.00	13500.00	4	5	f	f	\N	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{}	\N	t	2025-07-22 20:04:42.892+00	2025-07-22 20:04:42.892+00
cdcb9ccd-0e10-4c4a-9ffe-ab1adb7e69a3	F00517	ESPEJOS PEQUEÑOS ROSADO/BLANCO/NEGRO	Accesorios - Espejos	4666.66	10000.00	9000.00	14	5	f	f	\N	786480b7-f6e8-4f03-9512-98cf8f6b3232	{}	{}	\N	t	2025-07-22 20:04:43.223+00	2025-07-22 20:04:43.223+00
b7477e08-d132-4c57-951b-c584d22112e0	F00518	ANILLOS PARA ARMAR ABANICOS FLOR X 100	Pestañas - Anillo-Pestañass	11000.00	10000.00	9000.00	8	15	f	f	\N	950034c3-2568-4f29-9cf1-0ed14e656104	{}	{}	\N	t	2025-07-22 20:04:43.558+00	2025-07-22 20:04:43.558+00
1282c093-8f44-42fd-99fd-cf30070afca8	F00519	KIT LAMINADO IBCCCNDC	Cejas - Laminado	37000.00	55000.00	49500.00	7	5	f	f	\N	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{}	\N	t	2025-07-22 20:04:43.89+00	2025-07-22 20:04:43.89+00
d41e51be-4943-4164-b59b-d919f11d0c3b	F00520	HIDRAGLOW LIPS 30ML	HidraLips - Acido Hialuronico	148000.00	185000.00	185000.00	1	2	f	f	\N	2c23ddde-902b-41b0-b231-c9602ae9bc5f	{}	{}	\N	t	2025-07-22 20:04:44.23+00	2025-07-22 20:04:44.23+00
59a2b9c5-615f-48f5-943c-cdc9bd79350b	F00521	JABÓN ANTIBACTERIAL YODI 500ML	Pestañas - Limpieza-Pestañas	25500.00	35000.00	31500.00	5	5	f	f	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{}	\N	t	2025-07-22 20:04:44.568+00	2025-07-22 20:04:44.568+00
f97aef56-bcdb-4b7b-a42b-fc3feebc9502	F00522	ESPUMA LIMPIADORA 85ML YODI	Pestañas - Limpieza-Pestañas	14500.00	20000.00	18000.00	5	5	f	t	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{}	\N	t	2025-07-22 20:04:44.905+00	2025-07-22 20:04:44.905+00
f07aa144-5359-40c6-b5c0-745cc36b5e81	F00523	ESPUMA LIMPIADORA 200ML YODI	Pestañas - Limpieza-Pestañas	25500.00	37000.00	33300.00	6	5	f	t	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{}	\N	t	2025-07-22 20:04:45.254+00	2025-07-22 20:04:45.254+00
df2365e0-9c2a-4835-ba94-67a83a5e5e45	F00524	MASSCAKU U MIX YY 0.07D	Pestañas	11000.00	27000.00	24300.00	4	5	f	f	\N	e86d4c63-095c-4cd0-a95e-db06bae5bc73	{}	{}	\N	t	2025-07-22 20:04:45.592+00	2025-07-22 20:04:45.592+00
24197505-022c-4323-8452-750d1ffc04ab	F00525	DERMAPEN MYM	Piel - Maquinas	92000.00	135000.00	135000.00	1	5	f	t	\N	3fca2124-fdc6-4630-a69e-104137aba89c	{}	{}	\N	t	2025-07-22 20:04:45.935+00	2025-07-22 20:04:45.935+00
5bc8b439-73b7-4fef-98f7-fb6b74051d55	F00526	ANILLOS CON DIVISIÓN Y SIN DIVISION X50	Pestañas - Anillo-Pestañass	2000.00	4000.00	3600.00	4	5	f	f	\N	950034c3-2568-4f29-9cf1-0ed14e656104	{}	{}	\N	t	2025-07-22 20:04:46.273+00	2025-07-22 20:04:46.273+00
f1c539df-59a1-4689-a069-185e49079f22	F00527	GUANTES ROSADOS TALLA S	Accesorios - Bioseguridad	23700.00	32000.00	28800.00	6	5	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:46.604+00	2025-07-22 20:04:46.604+00
70c1794a-482e-4377-949e-81f0f42ed74f	F00528	GUANTES NEGROS TALLA S 	Accesorios - Bioseguridad	20925.00	28000.00	25200.00	6	5	f	f	\N	1dababba-299d-43ab-9d36-1bb00ee07229	{}	{}	\N	t	2025-07-22 20:04:46.943+00	2025-07-22 20:04:46.943+00
f43c4e6d-f053-4129-8cae-a034bdcef636	F00529	PIGMENTO PERMABLEND DARK FOREST BROWN	Micropigmentacion - Pigmentos	135300.00	160000.00	160000.00	4	3	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:47.278+00	2025-07-22 20:04:47.278+00
318a30ee-fc13-413c-a026-a241f51a09ba	F00530	MAG COLOR OCRE (AMARILLO)	Micropigmentacion - Pigmentos	80000.00	110000.00	110000.00	1	1	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:47.612+00	2025-07-22 20:04:47.612+00
ce60be9c-973a-44fb-a58d-cf9a9d0b0779	F00531	CERA 125 MLG KIWI	Cejas - Depilacion	4833.00	9000.00	8100.00	6	3	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:04:47.943+00	2025-07-22 20:04:47.943+00
3e52efb3-323f-43a5-88ab-0093e8b819f7	F00532	CERA 125 MLG CHOCOLATE	Cejas - Depilacion	4833.00	9000.00	8100.00	6	3	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:04:48.278+00	2025-07-22 20:04:48.278+00
8cd345e2-66d2-4c97-a95b-09466d791244	F00533	CERA 125 MLG ALOE	Cejas - Depilacion	4833.00	9000.00	8100.00	4	3	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:04:48.616+00	2025-07-22 20:04:48.616+00
cafdb70f-8592-468d-93d0-2c13150535e0	F00535	BIGUDIES PLANOS CORENOS	Pestañas - Lifting	5900.00	27000.00	24300.00	1	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:49.282+00	2025-07-22 20:04:49.282+00
5283d379-1e2e-478c-af37-465084b86849	F00536	DIADEMA CON VELCRO	Accesorios - Organización-Accesorios	5000.00	10000.00	9000.00	2	5	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:49.612+00	2025-07-22 20:04:49.612+00
478c261f-4f96-442a-86f5-386b98f6de9e	F00537	PASO 1 SACHET 6ML 	Pestañas - Lifting	6000.00	4100.00	3690.00	11	2	f	t	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:49.944+00	2025-07-22 20:04:49.944+00
5e99d780-ecde-4e5b-bc51-22ed07c42d63	F00538	PASO 2 SACHET 6ML 	Pestañas - Lifting	6000.00	4100.00	3690.00	11	2	f	t	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:50.283+00	2025-07-22 20:04:50.283+00
48560a2a-25db-4be9-a01f-e1a5a0423994	F00539	PASO 3 SACHET 6ML 	Pestañas - Lifting	6000.00	4100.00	3690.00	12	2	f	t	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:50.623+00	2025-07-22 20:04:50.623+00
6bae89f1-ade6-4a3f-9045-5b3a716f2d19	F00543	ORGANIZADOR PEQUEÑO CON TAPA MADERA	Accesorios - Organización-Accesorios	8000.00	15000.00	15000.00	2	5	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:51.656+00	2025-07-22 20:04:51.656+00
7f14ad2d-1250-424d-9a57-b83e5788ab4b	F00545	NAGARAKU PREMIUM MATTE ELLIPSE MIX 0.15D	Pestañas	12000.00	21000.00	18900.00	3	3	f	f	\N	e86d4c63-095c-4cd0-a95e-db06bae5bc73	{}	{}	\N	t	2025-07-22 20:04:51.994+00	2025-07-22 20:04:51.994+00
0d634f68-d27d-4e75-b84b-2bd6f7bd83d3	F00548	0.07D 4D W MIX 11-15MM	Pestañas	25000.00	35000.00	35000.00	6	5	f	f	\N	e86d4c63-095c-4cd0-a95e-db06bae5bc73	{}	{}	\N	t	2025-07-22 20:04:52.327+00	2025-07-22 20:04:52.327+00
832defd7-5e7b-4ad4-b82b-6f46219e1588	F00549	0.07D 6D W MIX 11-15MM	Pestañas	40000.00	50000.00	50000.00	5	5	f	f	\N	e86d4c63-095c-4cd0-a95e-db06bae5bc73	{}	{}	\N	t	2025-07-22 20:04:52.668+00	2025-07-22 20:04:52.668+00
bd1a8ee1-1e89-46c0-bd9d-66fe3b4cadd5	F00550	MOLDES LIFTING 	Pestañas - Lifting	6700.00	37000.00	33300.00	2	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{}	\N	t	2025-07-22 20:04:53.01+00	2025-07-22 20:04:53.01+00
b39fb5a9-a79f-44db-b368-a901c993a985	F00555	HILO PARA DISEÑO ROSADO	Cejas - Marcacion	5712.00	14000.00	12600.00	27	15	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:04:53.35+00	2025-07-22 20:04:53.35+00
bfcd2723-8464-453b-848c-c054328efd41	F00556	HILO PARA DISEÑO NEGRO	Cejas - Marcacion	5712.00	14000.00	12600.00	9	15	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:04:53.683+00	2025-07-22 20:04:53.683+00
3b78760f-b3a0-4c79-adb8-0e68917ed47c	AUTO-1753214694196-534	PALETA PARA FOTOS PERSONALIZADA	Accesorios - Organización-Accesorios	45000.00	70000.00	63000.00	0	5	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-07-22 20:04:54.196+00	2025-07-22 20:04:54.196+00
15d5654a-ab04-445d-8320-33ee1c0b3ada	F00546	AGUJA PERLA NEGRA 3RL 0.25 - 0.30	Micropigmentacion - Agujas-Micropigmentacion	2997.00	5000.00	4500.00	7	30	f	t	\N	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{}	\N	t	2025-07-22 20:04:54.529+00	2025-07-22 20:04:54.529+00
eebe66fb-bc12-42aa-868b-63b28a697636	F00544	MAG COLOR AMARELO 	Micropigmentacion - Pigmentos	80000.00	110000.00	110000.00	3	1	f	t	\N	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	{}	{}	\N	t	2025-07-22 20:04:54.867+00	2025-07-22 20:04:54.867+00
ce606535-8cb1-431e-a633-3d132776cb7b	F00547	LÁPIZ DE CERA NEGRO	Cejas - Marcacion	2800.00	8000.00	7200.00	12	6	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:04:55.544+00	2025-07-22 20:04:55.544+00
7f5f2a0b-e508-4d91-a0d9-ae28d8fbb969	F00581	PEGA SALON PRO 30 SEGUNDOS	Salon Pro exclusivo de pegamento antihongos de 30 segundos, antihongos. Pegamento Super Hair Bond. Velocidad profesional. Para estilista profesional. Para una unión perfecta a una velocidad increíble.	9500.00	15500.00	14000.00	20	5	f	f	\N	6109c404-c644-42ae-966d-4c3fd0264331	{pegante,"pestañas punto a punto","pestañas cluster"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753303000/fucsia-products/b80sdq9fdy1ygu00yreb.webp}	{}	t	2025-07-23 20:36:41.676+00	2025-07-23 20:36:41.676+00
8e3d7e26-be72-4775-9b3a-fb8b79bda613	F00580	ADHESIVO COREANO PARA PESTAÑAS	Este adhesivo está diseñado como el primer paso esencial en el proceso de lifting o ondulado permanente de pestañas. Su fórmula permite una adhesión suave y efectiva, asegurando que los rizadores o rulos de pestañas se mantengan firmemente sujetos en los párpados durante el tratamiento.\r\n\r\nCaracterísticas destacadas:\r\n\r\nAdhesión suave que no daña la piel ni las pestañas.\r\nFórmula no irritante, adecuada incluso para pieles sensibles.\r\nIdeal para garantizar la fijación precisa de los rulos o rizadores en los párpados.\r\n¡Logra un resultado profesional con facilidad y seguridad!\r\n\r\nTambien permite hacer la aplicaicon de pestañas de tira. \r\n\r\n La imagen es de referencia; el color y tonalidad pueden variar según la iluminación y la pantalla del dispositivo.	9500.00	15500.00	14000.00	20	5	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{"adhesivo lifting",lifting,"lifting coreano","pestañas de tira"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753303673/fucsia-products/fxlpsg4vih8u1qktcyta.jpg}	{}	t	2025-07-23 20:47:54.251+00	2025-07-23 20:47:54.251+00
d5f7f337-3f7f-4dee-a164-52a7bc782072	F00001	AGUJA THUNDER 1P 0.30	Aguja rotativa thunderlord 1RL 0.30 para micropigmentación de cejas y labios. La aguja del cartucho está hecha de acero inoxidable 316 médico y 100% esterilizado y empaquetado en un blíster.  Embalaje desechable, cada cartucho está empaquetado en un recipiente estéril.	4331.00	7000.00	6300.00	154	40	t	t	6000.00	e9f1935a-78f9-4973-9715-6422f94cc3bf	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753373617/fucsia-products/yfetorvhl6hwfp12uxon.png}	{}	t	2025-07-22 20:01:56.364+00	2025-07-24 16:13:38.23+00
faecb352-2e16-4036-bc5c-1a3f28ef23a7	F00554	ANILLOS SENCILLO PARA TINTA/ADHESIVOS/PIGMENTOS	Anillos para adhesivo de extensión de pestañas\r\n\r\nSe utilizan para poner pegamento, removedor o pigmento de pestañas.\r\n\r\nIdeal para usar durante la extensión de pestañas y la aplicación de tatuaje.\r\n\r\nEstos anillos de pegamento desechables hacen que el proceso de aplicación de pestañas sea más fácil y rápido debido a la posición de los materiales en tu propia mano.\r\n\r\nAnillo de tamaño: 13mm (diámetro)\r\nSostenedor de taza tamaño:11mm (diámetro)\r\nColor: Blanco\r\nModelo:Desechables\r\nMaterial:  Plásticos\r\nCantidad: 100 uds	3237.00	7000.00	6300.00	50	15	f	t	\N	6df4b718-38b4-4c79-9142-04b043b41d3b	{"anillos de plastico",anillo}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753377869/fucsia-products/sj57opu1c1xhs7yhxsls.jpg}	{}	t	2025-07-24 17:24:29.466+00	2025-07-24 17:24:29.466+00
59711e76-af26-455c-bc98-d5e2df990cc2	F00048	PINZA RECTA FRESAS	Pestañas - Pinza	9533.00	17000.00	15300.00	3	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390953/fucsia-products/zusczyygxrvgjt2h5oqo.png}	{}	t	2025-07-22 20:02:11.641+00	2025-07-24 21:02:33.511+00
ca8fc5a4-7bf1-4a27-bf85-bc8bb174b6bb	F00055	PINZA ESCAMAS CURVA ROSA AZUL 	Pestañas - Pinza	11125.00	25000.00	22500.00	3	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753392644/fucsia-products/notsylvs2s2s3jxjddnk.jpg}	{}	t	2025-07-22 20:02:13.955+00	2025-07-24 21:30:45.216+00
188896ac-eb00-40e2-a885-1e97a0f5fd2c	F00100	CEPILLO CON ESTUCHE VARIADO	Pestañas - Accesorios-Pestañas	1043.00	2000.00	1800.00	176	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753392699/fucsia-products/zidwcrgbzc98jm5wzf2w.jpg}	{}	t	2025-07-22 20:02:28.666+00	2025-07-24 21:31:39.924+00
19b6e7b9-aaf0-436c-8f82-ce47624604e4	F00101	TIJERAS	Cejas - depilacion	4381.00	6500.00	5850.00	6	6	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753392794/fucsia-products/tbpptlvbrs5uroqsxyro.png}	{}	t	2025-07-22 20:02:28.986+00	2025-07-24 21:33:15.358+00
f31a4de4-3507-4fa1-acb1-49337e3252d4	F00540	ORGANIZADOR ISOPOS CON TAPA BAMBU	El complemento prefecto para orgaizar tu carrito. 	12000.00	18000.00	30600.00	1	1	f	f	\N	e86d4c63-095c-4cd0-a95e-db06bae5bc73	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1754066280/fucsia-products/pde0vxrmo1l8s9yuokyl.jpg}	{}	t	2025-07-22 20:04:50.96+00	2025-08-01 16:44:15.623+00
7bb7ecd4-b1d2-4146-95b3-44adcd5a9cb3	F00542	ACRILICO ORGANIZADOR CON 3 DIVISIONES 	Organización - Organización-Varios	16000.00	28000.00	28000.00	6	5	f	f	\N	0c7bd844-3663-4f3b-b51d-401d9d8606f7	{}	{}	\N	t	2025-07-22 20:04:54.026+00	2025-08-01 16:46:23.956+00
c6240537-11c5-40c6-a691-bfe9c2bab869	F00553	ANILLOS SENCILLO PARA TINTA/ADHESIVOS/PIGMENTOS	Anillos para adhesivo y pigmentos\r\n¡Comodidad, precisión y limpieza en cada aplicación!\r\n\r\nNuestros anillos desechables están diseñados para facilitar tu trabajo, ya sea aplicando adhesivo de pestañas o pigmentos para micropigmentación.\r\nCon cavidad profunda y forma ergonómica, permiten un manejo seguro del producto, optimizando cada gota y manteniendo tu espacio de trabajo ordenado.\r\n\r\nIdeales para lashistas, artistas de cejas y especialistas en belleza que buscan agilidad y resultados impecables.\r\n💖 Una herramienta pequeña que hace una gran diferencia.	3500.00	7000.00	6299.98	50	15	f	f	\N	6df4b718-38b4-4c79-9142-04b043b41d3b	{anillos,"anillo para adhesivo","anillo para pigmento"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753379592/fucsia-products/qvfllnrodvoqcbarowez.jpg}	{}	t	2025-07-24 17:52:31.919+00	2025-07-24 17:56:49.891+00
3301457d-4593-4d05-8752-b1f73b2dc50e	F00003	DERMOGRAFO TP010 THUNDERLORD 	Micropigmentacion - Dermografos	370300.00	490000.00	490000.00	0	5	f	t	\N	46a5e4d8-7485-41ad-a5c9-bb742cefd405	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753383639/fucsia-products/grjpk3zgg6qlfmd0mtj1.jpg}	{}	t	2025-07-22 20:01:57.02+00	2025-07-24 19:00:40.98+00
6740b5a8-3369-4f9e-b488-4541597c8e27	F00007	HENNA MENELA CASTAÑO OSCURO	Cejas - Henna	52182.00	63000.00	56700.00	4	5	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384137/fucsia-products/cfg0f4xc6tvlyyw7ynjj.webp}	{}	t	2025-07-22 20:01:58.327+00	2025-07-24 19:08:57.476+00
182f7640-9e38-4ce7-929f-43fcaca25646	F00010	PIEL LISA BLANCA	Micropigmentacion - Pieles Sinteticas	10000.00	15000.00	13500.00	9	5	f	t	\N	2b0301fc-990c-4bcf-83dc-85b47de5d64d	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384269/fucsia-products/wswz5iew7ovgriglprud.png}	{}	t	2025-07-22 20:01:59.3+00	2025-07-24 19:11:10.605+00
7553be47-637c-4ce5-966b-a5e5935ca0b3	F00012	PIEL SINTÉTICA CON MACRO CEJAS 	Micropigmentacion - Pieles Sinteticas	6162.00	13000.00	11700.00	10	5	f	t	\N	2b0301fc-990c-4bcf-83dc-85b47de5d64d	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384384/fucsia-products/t2uspenfqeemrx78xnyx.png}	{}	t	2025-07-22 20:01:59.956+00	2025-07-24 19:13:04.693+00
3f54be1b-73f5-46e1-9d40-c14d02517daa	F00015	BROCHA ROSADA 	Pestañas - Accesorios-Pestañas	2699.00	4500.00	4050.00	1	6	f	t	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753384934/fucsia-products/j52lzflu4jxsag0rthpv.png}	{}	t	2025-07-22 20:02:00.942+00	2025-07-24 19:22:15.116+00
5ee0d89a-5746-4b5d-9144-817e0fe25f54	F00016	BROCHA DE LUJO	Pestañas - Accesorios-Pestañas	2782.00	6000.00	5400.00	3	6	f	t	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753385051/fucsia-products/ap1gzqdi5gy4wdeyseep.png}	{}	t	2025-07-22 20:02:01.267+00	2025-07-24 19:24:12.894+00
f6b11ae5-f535-4c94-b07e-49a52f2a9bd6	F00020	VERNIER PEQUEÑO	Cejas - Accesorios-Cejas	3082.00	6500.00	5850.00	28	2	f	f	\N	89bc690a-31cd-440c-92c7-4867c5094801	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753385397/fucsia-products/kmwtamkhxpgbobp0orf7.jpg}	{}	t	2025-07-22 20:02:02.59+00	2025-07-24 19:29:58.064+00
47694471-8f0a-4028-82dd-d8ddbf11da9d	F00023	PIEDRA JADE PARA ADHESIVO	Pestañas - Accesorios-Pestañas	3526.00	6000.00	5400.00	15	6	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753385597/fucsia-products/jxac1n78o0fd4dt3tnpp.jpg}	{}	t	2025-07-22 20:02:03.565+00	2025-07-24 19:33:17.455+00
fa61cc7e-2c5d-4729-af6c-7d274ee9a6e4	F00028	PINCEL RECTO GRANDE ROSADO	Cejas - Pinceles	10000.00	15000.00	13500.00	7	6	f	t	\N	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753387325/fucsia-products/bgtqpbbxp9yx1kdu9byr.png}	{}	t	2025-07-22 20:02:05.252+00	2025-07-24 20:02:07.103+00
2007ea14-47ea-44b7-9801-550352882721	F00030	PINCEL RECTO GRANDE NEGRO	Cejas - Pinceles	9000.00	15000.00	13500.00	12	6	f	t	\N	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753387784/fucsia-products/qoshbvw2l49mrkryjmgr.png}	{}	t	2025-07-22 20:02:05.908+00	2025-07-24 20:09:44.636+00
eba6397b-5a7a-4577-8ba5-d24556b8516a	F00033	BROCHA CAFE	Pestañas - Accesorios-Pestañas	3000.00	4500.00	4050.00	1	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753388010/fucsia-products/dbuvztnrlezr9ey1zglz.webp}	{}	t	2025-07-22 20:02:06.928+00	2025-07-24 20:13:30.929+00
176b47be-5107-4777-9590-5154f6dcc114	F00034	GOT2B GEL FIJADOR DE CEJAS	Cejas - Laminado	24000.00	30000.00	27000.00	5	5	f	f	\N	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753388054/fucsia-products/ebpiqb5m6bglbj59qoyj.png}	{}	t	2025-07-22 20:02:07.306+00	2025-07-24 20:14:15.388+00
e9235b3b-b4b0-4241-8f08-ffbad5c17cfc	F00036	LAPIZ DE DISEÑO CERRADO BLANCO	Cejas - Marcacion	3172.00	8000.00	7200.00	14	6	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753388276/fucsia-products/cykokjkidxxtyzykrhcn.jpg}	{}	t	2025-07-22 20:02:07.982+00	2025-07-24 20:17:56.847+00
cc9e2e39-462b-48aa-936f-9e706215e0dd	F00031	PINCEL DIAGONAL PEQUEÑO ROSA 	Cejas - Pinceles	3700.00	9000.00	8100.00	7	4	t	t	7000.00	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753388709/fucsia-products/qzv5x8zlt0heffuf39wj.png}	{}	t	2025-07-22 20:02:06.25+00	2025-07-24 20:25:10.178+00
caae89bc-af08-40e2-a37c-474ceb4658f8	F00040	KIT PINZAS CON ESTUCHE	Pestañas - Pinza	31243.00	45000.00	40500.00	12	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753389336/fucsia-products/itqdpqrwe5fysaigvymf.webp}	{}	t	2025-07-22 20:02:09.326+00	2025-07-24 20:35:37.314+00
397ed4cf-ee0f-4f01-838b-df0817d88291	F00039	0.15D MIX MARRON NAGARAKU 	Pestañas - Pestaña	15000.00	25000.00	22500.00	2	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753389484/fucsia-products/bfmv5vqdkk2f5eqzm2hr.png}	{}	t	2025-07-22 20:02:08.992+00	2025-07-24 20:38:05.231+00
bca70b2d-9e93-477e-b0ed-ff2ce6799430	F00042	MANILLA PARA PINZAS	Pestañas - Accesorios-Pestañas	9595.00	15000.00	13500.00	9	2	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753389672/fucsia-products/k6h0jz8yy82kkwozcfqb.png}	{}	t	2025-07-22 20:02:09.98+00	2025-07-24 20:41:13.372+00
16af3fe4-1c6b-47a3-a3eb-bc9f18709ba0	F00044	ORGANIZADOR PINZAS	Pestañas - Accesorios-Pestañas	10500.00	22000.00	19800.00	8	3	t	f	20000.00	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390034/fucsia-products/b6btjwelt2fb5ggrkhkw.png,https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390034/fucsia-products/iseu9pumv2ypkgaernxp.webp}	{}	t	2025-07-22 20:02:10.652+00	2025-07-24 20:47:15.072+00
bf46b34e-54ad-409f-a252-445ae5a9706f	F00047	PINZA CURVA DORADA ANTIDESLIZANTE	Pestañas - Pinza	13395.00	26000.00	23400.00	3	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390309/fucsia-products/ewc0mola5m0uapghnjct.jpg}	{}	t	2025-07-22 20:02:11.314+00	2025-07-24 20:51:49.661+00
7c9ea9a0-156e-4e41-97cc-9ebfff09448f	F00053	PINZA DELFIN NAGARAKU N-02	Pestañas - Pinza	9677.00	25000.00	22500.00	0	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753390473/fucsia-products/jsgzf6yvimemww1rnyny.webp}	{}	t	2025-07-22 20:02:13.281+00	2025-07-24 20:54:33.94+00
1dc409d1-8f82-445a-81f6-adae244c6cf0	F00103	DEZHMA OPULENCIA	✨ Tapa Blanca: Opulencia Glue: \r\nExcelente poder de union \r\nTiempo de secado 0.5seg \r\nSemanas de retención: 7 ~ 8 semanas, viscosidad muy fina\r\nhumor medio.\r\nTemperatura ideal: 20-28 ‘c\r\nNivel de humedad ideal: 30-70%\r\nTransparente \r\nValor 5ml $65.000	40000.00	67000.00	60300.00	10	6	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753392993/fucsia-products/cqar6m48fdswrremp126.jpg}	{}	t	2025-07-22 20:02:29.661+00	2025-07-24 21:36:34.437+00
8ec8abf9-6e9b-48ed-beec-bd4087bf9175	F00108	18U 0.16 AGUJA MICROBLADING LENGUA DE GATO	Micropigmentacion - Microblading	1500.00	3500.00	3150.00	18	5	f	t	\N	eb5d9a56-9b4e-4446-bbae-fe6285b163ef	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393242/fucsia-products/kruclwijfmhsxto57keu.jpg}	{}	t	2025-07-22 20:02:31.266+00	2025-07-24 21:40:42.648+00
d05ee264-10df-493e-a328-df65abdde47f	F00112	REMOVEDOR PINK GEL 15ML	Pestañas - Removedores	14506.00	26000.00	23400.00	10	10	f	f	\N	bd019c40-c16e-4c76-a6a7-c5f3c8262967	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393492/fucsia-products/zk6jjkpeymjj86afcibn.png}	{}	t	2025-07-22 20:02:32.573+00	2025-07-24 21:44:52.883+00
dcb3ff3c-bacd-418d-abce-fd608f598bce	F00113	ADHESIVO PARA LIFTING BALSAMO  PESTAÑAS FRESA	Pestañas - Lifting	12196.00	30000.00	27000.00	4	6	f	f	\N	a5ca359e-b2a9-4fcc-9089-cd561bb75526	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393773/fucsia-products/qlfttttfhgzkalrpxwcc.jpg}	{}	t	2025-07-22 20:02:32.895+00	2025-07-24 21:49:34.288+00
8205d7f4-31dc-4476-a8e0-ae9f6319f947	F00154	0.15D 13MM NAGARAKU 	Pestañas - Pestaña	10000.00	18000.00	16200.00	13	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753394266/fucsia-products/cqhms9ntraszlqjjgaex.png}	{}	t	2025-07-22 20:02:45.774+00	2025-07-24 21:57:46.786+00
441951ef-1316-4a64-84a2-404b5df029ef	F00115	ADHESIVO SKY ROSE	Tiempo de unión extremadamente rápido (0,5 segundos) y retención prolongada (6 a 8 semanas)\r\n\r\nSky rose se recomienda para profesionales hábiles y rápidos, adhesivo master ultra rápido en secado y duración baja irritación el mejor adhesivo en el mercado de las extensiones de pestañas\r\n\r\nTiempo de secado 0,5 segundos, retención 6-a 8 semanas	29388.00	44000.00	39600.00	13	12	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753394319/fucsia-products/k3fpyerekrmnpzqkkxqd.jpg}	{}	t	2025-07-22 20:02:33.554+00	2025-07-24 21:58:39.633+00
2b125e4e-3412-4f63-9c79-43a4f71c5e22	F00117	ADHESIVO SKY ZONE	Pegamento de la extensión de la pestaña,\r\n\r\nTiempo de secado de 1 a 2 segundos. Poder de unión: 6 semanas ~ 7 semanas\r\n\r\nRecomendado para técnicos nuevos y principiantes.\r\n\r\nInstrucciones de uso del producto.\r\n\r\nAgitar bien antes de usar, aplicar el adhesivo en la extensión de pestaña para pegar a la pestaña natural.\r\n\r\nAlmacene con una tapa adecuada para evitar la entrada de aire.\r\n\r\nCubra bien para evitar la entrada de aire.\r\n\r\nAlmacene un lugar fresco al que los niños no puedan llegar.\r\n\r\nAgite lo suficiente antes de usar\r\n\r\nAsegúrese de que los materiales no lleguen a los ojos cuando los use.\r\n\r\nNo utilice lugares cerca del fuego.\r\n\r\nSi entra en contacto con los ojos o la piel, límpiela y consulte con el médico.	27318.00	39000.00	35100.00	10	12	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753394426/fucsia-products/y10uimdek4qewu2wfepd.png}	{}	t	2025-07-22 20:02:34.208+00	2025-07-24 22:00:27.159+00
b3619431-7874-4fb9-88e4-694c7366bd50	F00125	0.03D 14MM  NAGARAKU	Pestañas - Pestaña	10500.00	18500.00	16650.00	5	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753454704/fucsia-products/agn7sxvnkhnt8aytleex.png}	{}	t	2025-07-22 20:02:36.842+00	2025-07-25 14:45:05.372+00
484a2e05-1121-4d2b-84ba-15bb0f334a36	F00129	0.05D 11MM NAGARAKU	Pestañas - Pestaña	9058.00	18000.00	16200.00	12	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753455150/fucsia-products/jkvdk5tydg0ee2eqxkur.jpg}	{}	t	2025-07-22 20:02:38.192+00	2025-07-25 14:52:31.146+00
0bf9ec78-daea-40d8-a6c9-e5c5039e389a	F00131	0.05D 13MM NAGARAKU 	Pestañas - Pestaña	9080.00	18000.00	16200.00	16	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753456296/fucsia-products/u5h4am82replzbijgwzj.jpg}	{}	t	2025-07-22 20:02:38.845+00	2025-07-25 15:11:37.304+00
6a880779-c0f1-41b3-a491-669dac9da920	F00155	0.15D 14MM NAGARAKU 	Pestañas - Pestaña	10228.00	18000.00	16200.00	20	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753456807/fucsia-products/agt5axwuzexage42rlpy.webp}	{}	t	2025-07-22 20:02:46.094+00	2025-07-25 15:20:07.616+00
491fdb6e-be3a-43e7-ad52-f3b75f4137b3	F00135	0.07D 9MM NAGARAKU 	Pestañas - Pestaña	9136.00	18000.00	16200.00	30	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753456959/fucsia-products/twegak5xflxn1zyvnq8m.webp}	{}	t	2025-07-22 20:02:39.825+00	2025-07-25 15:22:40.148+00
be64d8ba-900d-4503-830b-37a192c6f911	F00137	0.07D 11MM NAGARAKU 	Pestañas - Pestaña	10500.00	18000.00	16200.00	24	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753457100/fucsia-products/wgjca0udajjdg76ipv1u.jpg}	{}	t	2025-07-22 20:02:40.485+00	2025-07-25 15:25:01.123+00
8713b4b0-3954-4789-a471-75ec63921cd1	F00140	0.07D 14MM NAGARAKU 	Pestañas - Pestaña	9682.00	18000.00	16200.00	12	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753457566/fucsia-products/kwftgx7wexefrrwaclrt.png}	{}	t	2025-07-22 20:02:41.485+00	2025-07-25 15:32:47.016+00
30068a88-9340-4a07-b743-7d5a732d69ec	F00143	0.10D 9MM  NAGARAKU	Pestañas - Pestaña	7946.00	18000.00	16200.00	12	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753468127/fucsia-products/jc07vxhzdximnqmuglpk.png}	{}	t	2025-07-22 20:02:42.177+00	2025-07-25 18:28:48.115+00
20e127ab-54a4-439d-9142-04593afdbbb0	F00146	0.10D 12MM  NAGARAKU	Pestañas - Pestaña	8005.00	18000.00	16200.00	10	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753468445/fucsia-products/i1qmexwyrrbl8oufvknc.webp}	{}	t	2025-07-22 20:02:43.141+00	2025-07-25 18:34:05.649+00
a8f0ed1b-c799-4660-bd6c-abc073230817	F00148	0.10D 14MM  NAGARAKU	Pestañas - Pestaña	8005.00	18000.00	16200.00	7	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753468756/fucsia-products/h5oz2qvauqgykjnxulpz.webp}	{}	t	2025-07-22 20:02:43.799+00	2025-07-25 18:39:17.017+00
868bba8a-b911-45ce-8664-6676570ba813	F00157	0.20D 9MM  NAGARAKU	Pestañas - Pestaña	8005.00	18000.00	16200.00	14	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753475209/fucsia-products/khxlah3jdwtsmaaq2etd.jpg}	{}	t	2025-07-22 20:02:46.754+00	2025-07-25 20:26:50.516+00
6652c55c-09fd-49e9-b637-ff6a5b1a674f	F00159	0.20D 11MM  NAGARAKU	Pestañas - Pestaña	8005.00	18000.00	16200.00	13	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753475321/fucsia-products/iurmoqbclpp8kkl89kao.jpg}	{}	t	2025-07-22 20:02:47.44+00	2025-07-25 20:28:41.729+00
41f760b0-57d2-42e4-aa2b-f137c64c72c4	F00057	PINZA ESCAMAS TIPO DELFIN MORADA	Pestañas - Pinza	6422.00	18000.00	16200.00	0	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753540611/fucsia-products/vhikveb2udgpxnlt4dcp.png}	{}	t	2025-07-22 20:02:14.617+00	2025-07-26 14:36:51.798+00
94ec66c6-7bcf-4bf4-a49c-53acb7b2c85a	F00058	PINZA ESCAMAS TIPO DELFIN TORNAZOL 	Pestañas - Pinza	6422.00	18000.00	16200.00	1	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753540701/fucsia-products/nopbgdb8qf0lutt56jgz.jpg}	{}	t	2025-07-22 20:02:14.936+00	2025-07-26 14:38:21.798+00
eac3f9df-161b-4ee7-9914-c5db730de6bd	F00063	PINZA LAGRIMALES NAGARAKU	Pestañas - Pinza	15309.00	27000.00	24300.00	0	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753541460/fucsia-products/hmoexnbmwjcvvldupwb2.png}	{}	t	2025-07-22 20:02:16.581+00	2025-07-26 14:51:01.327+00
98abd636-623b-4d66-bb9f-77e42b2619b9	F00065	PINZA LANKIZ DELFIN ORO ROSA	Pestañas - Pinza	12191.00	24000.00	21600.00	0	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753541794/fucsia-products/jhzx4kbfpmv2x4znodax.webp}	{}	t	2025-07-22 20:02:17.285+00	2025-07-26 14:56:35.272+00
b7bd89b1-e7b6-4ee6-909e-aea362f4b628	F00069	PINZA RECTA NAGARAKU ST-12	Pestañas - Pinza	16309.00	28000.00	25200.00	5	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546270/fucsia-products/l3d0qainurkmthzpjbak.png}	{}	t	2025-07-22 20:02:18.287+00	2025-07-26 16:11:10.815+00
2463a520-bf74-4fef-8b9a-a0931e2ebfdf	F00072	PINZA RECTA ROSA/DORADO	Pestañas - Pinza	11027.00	23000.00	20700.00	1	2	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546495/fucsia-products/sdvcvkol3unmokbepvbo.jpg}	{}	t	2025-07-22 20:02:19.263+00	2025-07-26 16:14:55.774+00
34fda482-7f91-475a-a418-592274158b40	F00552	ANESTESIA NUMB 90%	Súper numb 90%\r\n \r\n\r\nComponentes :\r\n\r\nAgua,Lidocaine,Prilocaína,Epinefrina,Alcoholbencílico,Carbomero,lecitinaSoja,Propileno glico Acetato de toceferil, indicada para pieles abiertas y cerradas , para todos los procedimientos de micropigmentacion ,microblading ,remoción, depilación permanente ,cera, tattoo. modo de uso se debe aplicar en piel cerrada de 25 a 30 minutos y en piel abierta de 5 a 10 minutos. 	25000.00	42000.00	37800.00	6	2	f	t	93000.00	3c196b55-5493-4ad3-a326-caf63389974b	{"Anestecia NUMB","Anestecia Crema"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753556094/fucsia-products/bo8nbmb0k2a9i3saspri.webp,https://res.cloudinary.com/dwgmbqsil/image/upload/v1753556095/fucsia-products/rtwfjufw09ctwu0rmgfp.webp}	{}	t	2025-07-22 20:04:55.21+00	2025-07-26 18:54:55.512+00
44d3eda3-40a9-4f7a-b5fd-93c866069c7c	F00074	PINZA CURVA FRESAS	Pestañas - Pinza	9939.00	18000.00	16200.00	3	3	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753546857/fucsia-products/uunnuhndpm3eskcbwpnz.png}	{}	t	2025-07-22 20:02:19.943+00	2025-07-26 16:20:58.345+00
760a9c9d-0919-4a14-a16a-3a5ae8ca9244	F00077	PINZA STAR RECTA PLATEADA	Pestañas - Pinza	6160.00	24000.00	21600.00	2	6	t	f	15000.00	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547169/fucsia-products/vjbyb0idqoyvj1bdqney.webp}	{}	t	2025-07-22 20:02:21.004+00	2025-07-26 16:26:09.735+00
757583a3-2b74-4021-a17d-5f66a89fc059	F00062	PINZA LAGRIMALES MORADA / ROSADA	Pestañas - Pinza	18080.00	29000.00	26100.00	2	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547358/fucsia-products/ugveqqiesyo6hupusbjz.png}	{}	t	2025-07-22 20:02:16.244+00	2025-07-26 16:29:18.716+00
bb4e9056-43ff-48df-a98e-885909f1148e	F00083	PINZA VOLUMEN DECEMARS MJP-08-US	Pestañas - Pinza	19909.00	30000.00	27000.00	4	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547753/fucsia-products/aznipb9qlylbz46lo5ib.jpg}	{}	t	2025-07-22 20:02:23.055+00	2025-07-26 16:35:53.594+00
46ea7a03-540c-4dce-a982-2903cb0c3619	F00085	PINZA STAR TIPO L TORNAZOL	Pestañas - Pinza	8160.00	24000.00	21600.00	0	6	t	f	15000.00	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753547897/fucsia-products/ruh9reobp7eqpytkno8z.png}	{}	t	2025-07-22 20:02:23.786+00	2025-07-26 16:38:17.825+00
afd484e8-0c00-4503-9423-da8912bedff4	F00088	PINZA VOLUMEN PLATEADA	Pestañas - Pinza	12048.00	23000.00	20700.00	3	5	t	f	15000.00	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753548413/fucsia-products/r56wtwd38c3rspffk7ox.png}	{}	t	2025-07-22 20:02:24.765+00	2025-07-26 16:46:53.779+00
97611be8-a91d-4e2d-b529-13f45372278a	F00301	CASTAÑO OSCURO HENNA BEAUTY	Cejas - Henna	13000.00	22000.00	19800.00	15	3	f	t	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:03:33.243+00	2025-07-26 18:31:00.734+00
31af6da7-c8bb-46bd-ac35-e57758196aa9	F00279	CEPILLO LAMINADO DE CEJAS ROSADO 	El Cepillo Laminado de Cejas Rosado de Fucsiainsumos es la herramienta ideal para conseguir unas cejas perfectamente peinadas y definidas. Con un diseño rosado vibrante, este cepillo esencial en la categoría de Cejas y Micro te permite lograr un look impecable en segundos. ¡Potencia tu mirada y destaca tu belleza con este imprescindible accesorio de belleza! ¡Hazte con el tuyo hoy mismo!	700.00	1500.00	1350.00	58	24	f	t	\N	f838182e-a7e3-42e3-ae14-fcb221a00edb	{}	{}	\N	t	2025-07-22 20:03:26.457+00	2025-07-26 18:31:00.756+00
a386a97b-15b8-4e91-bc5b-c97f71aaeda4	F00587	DERMOGRAFO LUJO P300 DORADO		282000.00	450000.00	\N	1	5	f	f	\N	46a5e4d8-7485-41ad-a5c9-bb742cefd405	{}	{}	\N	t	2025-07-26 18:31:00.793+00	2025-07-26 18:31:00.793+00
d953e957-6777-42da-b5d0-c2594232aa75	F00105	DEZHMA ALUCINANTE	Excelente poder de unión. Tiempo de secado 0.3seg. Semanas de retención: 7 ~ 8 semanas, viscosidad fina. Temperatura ideal: 19-25 ‘c\r\nNivel de humedad ideal: 45-70%\r\nHumor bajo	40000.00	67000.00	60300.00	4	6	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393072/fucsia-products/heoqtapxeurexlqin1gb.jpg}	{}	t	2025-07-22 20:02:30.306+00	2025-08-01 20:50:25.221+00
8c532e6d-8b06-4953-824a-807f76ee6009	F00409	ANESTESIA SUSTAINE 	Anestesia para piel abierta Sustaine en Gel\r\n \r\n\r\nSustaine Blue Gel es un producto adormecedor increíblemente poderoso durante el procedimiento.\r\n\r\nCuando se usa después de delinear un tatuaje, durante la aplicación de maquillaje permanente, electrólisis, microblading u otros procedimientos de piel sensible para desensibilizar el área para completar el trabajo.\r\n\r\nEste poderoso anestésico tópico contiene 4% de lidocaína y 2% de tetracaína para adormecer, así como .02% de epinefrina para reducir la hinchazón, los hematomas y el sangrado.\r\n\r\nLa velocidad y eficacia de Sustaine en la reducción de hematomas e hinchazón lo hace popular para trabajos sensibles y la inflamación que a menudo se asocia con otras áreas sensibles.\r\n\r\nNo recomendamos volver a aplicar este producto más de dos veces en una sola sesión, en la misma área. Se debe tener cuidado para evitar que los anestésicos entren en los ojos o la boca.	80000.00	98500.00	98500.00	4	5	f	t	\N	3c196b55-5493-4ad3-a326-caf63389974b	{"piel abierta","micro labios","anestesia gel"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753556905/fucsia-products/uqkkcbwzcqn3kvyse4zn.webp}	{}	t	2025-07-22 20:04:08.023+00	2025-07-26 19:08:25.747+00
9698a4fb-911f-4b59-a90a-29a44d092405	F00116	ADHESIVO LADY BLACK 	Pestañas - Adhesivos	23000.00	39000.00	35100.00	22	12	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753394376/fucsia-products/zrqvugb6lpe5bnkgzkfk.jpg}	{}	t	2025-07-22 20:02:33.888+00	2025-08-01 17:59:40.473+00
13afdf8c-9b35-4605-b8e6-c4dc26937b94	F00306	LAPICEROS EN GEL BLANCO	Cejas - Marcacion	3548.00	13000.00	11700.00	16	10	f	t	\N	f913302c-298a-4f30-ab76-b0365d06ce56	{}	{}	\N	t	2025-07-22 20:03:34.866+00	2025-08-01 20:50:25.239+00
63cc5329-2b4b-4027-8cf8-bc4085c16cb4	F00152	0.15D 11MM NAGARAKU 	Pestañas - Pestaña	8282.00	18000.00	16200.00	10	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753474318/fucsia-products/zg3oeomsfclkjttoxfu3.jpg}	{}	t	2025-07-22 20:02:45.128+00	2025-08-01 21:14:48.78+00
52f0e98f-0d96-4fa6-bb56-e74241170a7d	F00259	ANESTESIA SSJ 48% PIEL ABIERTA	Micropigmentacion - Anestesias	65200.00	95000.00	85500.00	7	3	t	t	93000.00	3c196b55-5493-4ad3-a326-caf63389974b	{"anestesia gel","piel abierta",SSJ}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753556366/fucsia-products/melo4u0dn6mq2hcgnzmx.webp}	{}	t	2025-07-22 20:03:19.954+00	2025-07-26 19:04:51.134+00
7c584b4e-31e6-40f0-870c-e83a8e278580	F00258	ANESTESIA 75% PROASEGIS	Anestesia Proasegis 75%\r\n \r\n\r\nEfecto rápido, reduce el sangrado, eficaz para maquillaje permanente. Ingredientes: Lidocaína HCl 40 mg. Epinefrina HCl 0,4 mg.\r\n\r\nModo de empleo: Aplique una capa gruesa en el área a dormir, espere 5 minutos para seguir con el procedimiento	16500.00	35000.00	31500.00	13	5	f	t	\N	3c196b55-5493-4ad3-a326-caf63389974b	{"anestesia topica","anestesia en crema"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753557255/fucsia-products/pekcuhd9jbeyvqrsxd9v.webp,https://res.cloudinary.com/dwgmbqsil/image/upload/v1753557256/fucsia-products/nequthuxbeiuttlzszey.webp}	{}	t	2025-07-22 20:03:19.62+00	2025-07-26 19:14:16.641+00
aa52e2ae-5f83-45e7-bc39-afebfe263d7a	F00588	ANESTESIA BP SUPER NUMB EN GEL 90% 30ML	Super numb en gel al 90%\r\n \r\n\r\nSuper Numb en gel al 90% es una anestecia diseñada para brindar mayor comodidad durante procedimientos en piel abierta. Su fórmula avanzada es ideal para micropigmentación, microblading, remoción, depilación permanente, cera y tatuajes.\r\n\r\nGracias a su composición cuidadosamente seleccionada, proporciona una sensación de alivio y confort en la zona aplicada, facilitando el trabajo del profesional y mejorando la experiencia del cliente.\r\n\r\nIngredientes principales:\r\n\r\nLidocaína y Prilocaína: Contribuyen a minimizar la sensibilidad de la piel.\r\nEpinefrina: Ayuda a reducir el enrojecimiento y la inflamación.\r\nAlcohol bencílico y Propilenglicol: Favorecen la absorción del producto.\r\nCarbómero: Aporta la textura en gel para una aplicación uniforme.\r\nLecitina de soja y Acetato de tocoferilo (Vitamina E): Contribuyen a la hidratación y protección de la piel.\r\nModo de uso:\r\nAplicar una fina capa sobre la piel abierta y dejar actuar entre 2 y 7 minutos. Luego, retirar el exceso y continuar con el procedimiento.\r\n\r\nEste producto ha sido desarrollado para acompañar a los profesionales en cada sesión, ofreciendo una experiencia más cómoda y efectiva.	70000.00	110000.00	\N	2	5	f	t	\N	3c196b55-5493-4ad3-a326-caf63389974b	{"ANESTESIA EN GEL"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753557542/fucsia-products/ubltlq9z9jctg4wqh7os.webp}	{}	t	2025-07-26 18:31:00.699+00	2025-07-26 19:19:03.354+00
3fb812b9-44cf-4b56-bce6-870d517f6550	F00090	PINZA VETUS VOLUMEN 3D 6A-SA 	La pinza Vetus 6A-SA de 45 grados es una herramienta de alargamiento de pestañas de alta precisión. Con una punta superfina, te permite pellizcar alambres de pequeño grosor, como los hilos de volumen ruso. Se puede esterilizar en autoclave y no reacciona con los ácidos producidos por las manos.\r\n\r\nEstá hecho de acero inoxidable de primera calidad, no magnético, superduro (HRC45) y resistente. Proporciona diferentes sensaciones en el proceso y la apariencia, la punta delgada de la cabeza puede contener un objeto de 0,01 mm, es duradera y no se deforma fácilmente.\r\n\r\nAdemás, se puede usar en diversas aplicaciones como cosméticos, electrónica, relojes, joyas, productos químicos, laboratorios, cámaras digitales de alta tecnología y teléfonos celulares.	20182.00	33000.00	29700.00	3	5	f	t	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{"pinza vetus","pinza volumen","pinza para pestañas"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753560164/fucsia-products/nvodxfkw1c87s61haoiu.webp}	{}	t	2025-07-22 20:02:25.403+00	2025-07-26 20:02:44.822+00
af17c1b4-6610-4a01-95c5-06d5decf88c6	F00092	PINZA VETUS VOLUMEN RUSO TORNASOL MCS-6A-A 	Pestañas - Pinza	25380.00	33000.00	29700.00	0	5	f	f	\N	c2aae64d-2b82-48f4-ab82-dd630f31a694	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753561153/fucsia-products/oupmhargqj01oct4iiw9.webp,https://res.cloudinary.com/dwgmbqsil/image/upload/v1753561153/fucsia-products/dyoasrtyjjkzvszztprw.webp}	{}	t	2025-07-22 20:02:26.042+00	2025-07-26 20:19:13.678+00
b85903db-c7f1-4531-a6f4-30ff14927a61	F00151	0.15D 10MM NAGARAKU 	Pestañas - Pestaña	10056.00	18000.00	16200.00	9	10	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753474277/fucsia-products/wr1lpigneydszjbi6unb.jpg}	{}	t	2025-07-22 20:02:44.798+00	2025-08-01 21:14:48.762+00
a58aa6e2-a8a8-453e-9e1a-73beea31f08c	F00093	FUNDA PARA ALMOHADA COLORES SURTIDOS	Ayudándole a evitar que nada roole hacia ellos durante el procedimiento de extensiones de pestañas.\r\n\r\nEspecialmente elaborado con un diseño ergonómico.\r\n\r\nAñade aún más comodidad.\r\n\r\nDiseño de curva ergonómica, puede estabilizar eficazmente la posición para dormir.\r\n\r\nEs conveniente para la operación laboral y la curva se adapta a la curva de la cabeza, lo que mejora la comodidad y no se cansa después de tumbarse durante mucho tiempo.\r\n\r\nDiseño de cremallera invisible\r\n\r\nFácil de desmontar e instalar\r\n\r\n\r\n\r\nDescribir:\r\n\r\nMaterial: franela\r\n\r\nColor: gris, rosa rojo, negro, morado, rosa\r\n\r\nTamaño (aprox.): 50*20*13 cm/19,5*7,87*5 pulgadas\r\n\r\n\r\n\r\nPaquete incluido:\r\n\r\n1 * funda de repuesto para almohada de pestañas (inserto de almohada no incluido)\r\n\r\nComentario:\r\n\r\n1.La tolerancia de medición manual es de 2 a 5 g.Por favor, no te preocupes por tus sustituciones.\r\n\r\n2.Debido a la diferencia entre diferentes monitores, es posible que la imagen no refleje el color real del artículo.muchas gracias!	36500.00	40000.00	36000.00	9	5	f	f	\N	91a2beaf-477e-40ee-bda8-854de5f3883f	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753562252/fucsia-products/qvu9lphcamjrht1sapfe.jpg}	{}	t	2025-07-22 20:02:26.379+00	2025-07-26 20:37:33.2+00
081a8fcd-e57d-4780-9cce-8361e13e4a63	F00095	SHAMPOO DEZHMA 55ML	Pestañas - Limpieza-Pestañas	13000.00	27000.00	24300.00	10	6	f	t	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753562971/fucsia-products/ctvqbuc2gxflpq4przpq.jpg,https://res.cloudinary.com/dwgmbqsil/image/upload/v1753562971/fucsia-products/ji9cwawo1rkfydueubzk.jpg}	{}	t	2025-07-22 20:02:27.033+00	2025-07-26 20:49:31.73+00
3daeeb17-cbf0-42cb-b8a5-9662c9e0d829	F00098	SHAMPOO DQ 150ML 	✨ Shampoo Espumoso para Pestañas – Especial para Lashistas ✨\r\nLimpieza suave, resultados profesionales.\r\nNuestro shampoo espumoso fue creado especialmente para lashistas que cuidan cada detalle. Su fórmula libre de aceites limpia profundamente la zona ocular sin irritar, eliminando impurezas, grasa y residuos de maquillaje para asegurar una mejor adherencia de las extensiones y mayor duración en cada aplicación.\r\nIdeal para preparar el set antes del procedimiento o para enseñar a tus clientas cómo mantener sus pestañas limpias y saludables entre citas.\r\n💧 Espuma suave\r\n🌿 Fórmula libre de parabenos y aceites\r\n👁️ Apto para todo tipo de piel\r\n\r\nUn básico en tu estación de trabajo. Profesional, delicado y efectivo.	12619.00	21000.00	21000.00	7	5	f	f	\N	675196a7-7dc4-4c1e-b3a3-df6ab3fcb887	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753565816/fucsia-products/j1ounaki4jjt9ik9inqv.jpg}	{}	t	2025-07-22 20:02:28.012+00	2025-07-26 21:36:57.07+00
8f19b30e-b5b7-432e-b449-d61566586775	F00161	0.20D 13MM  NAGARAKU	Fibras de pestañas 0.20D 	8005.00	18000.00	16200.00	12	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{"Pestañas pelo a pelo","extensiones 1x1"}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753566503/fucsia-products/ahfh0j0u4xs72spgcyof.jpg}	{"Curva D": "13 MM"}	t	2025-07-22 20:02:48.092+00	2025-07-26 21:48:23.749+00
40f00da2-c233-4160-bdf3-bda6f710f380	F00204	0.15C MIX NAGARAKU 	Pestañas nagaraku mixtas\r\n¡Maximiza la versatilidad de tus servicios con las Pestañas Nagaraku Mixtas, ideales para crear looks personalizados y variados!\r\n\r\nEstas pestañas de alta calidad, conocidas como «Premium Mink Lashes», ofrecen un acabado natural y son increíblemente suaves. Su principal característica es que cada bandeja contiene tiras con diferentes longitudes (MIX), abarcando desde 8mm hasta 15mm, como se ve en la imagen. Esto te permite diseñar una gran diversidad de estilos, adaptándose perfectamente a la forma del ojo de cada cliente sin necesidad de varias bandejas.\r\n\r\nVentajas clave:\r\n\r\nVariedad en una Bandeja: Incluye múltiples longitudes (MIX) para diseños fluidos y personalizados.\r\nCalidad Premium: Ligeras, suaves y con un acabado natural similar al visón.\r\nFácil Aplicación: Tiras que se desprenden sin esfuerzo y con adhesivo que no deja residuos.\r\nDurabilidad: Mantienen su curvatura y forma a lo largo del tiempo.\r\nEmpaque Seguro: Blíster resistente que protege las pestañas.\r\nCalidad Garantizada: Certificadas y hechas a mano, libres de crueldad animal.\r\nNuevas Presentaciones: Pueden variar en diseño de empaque, manteniendo la misma calidad.	10000.00	21000.00	18900.00	11	4	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753568697/fucsia-products/x2wktiehqnstzxyh9bxl.webp}	{}	t	2025-07-22 20:03:02.081+00	2025-07-26 22:24:58.159+00
38bdab43-9946-4431-b1f1-d65513901468	F00442	MARRON TINTA PARA CEJAS 	Cejas - Henna	24560.00	33000.00	29700.00	38	20	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:04:18.879+00	2025-07-28 17:58:17.093+00
75eae7ee-09fe-4d03-9b26-f0ffa7a39cd3	F00440	MARRON CLARO TINTA PARA CEJAS 	Cejas - Henna	24560.00	33000.00	29700.00	19	12	f	f	\N	25e060f2-df20-4e3f-8b90-496ce70629e5	{}	{}	\N	t	2025-07-22 20:04:18.214+00	2025-07-28 17:58:17.133+00
21925050-d82b-48f2-8484-f98fcd2cc11f	F00106	DEZHMA CLASSIC 	Tiempo de secado de 1seg\r\ntiempo de retención en las pestañas de 6-7 semanas\r\nviscosidad fina\r\nhumor medio \r\nTemperatura ideal 19-26'c y una humedad del 50~70%	38000.00	57000.00	51300.00	6	10	f	t	\N	6109c404-c644-42ae-966d-4c3fd0264331	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753393108/fucsia-products/qgnssuqg1p9unwggeab3.jpg}	{}	t	2025-07-22 20:02:30.63+00	2025-08-01 16:23:30.943+00
245b036f-ea5c-4954-8552-47158166b502	F00589	ORGANIZADOR DE CARRITO CON 8 DIVISIONES ACRILICO	El complemento ideal para que puedas organizar tus pinceles, cepillos y todo en el tu carrito organizador. 	18000.00	28000.00	22500.00	2	2	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{}	{}	\N	t	2025-08-01 16:44:15.504+00	2025-08-01 16:44:15.504+00
bde48ef3-dc46-4b05-8a2a-a01130d3ac68	F00362	CERA 250 MLG KIWI	"¡Descubre la frescura y efectividad de la ceramiel Belotti Kiwi! 🥝🌿 Esta fórmula, elaborada con ingredientes naturales, ofrece una depilación efectiva en cualquier zona del cuerpo, extrayendo el vello desde la raíz con máxima eficacia. Indicada para todos los tipos de piel, especialmente para las sensibles y delicadas, gracias a su delicada acción calmante. Además, su fresco y suave aroma te envolverá en una experiencia única.	8835.00	17500.00	15750.00	8	6	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:03:52.824+00	2025-08-01 18:49:25.87+00
9118820e-cb5d-41ad-ae0e-2295c28b2fea	F00590	ESPEJO CON BASE DE MADERA		16000.00	25000.00	\N	1	5	f	f	\N	786480b7-f6e8-4f03-9512-98cf8f6b3232	{}	{}	\N	t	2025-08-01 16:44:15.561+00	2025-08-01 16:44:15.561+00
5bf3c752-0343-4053-9dcc-19ae0df97616	F00591	EXFOLIANTE SAL ROSADA DEL HIMALAYA		18000.00	28000.00	\N	2	5	f	f	\N	fd89886f-e5ea-4f7c-bd96-45efb9d5b5fa	{}	{}	\N	t	2025-08-01 16:44:15.59+00	2025-08-01 16:44:15.59+00
56404365-729e-4ce7-8f6b-88943acea686	F00541	ORGANIZADOR DE PINCELES	El complemento ideal para que puedas organizar tus pinceles, cepillos y todo en el tu carrito organizador. 	14000.00	25000.00	22500.00	3	2	f	f	\N	705161cf-bfe6-418a-b561-3d4f79b91b58	{organizador}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1754065368/fucsia-products/wzusiiukqw24gbnrgxod.jpg}	{}	t	2025-07-22 20:04:51.317+00	2025-08-01 17:03:28.285+00
84a8256e-310a-4030-b87a-a0275471eaf4	F00471	NAGARAKU ANIME ESPIGA MIX/13MM	Pestañas - Pestaña	17000.00	28000.00	25200.00	10	5	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:04:27.704+00	2025-08-01 19:25:22.014+00
27d9d386-e9d2-497c-bab7-935e6567be01	F00349	PAÑITOS HUMEDOS SIN ALCOHOL 	Accesorios - Limpieza-Accesorios	6800.00	12000.00	10800.00	8	10	f	f	\N	8bc67f76-98f0-4a23-a517-3d2a5e96cbb2	{}	{}	\N	t	2025-07-22 20:03:48.59+00	2025-08-01 19:27:57.209+00
082c4bf3-a10a-4471-9680-0c34826e079a	F00025	PINCEL DIAGONAL NEGRO PEQUEÑO	Cejas - Pinceles	3700.00	9000.00	8100.00	12	6	t	t	7000.00	35639cb3-1245-43f2-bf67-ce263b87f768	{}	{https://res.cloudinary.com/dwgmbqsil/image/upload/v1753387163/fucsia-products/lsqeqyrj0vpppuy3obdh.png}	{}	t	2025-07-22 20:02:04.227+00	2025-08-01 21:09:27.767+00
64613f12-7047-4519-8b75-1ba0ae2b092f	F00534	CERA 125 MLG ORO	Cejas - Depilacion	4833.00	9000.00	8100.00	5	3	f	f	\N	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	{}	{}	\N	t	2025-07-22 20:04:48.945+00	2025-08-02 15:26:13.65+00
230d606e-db95-4432-baaf-29e66a2aa66a	F00182	0.07D W 4D 11MM NAGARAKU	Pestañas - Pestaña	24200.00	34000.00	30600.00	3	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:54.914+00	2025-08-02 17:12:42.112+00
d3c395d8-2b2c-4f8d-8658-a1a0edccdd7c	F00183	0.07D W 4D 12MM NAGARAKU	Pestañas - Pestaña	24200.00	34000.00	30600.00	7	6	f	f	\N	4b89a67e-fe80-48b7-ae3b-f93a7e6c8db5	{}	{}	\N	t	2025-07-22 20:02:55.244+00	2025-08-02 17:12:42.129+00
\.


--
-- Data for Name: Proveedors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Proveedors" (id, nombre, nit, contacto, telefono, email, direccion, "terminosPago", "isActive", notas, "createdAt", "updatedAt") FROM stdin;
af5fd395-7b33-4084-bf36-84c9ef2c30de	BEAUTY PLUS	901195879	Lili / Valen	3015036363	dagtiso@gmail.com	Medellin - Bogotá	Contado	t		2025-07-23 20:31:15.065+00	2025-07-23 20:31:15.065+00
5c32e4b3-1284-4680-a9f1-8732b0ffd978	ELITE IMPORTACIONES SAS			3104321315		PROVEEDOR MEDELLIN IMPORTADOR	Contado	t		2025-07-23 20:32:57.922+00	2025-07-23 20:32:57.922+00
67ef9050-7a89-4851-8ea9-2ebad1184240	DYL DISTRIBUCIONES SAS 	17717650593	LORENA	3174237092			Contado	t	Lienzos y Ceras Belotti	2025-07-24 20:40:02.58+00	2025-07-24 20:40:02.58+00
cacc403d-e252-4462-bafa-cf3e3bc86f7e	RUTH MILEY RAMOS RIVAS	6005200995	MILEY RAMOS 	3014561300		CRA 49B #110 - 10 LOCAL 101	Contado	t	52700000473 BANCOLOMBIA AHORROS	2025-07-26 18:37:25.487+00	2025-07-26 18:37:25.487+00
1ffcf8c6-96f8-44a7-b49e-9f8cb32b49e7	TODO A 5000	NO APLICA	N/A			RESTREPO	Contado	t		2025-07-26 18:42:28.79+00	2025-07-26 18:42:28.79+00
98468592-d2b6-4ead-b27c-61e86921be6d	DOLLARCITY	900943243-4				AV 3 # 57 30 	Contado	t		2025-08-01 16:03:26.486+00	2025-08-01 16:03:26.486+00
6eeed81c-c7b9-499d-a923-a1399b8de133	probando si carga	45454545454	345345555555	5666666666	yanicorc@gmail.com	probando	Contado	t	probando	2025-08-01 19:45:40.754+00	2025-08-01 19:45:40.754+00
\.


--
-- Data for Name: PurchaseOrderItems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseOrderItems" (id, "purchaseOrderId", "productId", "productName", "productSku", "productDescription", "categoryId", cantidad, "cantidadRecibida", "precioUnitario", subtotal, "precioVentaSugerido", "precioDistribuidorSugerido", "stockMinimo", "isNewProduct", notas, "createdAt", "updatedAt") FROM stdin;
382d4386-00bd-4177-899b-46acae51e83a	b9af967e-ef2b-4d67-bafb-4e2e0533b1dc	8c9e8ec5-60cc-4b37-aa51-714c2ddba5f2	ROLLO LIENZO MIRACLE	F00337	Cejas - Depilacion	94f4e210-2a0c-40e8-bf84-42b82a7b6c8f	24	0	12240.00	293760.00	19000.00	17100.00	5	f		2025-07-24 21:07:35.822+00	2025-07-24 21:07:35.822+00
b0a0d000-fbd1-4d8f-ad67-8df9336b6f37	d8356496-3906-4418-88ec-de330d13ddd2	aa52e2ae-5f83-45e7-bc39-afebfe263d7a	ANESTESIA BP SUPER NUMB EN GEL 90% 30ML	F00588		3c196b55-5493-4ad3-a326-caf63389974b	2	2	70000.00	140000.00	110000.00	\N	5	t		2025-07-26 18:30:30.083+00	2025-07-26 18:31:00.722+00
ac06fae8-3eb9-4bac-b152-838564ec789d	d8356496-3906-4418-88ec-de330d13ddd2	97611be8-a91d-4e2d-b529-13f45372278a	CASTAÑO OSCURO HENNA BEAUTY	F00301	Cejas - Henna	25e060f2-df20-4e3f-8b90-496ce70629e5	10	10	13000.00	130000.00	22000.00	19800.00	3	f		2025-07-26 18:30:30.04+00	2025-07-26 18:31:00.745+00
7c1ab4a2-37bf-4e5d-8652-a868dc1f4a55	d8356496-3906-4418-88ec-de330d13ddd2	31af6da7-c8bb-46bd-ac35-e57758196aa9	CEPILLO LAMINADO DE CEJAS ROSADO 	F00279	El Cepillo Laminado de Cejas Rosado de Fucsiainsumos es la herramienta ideal para conseguir unas cejas perfectamente peinadas y definidas. Con un diseño rosado vibrante, este cepillo esencial en la categoría de Cejas y Micro te permite lograr un look impecable en segundos. ¡Potencia tu mirada y destaca tu belleza con este imprescindible accesorio de belleza! ¡Hazte con el tuyo hoy mismo!	f838182e-a7e3-42e3-ae14-fcb221a00edb	30	30	700.00	21000.00	1500.00	1350.00	24	f		2025-07-26 18:30:30.048+00	2025-07-26 18:31:00.766+00
0f8c9c24-728e-402c-bacf-af4eb5be5faf	d8356496-3906-4418-88ec-de330d13ddd2	9698a4fb-911f-4b59-a90a-29a44d092405	ADHESIVO LADY BLACK 	F00116	Pestañas - Adhesivos	6109c404-c644-42ae-966d-4c3fd0264331	10	10	23000.00	230000.00	39000.00	35100.00	12	f		2025-07-26 18:30:30.055+00	2025-07-26 18:31:00.787+00
0e8917f8-2d08-47b3-8689-0860c181f86d	062c4db3-5fec-40e1-b3c6-249763e9419f	9118820e-cb5d-41ad-ae0e-2295c28b2fea	ESPEJO CON BASE DE MADERA	F00590		786480b7-f6e8-4f03-9512-98cf8f6b3232	1	1	16000.00	16000.00	25000.00	\N	5	t		2025-08-01 16:43:59.39+00	2025-08-01 16:44:15.583+00
30ee5db0-c696-4a72-86f3-b6c5df236123	d8356496-3906-4418-88ec-de330d13ddd2	a386a97b-15b8-4e91-bc5b-c97f71aaeda4	DERMOGRAFO LUJO P300 DORADO	F00587		46a5e4d8-7485-41ad-a5c9-bb742cefd405	1	1	282000.00	282000.00	450000.00	\N	5	t		2025-07-26 18:30:30.062+00	2025-07-26 18:31:00.81+00
a8f32e86-37f6-4a5a-b573-53b2cf819806	d8356496-3906-4418-88ec-de330d13ddd2	34fda482-7f91-475a-a418-592274158b40	ANESTESIA NUMB 90%	F00552	Micropigmentacion - Anestesias	3c196b55-5493-4ad3-a326-caf63389974b	4	4	25000.00	100000.00	42000.00	37800.00	2	f		2025-07-26 18:30:30.069+00	2025-07-26 18:31:00.832+00
67bd4f16-9715-497d-be7c-38bab98fcbf2	d8356496-3906-4418-88ec-de330d13ddd2	8c532e6d-8b06-4953-824a-807f76ee6009	ANESTESIA SUSTAINE 	F00409	Micropigmentacion - Anestesias	3c196b55-5493-4ad3-a326-caf63389974b	2	2	80000.00	160000.00	95000.00	90250.00	5	f		2025-07-26 18:30:30.076+00	2025-07-26 18:31:00.855+00
d715f88c-5a8b-4feb-a25d-4492aab6c045	090b62de-fb96-4626-a5cc-62821629e9ed	38bdab43-9946-4431-b1f1-d65513901468	MARRON TINTA PARA CEJAS 	F00442	Cejas - Henna	25e060f2-df20-4e3f-8b90-496ce70629e5	25	25	24560.00	614000.00	33000.00	29700.00	20	f		2025-07-26 18:41:43.953+00	2025-07-28 17:58:17.12+00
530cbae1-8490-495f-8cde-b01cf2463461	090b62de-fb96-4626-a5cc-62821629e9ed	75eae7ee-09fe-4d03-9b26-f0ffa7a39cd3	MARRON CLARO TINTA PARA CEJAS 	F00440	Cejas - Henna	25e060f2-df20-4e3f-8b90-496ce70629e5	15	15	24560.00	368400.00	33000.00	29700.00	12	f		2025-07-26 18:41:43.946+00	2025-07-28 17:58:17.144+00
a3cf7e97-f130-4a90-8346-e742a3f45f91	062c4db3-5fec-40e1-b3c6-249763e9419f	58047015-1e4d-4bc9-afaf-5b7fbb110487	GEL ALOE VERA Y COCO	F00396	Piel - Hidratacion-Piel	6562fd99-f728-4961-9983-f4adc2ec60ca	4	4	12000.00	48000.00	18000.00	16200.00	5	f		2025-08-01 16:43:59.41+00	2025-08-01 16:44:15.495+00
149b99ad-5ffd-4748-b293-1149d36e420e	062c4db3-5fec-40e1-b3c6-249763e9419f	245b036f-ea5c-4954-8552-47158166b502	ORGANIZADOR DE CARRITO CON 8 DIVISIONES ACRILICO	F00589	El complemento ideal para que puedas organizar tus pinceles, cepillos y todo en el tu carrito organizador. 	705161cf-bfe6-418a-b561-3d4f79b91b58	2	2	18000.00	36000.00	28000.00	22500.00	2	t		2025-08-01 16:43:59.374+00	2025-08-01 16:44:15.528+00
18371c4d-08f7-40e9-a6c3-660408e844db	062c4db3-5fec-40e1-b3c6-249763e9419f	56404365-729e-4ce7-8f6b-88943acea686	ORGANIZADOR DE PINCELES	F00541	El complemento ideal para que puedas organizar tus pinceles, cepillos y todo en el tu carrito organizador. 	705161cf-bfe6-418a-b561-3d4f79b91b58	2	2	14000.00	28000.00	25000.00	22500.00	2	f		2025-08-01 16:43:59.383+00	2025-08-01 16:44:15.555+00
a8e38256-286e-4e3d-be33-affc21032d25	062c4db3-5fec-40e1-b3c6-249763e9419f	5bf3c752-0343-4053-9dcc-19ae0df97616	EXFOLIANTE SAL ROSADA DEL HIMALAYA	F00591		fd89886f-e5ea-4f7c-bd96-45efb9d5b5fa	2	2	18000.00	36000.00	28000.00	\N	5	t		2025-08-01 16:43:59.398+00	2025-08-01 16:44:15.61+00
4a350974-de30-4c23-b9d9-3f1de703587b	062c4db3-5fec-40e1-b3c6-249763e9419f	f31a4de4-3507-4fa1-acb1-49337e3252d4	NAGARAKU 0.15LC MIX 7-15MM	F00540	Pestañas	e86d4c63-095c-4cd0-a95e-db06bae5bc73	1	1	12000.00	12000.00	18000.00	30600.00	2	f		2025-08-01 16:43:59.404+00	2025-08-01 16:44:15.637+00
86fba4c9-bd1e-4cfa-84ec-360a4c3e811d	135b8814-ddb7-4346-a346-507648836837	7bb7ecd4-b1d2-4146-95b3-44adcd5a9cb3	ACRILICO ORGANIZADOR CON 3 DIVISIONES 	F00542	Organización - Organización-Varios	0c7bd844-3663-4f3b-b51d-401d9d8606f7	5	5	16000.00	80000.00	28000.00	28000.00	5	f		2025-08-01 16:46:12.678+00	2025-08-01 16:46:23.971+00
4219191a-fd87-440d-ba49-419f74bd37f6	416bde78-1dae-48ac-abcf-05ddf1301838	f7dc49ae-90fa-40d7-b052-3930414216d7	PIGMENTO MAG COLOR CORAL 5ML	F00433	Micropigmentacion - Pigmentos	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	110000.00	5	f		2025-08-01 20:37:16.468+00	2025-08-01 20:37:16.468+00
3cfcd471-1ee7-4cb0-861b-e118a54b96d7	416bde78-1dae-48ac-abcf-05ddf1301838	10e3638c-5c6e-40a5-8f8b-805ddd1484e4	PIGMENTO MAG COLOR PITANGA 5ML	F00435	Micropigmentacion - Pigmentos	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	110000.00	5	f		2025-08-01 20:37:16.475+00	2025-08-01 20:37:16.475+00
4ed1c161-1eff-4ef7-8da8-f1e8a2f0c44e	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR LIPS CACAU 	F00598		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.482+00	2025-08-01 20:37:16.482+00
9b29cf9c-4f7b-4d0c-8de5-fec2d58e6fac	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR BRANCO 	F00603		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	91000.00	91000.00	150000.00	\N	5	t		2025-08-01 20:37:16.487+00	2025-08-01 20:37:16.487+00
8ad9f082-3df6-4863-85a7-e5ff0a496bc1	416bde78-1dae-48ac-abcf-05ddf1301838	f5cfddbe-147d-4bb1-976b-824de49ea6fd	MAG COLOR NARANJA 5ML	F00427	Micropigmentacion - Pigmentos	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	99000.00	5	f		2025-08-01 20:37:16.493+00	2025-08-01 20:37:16.493+00
631f5aa2-ee32-46b0-b69f-ec8278f4dc12	416bde78-1dae-48ac-abcf-05ddf1301838	f5cfddbe-147d-4bb1-976b-824de49ea6fd	MAG COLOR NARANJA 5ML	F00427	Micropigmentacion - Pigmentos	0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	99000.00	5	f		2025-08-01 20:37:16.498+00	2025-08-01 20:37:16.498+00
1c84785f-fa23-4d92-af80-f0953ec60221	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR LIPS PINK 5ML 	F00599		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.505+00	2025-08-01 20:37:16.505+00
bea8078e-fb91-4db7-80b2-9786f8a4899e	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG GOLD BROW ESCURISSIMO 5ML	F00595		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.51+00	2025-08-01 20:37:16.51+00
2e3d0f14-b942-4dff-93bb-92ba5f59a874	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLORORGANIC MEDIUM SIENNA 5 ML 	F00593		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.516+00	2025-08-01 20:37:16.516+00
cab88210-8783-4f09-9624-e8dc184957d3	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR ORGANIC LIGTH HAZEL 5 ML	F00596		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.522+00	2025-08-01 20:37:16.522+00
1ed6b901-87f2-490b-95c1-18e8e42588cb	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR ORGANIC DARK RAVEN 5ML	F00594		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.527+00	2025-08-01 20:37:16.527+00
f192b24d-265b-4164-be0a-797020ea8f6a	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR ORGANIC BLEND	F00604		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.532+00	2025-08-01 20:37:16.532+00
ead89290-4911-46aa-965a-da94d5f2c5a7	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR VERDE OLIVA 5 ML	F00592		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.538+00	2025-08-01 20:37:16.538+00
8f381eb8-173b-4d6f-97a1-0b7c82209bbf	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR 5ML CERAMICA 	F00600		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.543+00	2025-08-01 20:37:16.543+00
03cea2da-a25c-4ad8-b6cf-b96abccd2dc7	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR DILUENTE 10 ML 	F00602		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	35000.00	35000.00	55000.00	\N	5	t		2025-08-01 20:37:16.548+00	2025-08-01 20:37:16.548+00
27447ad0-49cf-4bb0-a263-d1b5872f5dbc	416bde78-1dae-48ac-abcf-05ddf1301838	\N	MAG COLOR ORGANIC BLACK DEEP 5ML	F00601		0f6dde1f-a4c5-43b3-854a-5e49e833c4da	1	0	70000.00	70000.00	110000.00	\N	5	t		2025-08-01 20:37:16.554+00	2025-08-01 20:37:16.554+00
66290667-df8e-474b-967a-806e8b800b20	416bde78-1dae-48ac-abcf-05ddf1301838	f1793ee4-921b-4d3a-b30f-604ef147568e	ANILLO SILICONA X 100	F00275	Micropigmentacion - Anillos-Micropigmentacion	82cc227d-8d5e-44a6-976b-6cc94c8945cf	1	0	3700.00	3700.00	10000.00	9000.00	6	f		2025-08-01 20:37:16.559+00	2025-08-01 20:37:16.559+00
d58459ab-d9d1-406d-ba9b-3849655c2d95	416bde78-1dae-48ac-abcf-05ddf1301838	f4fc19c8-056e-4449-808b-15fa74bd4e73	MANTEQUILLA HIDRATANTE X 20GR CEREZA	F00255	Micropigmentacion - Hidratacion-Micropigmentacion	80fbe3d4-73e6-4322-89aa-538b0940a416	1	0	3800.00	3800.00	11000.00	9900.00	5	f		2025-08-01 20:37:16.565+00	2025-08-01 20:37:16.565+00
05dd2e43-9a81-4fc0-a4e4-7c9b1085d97f	416bde78-1dae-48ac-abcf-05ddf1301838	b8c26691-e048-4bbe-9e40-73057ae78732	COBERTOR PLASTICO DERMOGRAFO NEGRO	F00414	Accesorios - Bioseguridad	1dababba-299d-43ab-9d36-1bb00ee07229	1	0	16000.00	16000.00	25000.00	22500.00	5	f		2025-08-01 20:37:16.57+00	2025-08-01 20:37:16.57+00
543c40fb-e2e2-4220-80c0-e20bf7c91b39	416bde78-1dae-48ac-abcf-05ddf1301838	ec6794ee-09ed-43a6-938a-18360de055f7	COBAN 	F00264	Micropigmentacion - Accesorios-Micropigmentacion	de7923ed-199b-49a7-acbc-7d5c95602030	1	0	2000.00	2000.00	6500.00	5850.00	30	f		2025-08-01 20:37:16.576+00	2025-08-01 20:37:16.576+00
3969547f-8aa6-4266-8851-da0e3b7962f3	416bde78-1dae-48ac-abcf-05ddf1301838	\N	LAPIZ DERMATOGRAFICO BP NEGRO 	F00605		f913302c-298a-4f30-ab76-b0365d06ce56	1	0	10000.00	10000.00	15000.00	\N	5	t		2025-08-01 20:37:16.582+00	2025-08-01 20:37:16.582+00
c83904d5-39d1-430a-9f7b-0a041da8c18c	416bde78-1dae-48ac-abcf-05ddf1301838	34fda482-7f91-475a-a418-592274158b40	ANESTESIA NUMB 90%	F00552	Súper numb 90%\r\n \r\n\r\nComponentes :\r\n\r\nAgua,Lidocaine,Prilocaína,Epinefrina,Alcoholbencílico,Carbomero,lecitinaSoja,Propileno glico Acetato de toceferil, indicada para pieles abiertas y cerradas , para todos los procedimientos de micropigmentacion ,microblading ,remoción, depilación permanente ,cera, tattoo. modo de uso se debe aplicar en piel cerrada de 25 a 30 minutos y en piel abierta de 5 a 10 minutos. 	3c196b55-5493-4ad3-a326-caf63389974b	1	0	25000.00	25000.00	42000.00	37800.00	2	f		2025-08-01 20:37:16.588+00	2025-08-01 20:37:16.588+00
4f6d4c7c-cc8c-45b9-b335-f713c02abe8f	416bde78-1dae-48ac-abcf-05ddf1301838	aa52e2ae-5f83-45e7-bc39-afebfe263d7a	ANESTESIA BP SUPER NUMB EN GEL 90% 30ML	F00588	Super numb en gel al 90%\r\n \r\n\r\nSuper Numb en gel al 90% es una anestecia diseñada para brindar mayor comodidad durante procedimientos en piel abierta. Su fórmula avanzada es ideal para micropigmentación, microblading, remoción, depilación permanente, cera y tatuajes.\r\n\r\nGracias a su composición cuidadosamente seleccionada, proporciona una sensación de alivio y confort en la zona aplicada, facilitando el trabajo del profesional y mejorando la experiencia del cliente.\r\n\r\nIngredientes principales:\r\n\r\nLidocaína y Prilocaína: Contribuyen a minimizar la sensibilidad de la piel.\r\nEpinefrina: Ayuda a reducir el enrojecimiento y la inflamación.\r\nAlcohol bencílico y Propilenglicol: Favorecen la absorción del producto.\r\nCarbómero: Aporta la textura en gel para una aplicación uniforme.\r\nLecitina de soja y Acetato de tocoferilo (Vitamina E): Contribuyen a la hidratación y protección de la piel.\r\nModo de uso:\r\nAplicar una fina capa sobre la piel abierta y dejar actuar entre 2 y 7 minutos. Luego, retirar el exceso y continuar con el procedimiento.\r\n\r\nEste producto ha sido desarrollado para acompañar a los profesionales en cada sesión, ofreciendo una experiencia más cómoda y efectiva.	3c196b55-5493-4ad3-a326-caf63389974b	1	0	80000.00	80000.00	110000.00	\N	5	f		2025-08-01 20:37:16.593+00	2025-08-01 20:37:16.593+00
63b5d1a5-e4ba-4e13-8d7d-6028105d5feb	416bde78-1dae-48ac-abcf-05ddf1301838	7e9d2ff8-d14d-4821-9a97-a38d1040691b	AGUJA MAST OCEAN 0.30	F00503	Micropigmentacion - Agujas-Micropigmentacion	e9f1935a-78f9-4973-9715-6422f94cc3bf	20	0	3400.00	68000.00	7000.00	6300.00	50	f		2025-08-01 20:37:16.598+00	2025-08-01 20:37:16.598+00
3a8ca9bc-0013-4ca1-9a63-9ea18f7728bd	416bde78-1dae-48ac-abcf-05ddf1301838	\N	DESHIDRATADOR DE PIEL	F00600		80fbe3d4-73e6-4322-89aa-538b0940a416	1	0	50000.00	50000.00	70000.00	\N	5	t		2025-08-01 20:37:16.604+00	2025-08-01 20:37:16.604+00
e793d24a-a815-4808-8477-6c4101d12bcb	416bde78-1dae-48ac-abcf-05ddf1301838	bf2e7fab-4cb5-4c2d-91e8-e8aabbbc2544	VITAMINA YODI E+B3	F00240	Micropigmentacion - Hidratacion-Micropigmentacion	80fbe3d4-73e6-4322-89aa-538b0940a416	30	0	1500.00	45000.00	2200.00	1980.00	100	f		2025-08-01 20:37:16.609+00	2025-08-01 20:37:16.609+00
b5df42ad-e7a6-4245-b357-17c731d61ca3	416bde78-1dae-48ac-abcf-05ddf1301838	\N	TAPABOCAS ACRILICO 	F00607		1dababba-299d-43ab-9d36-1bb00ee07229	1	0	3600.00	3600.00	5500.00	\N	5	t		2025-08-01 20:37:16.616+00	2025-08-01 20:37:16.616+00
74410b7c-0a18-4112-b0c6-5c06474b6c28	416bde78-1dae-48ac-abcf-05ddf1301838	93e1582b-f179-47b8-a480-a57ac1d6c9c1	APLICADORES X50	F00286	Accesorios - Accesorios-varios	56ce58c6-380f-4fa9-8500-b2b302dc92a0	1	0	3700.00	3700.00	9000.00	9000.00	100	f		2025-08-01 20:37:16.621+00	2025-08-01 20:37:16.621+00
c3381f6c-891a-407b-8fa2-f22a4122af5e	416bde78-1dae-48ac-abcf-05ddf1301838	b593f298-36c1-4ebf-b4e2-7ddb06dd09d7	MICROBRUSH X 100 	F00284	Accesorios - Accesorios-varios	56ce58c6-380f-4fa9-8500-b2b302dc92a0	1	0	2900.00	2900.00	8000.00	7200.00	12	f		2025-08-01 20:37:16.626+00	2025-08-01 20:37:16.626+00
9e61877b-2680-439f-8881-eb59854ef5c9	416bde78-1dae-48ac-abcf-05ddf1301838	2cecd7dc-265b-45d1-9965-e57bf8955c7e	SOPORTE DERMOGRAFO	F00387	Micropigmentacion - Accesorios-Micropigmentacion	de7923ed-199b-49a7-acbc-7d5c95602030	1	0	3500.00	3500.00	15000.00	13500.00	3	f		2025-08-01 20:37:16.632+00	2025-08-01 20:37:16.632+00
9915cfc9-4090-4fe3-a370-82eb58be226b	416bde78-1dae-48ac-abcf-05ddf1301838	7b1858f8-0dd3-4e5d-ae3a-e7bf94ae10ea	CEPILLOS X 50 UND	F00287	Una gran manera de mantener la máscara limpia, la cabeza de cepillo suave pero firme puede obtener cada pequeña pestaña.\nEl cabezal del cepillo es flexible, puedes obtener cualquier ángulo que desees.\nLa cabeza tipo tornillo es fácil de enrollar las pestañas y peinar las cejas que hacen que las raíces de las pestañas sean más claras y naturales.	56ce58c6-380f-4fa9-8500-b2b302dc92a0	1	0	3750.00	3750.00	8500.00	7650.00	50	f		2025-08-01 20:37:16.637+00	2025-08-01 20:37:16.637+00
\.


--
-- Data for Name: PurchaseOrders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseOrders" (id, "orderNumber", "proveedorId", "fechaCompra", "numeroFactura", subtotal, impuestos, descuentos, total, status, "metodoPago", "fechaVencimiento", "archivoComprobante", notas, "createdBy", "createdAt", "updatedAt", "paymentStatus", "totalPaid") FROM stdin;
b9af967e-ef2b-4d67-bafb-4e2e0533b1dc	PC2025070001	67ef9050-7a89-4851-8ea9-2ebad1184240	2025-07-24 00:00:00+00	3214	293760.00	0.00	0.00	293760.00	pendiente	Contado	\N	\N	Especialmente diseñado para depilacion de cejas	33213655	2025-07-24 21:07:35.812+00	2025-07-24 21:07:35.812+00	pendiente	0.00
d8356496-3906-4418-88ec-de330d13ddd2	PC2025070002	af5fd395-7b33-4084-bf36-84c9ef2c30de	2025-07-25 00:00:00+00	42514	1063000.00	0.00	0.00	1063000.00	pendiente	Contado	\N	\N		33213655	2025-07-26 18:30:30.028+00	2025-07-26 18:30:30.028+00	pendiente	0.00
090b62de-fb96-4626-a5cc-62821629e9ed	PC2025070003	cacc403d-e252-4462-bafa-cf3e3bc86f7e	2025-07-25 00:00:00+00	700164560421	982400.00	0.00	0.00	982400.00	pendiente	Contado	\N	\N	ENVIO POR $22.400	33213655	2025-07-26 18:41:43.937+00	2025-07-26 18:41:43.937+00	pendiente	0.00
062c4db3-5fec-40e1-b3c6-249763e9419f	PC2025080001	98468592-d2b6-4ead-b27c-61e86921be6d	2025-08-01 00:00:00+00		176000.00	0.00	0.00	176000.00	pendiente	Contado	\N	\N		33213655	2025-08-01 16:43:59.364+00	2025-08-01 16:43:59.364+00	pendiente	0.00
135b8814-ddb7-4346-a346-507648836837	PC2025080002	98468592-d2b6-4ead-b27c-61e86921be6d	2025-08-01 00:00:00+00		80000.00	0.00	0.00	80000.00	pendiente	Contado	\N	\N		33213655	2025-08-01 16:46:12.668+00	2025-08-01 16:46:12.668+00	pendiente	0.00
416bde78-1dae-48ac-abcf-05ddf1301838	PC2025080003	af5fd395-7b33-4084-bf36-84c9ef2c30de	2025-08-01 00:00:00+00	118062	1426950.00	0.00	0.00	1426950.00	pendiente	15 días	\N	\N		33213655	2025-08-01 20:37:16.459+00	2025-08-01 20:37:16.459+00	pendiente	0.00
\.


--
-- Data for Name: StockMovements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StockMovements" (id, "productId", quantity, type, reason, "previousStock", "currentStock", "userId", "orderId", "purchaseOrderId", notes, "createdAt", "updatedAt") FROM stdin;
daa36577-a7f4-43ff-8c2a-e05380839639	aa52e2ae-5f83-45e7-bc39-afebfe263d7a	2	entrada	Stock inicial - Compra PC2025070002	0	2	33213655	\N	d8356496-3906-4418-88ec-de330d13ddd2	Producto creado desde compra. Factura: 42514	2025-07-26 18:31:00.714+00	2025-07-26 18:31:00.714+00
1796a976-279c-4e11-a84e-6336b74fb282	97611be8-a91d-4e2d-b529-13f45372278a	10	entrada	Compra PC2025070002 - BEAUTY PLUS	5	15	33213655	\N	d8356496-3906-4418-88ec-de330d13ddd2	Factura: 42514	2025-07-26 18:31:00.739+00	2025-07-26 18:31:00.739+00
cc6df688-fdd5-4932-880c-151a5d69d60c	31af6da7-c8bb-46bd-ac35-e57758196aa9	30	entrada	Compra PC2025070002 - BEAUTY PLUS	28	58	33213655	\N	d8356496-3906-4418-88ec-de330d13ddd2	Factura: 42514	2025-07-26 18:31:00.761+00	2025-07-26 18:31:00.761+00
2fdbdbf0-c990-401a-8b2a-2f51df2307cf	9698a4fb-911f-4b59-a90a-29a44d092405	10	entrada	Compra PC2025070002 - BEAUTY PLUS	14	24	33213655	\N	d8356496-3906-4418-88ec-de330d13ddd2	Factura: 42514	2025-07-26 18:31:00.781+00	2025-07-26 18:31:00.781+00
95b709fa-f675-4337-bf1c-4860c9656274	a386a97b-15b8-4e91-bc5b-c97f71aaeda4	1	entrada	Stock inicial - Compra PC2025070002	0	1	33213655	\N	d8356496-3906-4418-88ec-de330d13ddd2	Producto creado desde compra. Factura: 42514	2025-07-26 18:31:00.803+00	2025-07-26 18:31:00.803+00
67646d29-e422-4357-b8db-1981fd71279b	34fda482-7f91-475a-a418-592274158b40	4	entrada	Compra PC2025070002 - BEAUTY PLUS	2	6	33213655	\N	d8356496-3906-4418-88ec-de330d13ddd2	Factura: 42514	2025-07-26 18:31:00.827+00	2025-07-26 18:31:00.827+00
af0ff6e4-10e4-4b80-9c40-d5e493f8b315	8c532e6d-8b06-4953-824a-807f76ee6009	2	entrada	Compra PC2025070002 - BEAUTY PLUS	2	4	33213655	\N	d8356496-3906-4418-88ec-de330d13ddd2	Factura: 42514	2025-07-26 18:31:00.85+00	2025-07-26 18:31:00.85+00
96a8036c-0668-4e3b-baf3-aec8a41a4f92	52f0e98f-0d96-4fa6-bb56-e74241170a7d	5	entrada	Se compraron 5	2	7	33213655	\N	\N		2025-07-26 19:00:36.33+00	2025-07-26 19:00:36.33+00
40d3118a-b535-4d9b-b5d2-e91d259b5185	38bdab43-9946-4431-b1f1-d65513901468	25	entrada	Compra PC2025070003 - RUTH MILEY RAMOS RIVAS	13	38	33213655	\N	090b62de-fb96-4626-a5cc-62821629e9ed	Factura: 700164560421	2025-07-28 17:58:17.109+00	2025-07-28 17:58:17.109+00
e8562739-fb4c-4407-8db9-8266dd109a82	75eae7ee-09fe-4d03-9b26-f0ffa7a39cd3	15	entrada	Compra PC2025070003 - RUTH MILEY RAMOS RIVAS	4	19	33213655	\N	090b62de-fb96-4626-a5cc-62821629e9ed	Factura: 700164560421	2025-07-28 17:58:17.138+00	2025-07-28 17:58:17.138+00
795337cd-2b46-44e5-92d9-a61d165296f7	621d294a-b1fd-40db-bc78-ee5b81ce5cc6	1	entrada	Ajuste lista de Laura	0	1	33213655	\N	\N		2025-07-31 21:43:32.43+00	2025-07-31 21:43:32.43+00
a1cc4a90-c13e-4557-8186-3758e8357144	6a14141f-3995-4da9-b8c9-533e079bceca	-1	salida	Venta orden 202508010001	16	15	33213655	31c808db-d534-4fac-b8c6-f66bcfa9f9cb	\N	\N	2025-08-01 16:21:21.951+00	2025-08-01 16:21:21.951+00
264e12af-17d3-45b0-a7e6-4b132689d6e0	21925050-d82b-48f2-8484-f98fcd2cc11f	-1	salida	Venta orden 202508010002	7	6	33213655	909cb2b7-2258-42ac-8957-94fbc494e708	\N	\N	2025-08-01 16:23:30.949+00	2025-08-01 16:23:30.949+00
6b76040e-6a69-404b-8630-5d9f5cef7f5e	58047015-1e4d-4bc9-afaf-5b7fbb110487	4	entrada	Compra PC2025080001 - DOLLARCITY	4	8	33213655	\N	062c4db3-5fec-40e1-b3c6-249763e9419f	Factura: N/A	2025-08-01 16:44:15.486+00	2025-08-01 16:44:15.486+00
0b48135c-de92-4b08-8689-58b44f488b73	245b036f-ea5c-4954-8552-47158166b502	2	entrada	Stock inicial - Compra PC2025080001	0	2	33213655	\N	062c4db3-5fec-40e1-b3c6-249763e9419f	Producto creado desde compra. Factura: N/A	2025-08-01 16:44:15.521+00	2025-08-01 16:44:15.521+00
a0240c47-b964-41a4-8d12-531a9c9f517b	56404365-729e-4ce7-8f6b-88943acea686	2	entrada	Compra PC2025080001 - DOLLARCITY	2	4	33213655	\N	062c4db3-5fec-40e1-b3c6-249763e9419f	Factura: N/A	2025-08-01 16:44:15.548+00	2025-08-01 16:44:15.548+00
596552b4-93cc-4b0c-90d6-b3602c4f5040	9118820e-cb5d-41ad-ae0e-2295c28b2fea	1	entrada	Stock inicial - Compra PC2025080001	0	1	33213655	\N	062c4db3-5fec-40e1-b3c6-249763e9419f	Producto creado desde compra. Factura: N/A	2025-08-01 16:44:15.576+00	2025-08-01 16:44:15.576+00
dcfbcc43-f7a5-4b73-8629-784cf072422a	5bf3c752-0343-4053-9dcc-19ae0df97616	2	entrada	Stock inicial - Compra PC2025080001	0	2	33213655	\N	062c4db3-5fec-40e1-b3c6-249763e9419f	Producto creado desde compra. Factura: N/A	2025-08-01 16:44:15.603+00	2025-08-01 16:44:15.603+00
24b22f4a-365e-4120-acf5-e3ec27112e40	f31a4de4-3507-4fa1-acb1-49337e3252d4	1	entrada	Compra PC2025080001 - DOLLARCITY	0	1	33213655	\N	062c4db3-5fec-40e1-b3c6-249763e9419f	Factura: N/A	2025-08-01 16:44:15.63+00	2025-08-01 16:44:15.63+00
0e5296b4-4793-467a-aef1-2e74edeba5bf	7bb7ecd4-b1d2-4146-95b3-44adcd5a9cb3	5	entrada	Compra PC2025080002 - DOLLARCITY	1	6	33213655	\N	135b8814-ddb7-4346-a346-507648836837	Factura: N/A	2025-08-01 16:46:23.964+00	2025-08-01 16:46:23.964+00
13cb5b35-6325-4dad-9163-d2bb136365e9	56404365-729e-4ce7-8f6b-88943acea686	-1	salida	Venta orden 202508010003	4	3	33213655	8849dc08-8b34-4bb1-8c0b-601c4a94b435	\N	\N	2025-08-01 17:03:28.296+00	2025-08-01 17:03:28.296+00
65c62dfe-6f3b-4565-9cf3-e6e95facd0a8	27d9d386-e9d2-497c-bab7-935e6567be01	-1	salida	Venta orden 202508010003	10	9	33213655	8849dc08-8b34-4bb1-8c0b-601c4a94b435	\N	\N	2025-08-01 17:03:28.316+00	2025-08-01 17:03:28.316+00
567ce5d9-422a-4ff8-82e8-2ba39260b13d	2d5aebcb-189e-4308-a68a-44017212be6b	-1	salida	Venta orden 202508010004	11	10	33213655	0f3d7d5f-8a07-47e7-93ef-00e3201a770a	\N	\N	2025-08-01 17:24:02.099+00	2025-08-01 17:24:02.099+00
588e02cc-eff8-449d-9b31-c3ccb98d518b	9698a4fb-911f-4b59-a90a-29a44d092405	-1	salida	Venta orden 202508010004	24	23	33213655	0f3d7d5f-8a07-47e7-93ef-00e3201a770a	\N	\N	2025-08-01 17:24:02.12+00	2025-08-01 17:24:02.12+00
a950154a-2809-41ca-bcc8-db48b35d3c9e	1a54b641-43ba-428d-a1b8-ff21f53bb2c5	-1	salida	Venta orden 202508010005	7	6	33213655	74ac437b-ac15-4822-a158-b6cf3db55f62	\N	\N	2025-08-01 17:55:06.344+00	2025-08-01 17:55:06.344+00
f3caeb36-befc-46ce-b5d7-1ed6a3034670	2d5aebcb-189e-4308-a68a-44017212be6b	-1	salida	Venta orden 202508010006	10	9	33213655	\N	\N	\N	2025-08-01 17:59:40.462+00	2025-08-01 17:59:40.462+00
4d16535e-7a59-41c0-94c7-1e1fb2d89c9c	9698a4fb-911f-4b59-a90a-29a44d092405	-1	salida	Venta orden 202508010006	23	22	33213655	\N	\N	\N	2025-08-01 17:59:40.478+00	2025-08-01 17:59:40.478+00
5d9c9ac1-c3f4-4753-a889-af57601d16b4	1dfb106b-025f-4248-a57b-1866119cd28d	-1	salida	Venta orden 202508010006	13	12	33213655	1986d292-bc7d-4c93-8675-e90c91b5a91c	\N	\N	2025-08-01 18:37:38.904+00	2025-08-01 18:37:38.904+00
b4f1b01e-2854-4ed4-9b8f-d3b136f704c7	59ed16d4-825d-4dc6-87c9-a4850d98dea1	-1	salida	Venta orden 202508010006	8	7	33213655	1986d292-bc7d-4c93-8675-e90c91b5a91c	\N	\N	2025-08-01 18:37:38.925+00	2025-08-01 18:37:38.925+00
0531766c-67e4-4797-9946-b66e44177d54	bde48ef3-dc46-4b05-8a2a-a01130d3ac68	-1	salida	Venta orden 202508010007	9	8	33213655	60acaeeb-29fa-4563-a6af-9f0ccb7b2e2b	\N	\N	2025-08-01 18:49:25.876+00	2025-08-01 18:49:25.876+00
239643cf-989e-403d-a9e1-fe7e9d3686d1	84a8256e-310a-4030-b87a-a0275471eaf4	-1	salida	Venta orden 202508010008	11	10	33213655	83b17af9-f865-4a50-b6bc-931fa14dc67b	\N	\N	2025-08-01 19:25:22.02+00	2025-08-01 19:25:22.02+00
ca89fdd5-ce22-4379-b489-598a9d89203c	27d9d386-e9d2-497c-bab7-935e6567be01	-1	salida	Venta orden 202508010009	9	8	33213655	f8abb318-4692-46a2-a696-a1fb27f64737	\N	\N	2025-08-01 19:27:57.215+00	2025-08-01 19:27:57.215+00
30f348e7-678c-4575-b7b9-d2af3a6395c7	feb35d47-beec-44e6-b94c-be843333326d	-1	salida	Venta orden 202508010009	8	7	33213655	f8abb318-4692-46a2-a696-a1fb27f64737	\N	\N	2025-08-01 19:27:57.234+00	2025-08-01 19:27:57.234+00
39bf0162-68ee-4f89-a674-0ece91abe61b	d953e957-6777-42da-b5d0-c2594232aa75	-1	salida	Venta orden 202508010010	6	5	33213655	d11c4bad-c841-4e73-8870-88ea3da0fd2a	\N	\N	2025-08-01 19:38:10.558+00	2025-08-01 19:38:10.558+00
c74692d7-4a9a-4820-b696-d3913073f2b8	58b45fe9-c75e-4b05-ac3e-7e2454782d80	-1	salida	Venta orden 202508010011	13	12	33213655	3c8c54a5-e0d2-49d4-b78e-0a9d93655ce8	\N	\N	2025-08-01 19:58:00.257+00	2025-08-01 19:58:00.257+00
00dcffc9-3558-4196-aff4-670de971107d	f6beb310-3d4b-4c08-806e-9a4df03ffa37	-1	salida	Venta orden 202508010012	4	3	33213655	038a8ae7-8554-48bd-b254-832b7a056f3e	\N	\N	2025-08-01 20:50:25.192+00	2025-08-01 20:50:25.192+00
4ee9f594-410e-45de-b3b1-371321c95b83	58db3b62-5f99-4039-bc9a-5a3cf2fd77f6	-1	salida	Venta orden 202508010012	3	2	33213655	038a8ae7-8554-48bd-b254-832b7a056f3e	\N	\N	2025-08-01 20:50:25.209+00	2025-08-01 20:50:25.209+00
ee2c1444-2fbe-44c1-98ea-6d69acaa5f56	d953e957-6777-42da-b5d0-c2594232aa75	-1	salida	Venta orden 202508010012	5	4	33213655	038a8ae7-8554-48bd-b254-832b7a056f3e	\N	\N	2025-08-01 20:50:25.227+00	2025-08-01 20:50:25.227+00
7a084e2b-3dea-4370-a70c-a62e8c354150	13afdf8c-9b35-4605-b8e6-c4dc26937b94	-1	salida	Venta orden 202508010012	17	16	33213655	038a8ae7-8554-48bd-b254-832b7a056f3e	\N	\N	2025-08-01 20:50:25.245+00	2025-08-01 20:50:25.245+00
fb780b32-88ae-4829-8caf-99b9f6067b5b	8fb65187-e07e-447b-9ad3-5201d075f52c	-1	salida	Venta orden 202508010012	28	27	33213655	038a8ae7-8554-48bd-b254-832b7a056f3e	\N	\N	2025-08-01 20:50:25.262+00	2025-08-01 20:50:25.262+00
0dbde90a-9d83-4c05-acf1-cd74d63dee07	4554a12b-364d-49bd-9f62-e0ebd5ae6459	-1	salida	Venta orden 202508010013	7	6	33213655	ebad5246-b40d-48ef-a35f-9c9843ea9520	\N	\N	2025-08-01 21:09:27.711+00	2025-08-01 21:09:27.711+00
260d4e10-2923-4d85-9594-9f47afc983a2	7b1858f8-0dd3-4e5d-ae3a-e7bf94ae10ea	-1	salida	Venta orden 202508010013	161	160	33213655	ebad5246-b40d-48ef-a35f-9c9843ea9520	\N	\N	2025-08-01 21:09:27.734+00	2025-08-01 21:09:27.734+00
d925d5d8-f607-487f-a73a-ce6c5562ad5b	b6f35145-4fba-4461-ae09-047fd2ec5c89	-12	salida	Venta orden 202508010013	2912	2900	33213655	ebad5246-b40d-48ef-a35f-9c9843ea9520	\N	\N	2025-08-01 21:09:27.753+00	2025-08-01 21:09:27.753+00
086ef3cc-a911-4be9-9c2a-3cc24124e65d	082c4bf3-a10a-4471-9680-0c34826e079a	-1	salida	Venta orden 202508010013	13	12	33213655	ebad5246-b40d-48ef-a35f-9c9843ea9520	\N	\N	2025-08-01 21:09:27.773+00	2025-08-01 21:09:27.773+00
2688b271-cdab-486e-b3d5-c3721a1aae57	12bc46fe-77dc-4d29-a5ad-ea3c551048e8	-1	salida	Venta orden 202508010013	27	26	33213655	ebad5246-b40d-48ef-a35f-9c9843ea9520	\N	\N	2025-08-01 21:09:27.79+00	2025-08-01 21:09:27.79+00
ef4a72a9-d2cb-46f0-9025-8639b6645d06	536ee397-8092-43d2-a16e-e872f6869ab5	-1	salida	Venta orden 202508010014	6	5	33213655	c03c8111-4ec4-458b-9ef2-74f9eebbf891	\N	\N	2025-08-01 21:14:48.732+00	2025-08-01 21:14:48.732+00
81efa918-fe0d-43a3-a80d-359b363a0aa9	f61fc097-0444-40a1-a761-047e30dcc753	-2	salida	Venta orden 202508010014	16	14	33213655	c03c8111-4ec4-458b-9ef2-74f9eebbf891	\N	\N	2025-08-01 21:14:48.751+00	2025-08-01 21:14:48.751+00
9550e520-74b9-44a7-9ab2-def1850fc952	37536919-a91f-4b76-9df1-1554758f4e32	-1	salida	Venta orden 202508020001	4	3	33213655	fb969e5b-3abd-4bf4-a486-9cdddcf3eb18	\N	\N	2025-08-02 14:30:37.471+00	2025-08-02 14:30:37.471+00
2488c2d7-7a2a-4236-b8df-646eb73526b5	1b93bf5c-948e-4290-8bc2-5d6af8cfdc06	-1	salida	Venta orden 202508020003	3	2	33213655	10fc20bf-8ce6-46f2-bb1a-2477d82c806a	\N	\N	2025-08-02 15:04:05.623+00	2025-08-02 15:04:05.623+00
0848042c-e682-4d9e-98e5-b21f3850d287	b85903db-c7f1-4531-a6f4-30ff14927a61	-1	salida	Venta orden 202508010014	10	9	33213655	c03c8111-4ec4-458b-9ef2-74f9eebbf891	\N	\N	2025-08-01 21:14:48.767+00	2025-08-01 21:14:48.767+00
4678e543-183e-4ba2-ab9b-b80496ea9805	63cc5329-2b4b-4027-8cf8-bc4085c16cb4	-1	salida	Venta orden 202508010014	11	10	33213655	c03c8111-4ec4-458b-9ef2-74f9eebbf891	\N	\N	2025-08-01 21:14:48.786+00	2025-08-01 21:14:48.786+00
b92a4968-c878-4c20-8c09-707a983c693a	e6a1af40-6b3e-478d-beda-7f950cce4dda	-2	salida	Venta orden 202508010014	25	23	33213655	c03c8111-4ec4-458b-9ef2-74f9eebbf891	\N	\N	2025-08-01 21:14:48.803+00	2025-08-01 21:14:48.803+00
36a394d2-e1e0-401d-9586-c885b6313101	d15f51ba-7e47-42ba-a3f9-3971ffb760a9	-1	salida	Venta orden 202508010015	9	8	33213655	9f9e1622-ac87-4c51-947b-b262196df05b	\N	\N	2025-08-01 21:36:15.728+00	2025-08-01 21:36:15.728+00
720ef0b1-d3b9-47cd-a2c0-9038d4710037	cd8ca6cb-d6d2-45cf-8b6b-f6002d53b0ff	-1	salida	Venta orden 202508010016	10	9	33213655	81d140ff-85a8-4dba-92e6-94e94b581a20	\N	\N	2025-08-01 21:57:43.051+00	2025-08-01 21:57:43.051+00
b9b070d5-97d0-466b-8bc8-7cd09aa1b597	25b28307-044c-4431-b78b-5bac35dee657	-10	salida	Venta orden 202508020002	279	269	33213655	95448dfa-2c96-4bbf-9ba6-d8800d87cf11	\N	\N	2025-08-02 14:43:15.069+00	2025-08-02 14:43:15.069+00
58b6f759-5ce5-4cb3-a042-7117d205295c	e3d506fb-0bde-4e48-a172-32b6ef337062	-1	salida	Venta orden 202508020003	201	200	33213655	10fc20bf-8ce6-46f2-bb1a-2477d82c806a	\N	\N	2025-08-02 15:04:05.641+00	2025-08-02 15:04:05.641+00
987100e4-8dda-478c-8d47-3d526ba86661	a5f04e2c-5ac8-49d4-ae4c-db4e866260e4	-1	salida	Venta orden 202508020003	51	50	33213655	10fc20bf-8ce6-46f2-bb1a-2477d82c806a	\N	\N	2025-08-02 15:04:05.659+00	2025-08-02 15:04:05.659+00
9211d5e7-5cba-454f-b3ef-5b3fb81e8877	d15f51ba-7e47-42ba-a3f9-3971ffb760a9	-1	salida	Venta orden 202508020004	8	7	33213655	d1384c1e-6aa7-47aa-9e1b-60fdd6498af5	\N	\N	2025-08-02 15:21:34.789+00	2025-08-02 15:21:34.789+00
cdd9ce70-df57-4ace-a2bb-71c88460e365	6d4b2822-e334-41a8-aa1f-48eea162972f	-1	salida	Venta orden 202508020004	32	31	33213655	d1384c1e-6aa7-47aa-9e1b-60fdd6498af5	\N	\N	2025-08-02 15:21:34.807+00	2025-08-02 15:21:34.807+00
70cdeb0a-fc05-480d-b986-e73c7846d352	b6f35145-4fba-4461-ae09-047fd2ec5c89	-10	salida	Venta orden 202508020004	2900	2890	33213655	d1384c1e-6aa7-47aa-9e1b-60fdd6498af5	\N	\N	2025-08-02 15:21:34.822+00	2025-08-02 15:21:34.822+00
046bb13a-ae55-4f33-b13b-a9b04de73d07	64613f12-7047-4519-8b75-1ba0ae2b092f	-1	salida	Venta orden 202508020005	6	5	33213655	984d6cbf-55f4-4fd2-8fd7-abfe3bdb5c1b	\N	\N	2025-08-02 15:26:13.656+00	2025-08-02 15:26:13.656+00
782c8309-afee-40b5-8609-55927acbbd22	74af35f2-0f29-46ed-ba04-814cd7ccd9c9	-1	salida	Venta orden 202508020006	2	1	33213655	aa76049d-ab83-40d9-85fa-c60f40729bd9	\N	\N	2025-08-02 17:08:40.98+00	2025-08-02 17:08:40.98+00
f4f6a012-86b4-49d9-9795-53b5131f14ca	b0af2ebc-ffe3-4bd4-a330-7002c35e9933	-1	salida	Venta orden 202508020006	3	2	33213655	aa76049d-ab83-40d9-85fa-c60f40729bd9	\N	\N	2025-08-02 17:08:40.997+00	2025-08-02 17:08:40.997+00
fed40a4f-c880-402c-9d99-6288c268e18d	9049399f-80fd-4970-8fba-54b0daf0846d	-1	salida	Venta orden 202508020007	19	18	33213655	8db1ad14-0cff-4132-af8c-284b30954f1f	\N	\N	2025-08-02 17:12:42.084+00	2025-08-02 17:12:42.084+00
c742de99-85a2-4c9e-895d-848df77dff9b	59ed16d4-825d-4dc6-87c9-a4850d98dea1	-1	salida	Venta orden 202508020007	7	6	33213655	8db1ad14-0cff-4132-af8c-284b30954f1f	\N	\N	2025-08-02 17:12:42.101+00	2025-08-02 17:12:42.101+00
2a66135f-7a28-4fd3-92a9-e60278e031a3	230d606e-db95-4432-baaf-29e66a2aa66a	-1	salida	Venta orden 202508020007	4	3	33213655	8db1ad14-0cff-4132-af8c-284b30954f1f	\N	\N	2025-08-02 17:12:42.117+00	2025-08-02 17:12:42.117+00
1617f140-8191-4931-8f46-122daa246228	d3c395d8-2b2c-4f8d-8658-a1a0edccdd7c	-1	salida	Venta orden 202508020007	8	7	33213655	8db1ad14-0cff-4132-af8c-284b30954f1f	\N	\N	2025-08-02 17:12:42.134+00	2025-08-02 17:12:42.134+00
1aa8c26c-e255-4e22-982e-8b0b57fad945	59ed16d4-825d-4dc6-87c9-a4850d98dea1	-1	salida	Venta orden 202508020008	6	5	33213655	8a50c03a-616e-4f4f-ae88-030efbd7c38e	\N	\N	2025-08-02 17:13:43.924+00	2025-08-02 17:13:43.924+00
af4b0b7f-ccee-474c-8f70-57905d703446	4c875746-6bad-4f34-8b2d-1002db8bea82	-1	salida	Venta orden 202508020008	9	8	33213655	8a50c03a-616e-4f4f-ae88-030efbd7c38e	\N	\N	2025-08-02 17:13:43.942+00	2025-08-02 17:13:43.942+00
ed1a478b-23b7-4e37-bf67-d4227d5f247e	25b28307-044c-4431-b78b-5bac35dee657	-4	salida	Venta orden 202508020009	269	265	33213655	02ea92b4-8e56-4098-85e9-e49547d62d2c	\N	\N	2025-08-02 17:15:54.593+00	2025-08-02 17:15:54.593+00
a5adbee9-cb34-4c9e-8040-91ab0e20274d	14ef87b3-54ce-4a34-82b0-c0e531080237	-1	salida	Venta orden 202508020010	20	19	33213655	84385c13-0609-48ea-8d5b-de40f792ee09	\N	\N	2025-08-02 17:24:22.517+00	2025-08-02 17:24:22.517+00
c8ebd191-9fdd-421d-8288-41cf0180f576	ecd2257c-7fe6-4c86-8385-bf6b03360ac1	-1	salida	Venta orden 202508020010	22	21	33213655	84385c13-0609-48ea-8d5b-de40f792ee09	\N	\N	2025-08-02 17:24:22.532+00	2025-08-02 17:24:22.532+00
1fbaac8b-ea11-4792-9967-39ed45ffe179	4ae77f56-eaa2-4bd6-9485-82f3428ae87e	-1	salida	Venta orden 202508020011	36	35	33213655	fa6bfabb-897b-4b8b-9146-b3936326fb40	\N	\N	2025-08-02 18:04:52.933+00	2025-08-02 18:04:52.933+00
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (n_document, wdoctype, first_name, last_name, email, password, phone, city, role, "isActive", wlegalorganizationtype, scostumername, stributaryidentificationkey, sfiscalresponsibilities, sfiscalregime, "deletedAt", "createdAt", "updatedAt") FROM stdin;
GENERIC_001	\N	Cliente	Local	cliente@pos.local	$2b$10$PT4Q0Iq9JgGgE5Qjayx7xeEIampR9C67p72kn8njq3ZcN6C4S5Y/e	\N	\N	Customer	t	person	\N	O-1	R-99-PN	48	\N	2025-07-22 19:55:23.184+00	2025-07-22 19:55:23.185+00
33213655	\N	Diana	Owner	Owner@Owner.com	$2b$10$4nHYhCdjtXnhENoP8kPK.OXxMpWwICrNoUcymnSPcnXbxCtHTu2uK	225512387	Perez	Owner	t	person	\N	O-1	R-99-PN	48	\N	2025-07-22 19:58:34.03+00	2025-07-22 19:58:34.031+00
1098151432	CC	Laura	Vargas Gil	laura0194vargas@gmail.com	$2b$10$tfiyUPUxY0.yh6WR9Jeq5e45yVOX7G31/gsmdyVRwzER/uhHCou4e	3502142355	VILLAVICENCIO	Customer	t	person		O-1	R-99-PN	48	\N	2025-07-31 20:12:21.629+00	2025-07-31 20:12:21.629+00
1122923481	CC	Sofia	Montenegro	derlysofiamachado@gmail.com	$2b$10$eg1hlzW.8KZtaeopnX3YIuDfBT.ilAt8Koe3Z0jbWyyHl4Ke5W2I2	3506694633	Villavicencio	Customer	t	person		O-1	R-99-PN	48	\N	2025-08-01 17:02:26.651+00	2025-08-01 17:02:26.651+00
1122647296	CC	Gabriel	Roldán León	gabrielroldan070@gmail.com	$2b$10$cooS/NEM//ulByRoakzlT.yUIhzoN7P5tTyBJ8n5icmtEq.FDBhs6	3247624019	Villavicencio	Owner	t	person		O-1	R-99-PN	48	\N	2025-08-01 17:43:19.573+00	2025-08-01 17:43:19.575+00
1193525541	CC	Yulieth	Ramirez	Ryulieth868@gmail.com	$2b$10$feUbCFXgAD781SfDh9xDEuWyzdG9aa3WQye8wdUKFKwiuvrvhfFWW	3137990313	Villavicencio	Customer	t	person		O-1	R-99-PN	48	\N	2025-08-01 18:41:53.601+00	2025-08-01 18:41:53.601+00
1122511173	CC	Gissel	Baquero	gisselbaquero2005@gmail.com	$2b$10$v.Oh.bAHsFm6GQo6x09Jk.Ezu7XT9HtRk1G4Do8WDs4U91ttnKMFO	3123335168	Villavicencio	Customer	t	person		O-1	R-99-PN	48	\N	2025-08-01 18:48:54.952+00	2025-08-01 18:48:54.952+00
\.


--
-- Data for Name: credit_payment_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_payment_records (id, "paymentId", amount, "paymentMethod", notes, "recordedBy", "recordedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: purchase_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_payments (id, "purchaseOrderId", amount, "paymentMethod", "paymentDate", reference, notes, "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: Catalogos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Catalogos_id_seq"', 1, false);


--
-- Name: Compras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Compras_id_seq"', 1, false);


--
-- Name: Catalogos Catalogos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Catalogos"
    ADD CONSTRAINT "Catalogos_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key" UNIQUE (name);


--
-- Name: Categories Categories_name_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key1" UNIQUE (name);


--
-- Name: Categories Categories_name_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key10" UNIQUE (name);


--
-- Name: Categories Categories_name_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key2" UNIQUE (name);


--
-- Name: Categories Categories_name_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key3" UNIQUE (name);


--
-- Name: Categories Categories_name_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key4" UNIQUE (name);


--
-- Name: Categories Categories_name_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key5" UNIQUE (name);


--
-- Name: Categories Categories_name_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key6" UNIQUE (name);


--
-- Name: Categories Categories_name_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key7" UNIQUE (name);


--
-- Name: Categories Categories_name_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key8" UNIQUE (name);


--
-- Name: Categories Categories_name_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_name_key9" UNIQUE (name);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Compras Compras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Compras"
    ADD CONSTRAINT "Compras_pkey" PRIMARY KEY (id);


--
-- Name: Cotizacions Cotizacions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cotizacions"
    ADD CONSTRAINT "Cotizacions_pkey" PRIMARY KEY (id);


--
-- Name: DetalleCotizacions DetalleCotizacions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleCotizacions"
    ADD CONSTRAINT "DetalleCotizacions_pkey" PRIMARY KEY (id);


--
-- Name: DiscountRules DiscountRules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DiscountRules"
    ADD CONSTRAINT "DiscountRules_pkey" PRIMARY KEY (id);


--
-- Name: Distributors Distributors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Distributors"
    ADD CONSTRAINT "Distributors_pkey" PRIMARY KEY (id);


--
-- Name: Expenses Expenses_expenseNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenses"
    ADD CONSTRAINT "Expenses_expenseNumber_key" UNIQUE ("expenseNumber");


--
-- Name: Expenses Expenses_expenseNumber_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenses"
    ADD CONSTRAINT "Expenses_expenseNumber_key1" UNIQUE ("expenseNumber");


--
-- Name: Expenses Expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenses"
    ADD CONSTRAINT "Expenses_pkey" PRIMARY KEY (id);


--
-- Name: OrderItems OrderItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY (id);


--
-- Name: Orders Orders_orderNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key1" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key2" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key3" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key4" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key5" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key6" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key7" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key8" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_orderNumber_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_orderNumber_key9" UNIQUE ("orderNumber");


--
-- Name: Orders Orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);


--
-- Name: Payments Payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_pkey" PRIMARY KEY (id);


--
-- Name: Products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (id);


--
-- Name: Products Products_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key" UNIQUE (sku);


--
-- Name: Products Products_sku_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key1" UNIQUE (sku);


--
-- Name: Products Products_sku_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key2" UNIQUE (sku);


--
-- Name: Products Products_sku_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key3" UNIQUE (sku);


--
-- Name: Products Products_sku_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key4" UNIQUE (sku);


--
-- Name: Products Products_sku_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key5" UNIQUE (sku);


--
-- Name: Products Products_sku_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key6" UNIQUE (sku);


--
-- Name: Products Products_sku_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key7" UNIQUE (sku);


--
-- Name: Products Products_sku_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key8" UNIQUE (sku);


--
-- Name: Products Products_sku_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sku_key9" UNIQUE (sku);


--
-- Name: Proveedors Proveedors_nit_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key1" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key2" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key3" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key4" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key5" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key6" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key7" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key8" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_nit_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_nit_key9" UNIQUE (nit);


--
-- Name: Proveedors Proveedors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Proveedors"
    ADD CONSTRAINT "Proveedors_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrderItems PurchaseOrderItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItems"
    ADD CONSTRAINT "PurchaseOrderItems_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key1" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key2" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key3" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key4" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key5" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key6" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key7" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key8" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_orderNumber_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_orderNumber_key9" UNIQUE ("orderNumber");


--
-- Name: PurchaseOrders PurchaseOrders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_pkey" PRIMARY KEY (id);


--
-- Name: StockMovements StockMovements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovements"
    ADD CONSTRAINT "StockMovements_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key9" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (n_document);


--
-- Name: credit_payment_records credit_payment_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_payment_records
    ADD CONSTRAINT credit_payment_records_pkey PRIMARY KEY (id);


--
-- Name: purchase_payments purchase_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_payments
    ADD CONSTRAINT purchase_payments_pkey PRIMARY KEY (id);


--
-- Name: Categories Categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Cotizacions Cotizacions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cotizacions"
    ADD CONSTRAINT "Cotizacions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(n_document);


--
-- Name: DetalleCotizacions DetalleCotizacions_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleCotizacions"
    ADD CONSTRAINT "DetalleCotizacions_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id);


--
-- Name: DetalleCotizacions DetalleCotizacions_quoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleCotizacions"
    ADD CONSTRAINT "DetalleCotizacions_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES public."Cotizacions"(id);


--
-- Name: DiscountRules DiscountRules_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DiscountRules"
    ADD CONSTRAINT "DiscountRules_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DiscountRules DiscountRules_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DiscountRules"
    ADD CONSTRAINT "DiscountRules_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Distributors Distributors_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Distributors"
    ADD CONSTRAINT "Distributors_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(n_document) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Expenses Expenses_approvedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenses"
    ADD CONSTRAINT "Expenses_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES public."Users"(n_document) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expenses Expenses_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenses"
    ADD CONSTRAINT "Expenses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."Users"(n_document) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expenses Expenses_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expenses"
    ADD CONSTRAINT "Expenses_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrders"(id);


--
-- Name: OrderItems OrderItems_discountRuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_discountRuleId_fkey" FOREIGN KEY ("discountRuleId") REFERENCES public."DiscountRules"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItems OrderItems_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItems OrderItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Orders Orders_cashierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES public."Users"(n_document) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Orders Orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(n_document) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payments Payments_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Products Products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE;


--
-- Name: PurchaseOrderItems PurchaseOrderItems_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItems"
    ADD CONSTRAINT "PurchaseOrderItems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PurchaseOrderItems PurchaseOrderItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItems"
    ADD CONSTRAINT "PurchaseOrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PurchaseOrderItems PurchaseOrderItems_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderItems"
    ADD CONSTRAINT "PurchaseOrderItems_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseOrders PurchaseOrders_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."Users"(n_document) ON UPDATE CASCADE;


--
-- Name: PurchaseOrders PurchaseOrders_proveedorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrders"
    ADD CONSTRAINT "PurchaseOrders_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES public."Proveedors"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockMovements StockMovements_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovements"
    ADD CONSTRAINT "StockMovements_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovements StockMovements_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovements"
    ADD CONSTRAINT "StockMovements_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StockMovements StockMovements_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovements"
    ADD CONSTRAINT "StockMovements_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrders"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovements StockMovements_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockMovements"
    ADD CONSTRAINT "StockMovements_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(n_document) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: credit_payment_records credit_payment_records_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_payment_records
    ADD CONSTRAINT "credit_payment_records_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."Payments"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_payments purchase_payments_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_payments
    ADD CONSTRAINT "purchase_payments_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."Users"(n_document) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_payments purchase_payments_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_payments
    ADD CONSTRAINT "purchase_payments_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrders"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

