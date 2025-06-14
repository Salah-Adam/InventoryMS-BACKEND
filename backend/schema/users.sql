-- raac saddexda step ee hoos ku qoran
-- step walba hal hal u execute gareey


-- # step 1.1
Use inventory_ms -- hadii database uu ku abuuran yahayna, execute line-kan

-- # step 1.2
create database inventory_ms;  -- hadii database uusan ku abuuraneyn, execute line-kan


-- # step 2
create table users(
id int auto_increment primary key,
user_name varchar(20) unique,
phone int unique,
password varchar(255),
role enum('admin', 'Staff') default 'admin',
created_at timestamp default current_timestamp,
is_active tinyint default 1
);


-- # step 3
-- hoos waxaa ku qoran waa tusaale muujinaaya sidaa ugu soo dari laheyd user cusub
insert into Sales (user_name, phone, password, role)
values
("group6", 616666666, "group6", "admin");

