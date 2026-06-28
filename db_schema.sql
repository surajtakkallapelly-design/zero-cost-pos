-- ==========================================
-- Supabase Database Schema & Seeds for Zero-Cost POS
-- ==========================================

-- Clean start: Drop existing tables if they exist to prevent name conflicts
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. PRODUCTS TABLE
create table public.products (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    category text not null,
    price numeric(10, 2) not null,
    gst numeric(5, 2) not null default 5.00,
    description text,
    tag text,
    type text not null default 'veg',
    sku text unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast product searches
create index idx_products_name on public.products(name);

-- 2. ORDERS TABLE (Billing Invoices)
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    order_number text not null unique,
    subtotal numeric(10, 2) not null,
    tax_amount numeric(10, 2) not null,
    grand_total numeric(10, 2) not null,
    payment_mode text not null check (payment_mode in ('CASH', 'CARD', 'UPI')),
    customer_phone text,
    user_id uuid references auth.users(id) on delete set null default auth.uid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for statistics queries grouped by created_at and payment_mode
create index idx_orders_created_at on public.orders(created_at);
create index idx_orders_payment_mode on public.orders(payment_mode);
create index idx_orders_user_id on public.orders(user_id);

-- 3. ORDER ITEMS TABLE (Snapshotting item details for invoice integrity)
create table public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    unit_price numeric(10, 2) not null,
    quantity integer not null check (quantity > 0),
    gst_amount numeric(10, 2) not null,
    total_amount numeric(10, 2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index on order_id for fast loading of invoice line items
create index idx_order_items_order_id on public.order_items(order_id);

-- ==========================================
-- SEED DATA (Catalog Products)
-- ==========================================

insert into public.products (id, name, price, gst_rate) values
('e23652c4-3310-4c40-9a2c-d9c9b1399e51', 'Organic Coffee Beans', 349.00, 18.0),
('f2c8d203-d68a-49a3-a75e-dc886a117b43', 'Green Tea Box (25s)', 180.00, 5.0),
('d17bf25e-38aa-4629-87a4-8457639f7278', 'Whole Wheat Sourdough', 120.00, 5.0),
('a854d924-f7b7-4e36-93d3-98246a482b61', 'Artisanal Dark Chocolate', 220.00, 18.0),
('c938a906-88b6-4b68-98e9-4e78a63bbcd3', 'Sparkling Mineral Water', 45.00, 18.0);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Products Policies: Authenticated operators can do CRUD
create policy "Allow CRUD for authenticated users on products" 
on public.products for all 
to authenticated 
using (true) 
with check (true);

-- Orders Policies: Authenticated operators can do CRUD on their own orders or legacy orders (where user_id is null)
create policy "Allow CRUD for authenticated users on orders" 
on public.orders for all 
to authenticated 
using (auth.uid() = user_id or user_id is null) 
with check (auth.uid() = user_id or user_id is null);

-- Order Items Policies: Authenticated operators can do CRUD on items belonging to orders they own
create policy "Allow CRUD for authenticated users on order_items" 
on public.order_items for all 
to authenticated 
using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
  )
)
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
  )
);

-- ==========================================
-- TRANSACTIONAL RPC (Atomic Order Creation)
-- ==========================================

create or replace function public.create_order_with_items(
  p_order_number text,
  p_subtotal numeric,
  p_tax_amount numeric,
  p_grand_total numeric,
  p_payment_mode text,
  p_customer_phone text,
  p_items jsonb,
  p_user_id uuid default null
) returns uuid as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_user_id uuid;
begin
  -- Resolve user ID: if passed parameter is null, fallback to auth.uid()
  v_user_id := coalesce(p_user_id, auth.uid());

  -- 1. Create target order entry
  insert into public.orders (order_number, subtotal, tax_amount, grand_total, payment_mode, customer_phone, user_id)
  values (p_order_number, p_subtotal, p_tax_amount, p_grand_total, p_payment_mode, p_customer_phone, v_user_id)
  returning id into v_order_id;

  -- 2. Loop through JSON items array and insert order lines
  for v_item in select * from jsonb_array_elements(p_items) loop
    insert into public.order_items (
      order_id, 
      product_id, 
      product_name, 
      unit_price, 
      quantity, 
      gst_amount, 
      total_amount
    ) values (
      v_order_id,
      (v_item->>'product_id')::uuid,
      v_item->>'product_name',
      (v_item->>'unit_price')::numeric,
      (v_item->>'quantity')::integer,
      (v_item->>'gst_amount')::numeric,
      (v_item->>'total_amount')::numeric
    );
  end loop;

  return v_order_id;
end;
$$ language plpgsql security definer;

-- ==========================================
-- SUPABASE REALTIME REPLICATION SETUP
-- ==========================================

-- Enable real-time updates on orders and order_items for live dashboards
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
alter publication supabase_realtime add table public.products;
