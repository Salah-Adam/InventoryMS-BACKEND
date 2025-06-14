

-- inta aadan product table-ka xog kusoo darin, raac steps hoos ku qoran

-- # step 1: execute gareey query-ga hoos ku qoran
ALTER TABLE products DROP COLUMN total_cost;

-- # step 2: execute gareey query-ga hoos ku qoran
ALTER TABLE products
ADD COLUMN total_cost DECIMAL(10,2) GENERATED ALWAYS AS (stock_units * unit_cost) STORED;


-- kadib hada insertion waa sameyn kartaa
-- query-ga hoos ku qoran waa sample sida product table-ka wax loogu soo daro

insert into `inventory-ms`.products(product_name, stock_units, unit_cost, created_by)
value
('African Dress', 12, 15, 1);