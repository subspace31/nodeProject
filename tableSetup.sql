CREATE TABLE images (
  id serial PRIMARY KEY
  ,seller_id INT REFERENCES sellers(seller_id)
  ,path text
  ,name text
);

CREATE TABLE item_images (
  item_id INT REFERENCES items(item_id)
  ,image_id INT REFERENCES images(id)
);

CREATE TABLE sellers (
  id SERIAL PRIMARY KEY
  ,email text UNIQUE
  ,password text
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY
  ,seller_id INT REFERENCES sellers
  ,name text
  ,description text
  ,cost NUMERIC(9,2)
  ,category_id INT REFERENCES categories
);

