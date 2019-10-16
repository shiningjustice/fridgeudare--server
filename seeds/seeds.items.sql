TRUNCATE items RESTART IDENTITY;

INSERT INTO items
  (name, section_id, init_quantity, curr_quantity, note)
  VALUES
  ('bag of mushrooms', 2, 1, 1,''), 
  ('bananas', 1, 4, 4, 'For banana bread recipie'),
  ('apples', 1, 5, 3, ''),
  ('whole wheat bread', 3, 1, 1, ''),
  ('bag of peas', 2, 1, 1, '')