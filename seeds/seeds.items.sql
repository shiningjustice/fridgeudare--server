TRUNCATE items RESTART IDENTITY;

INSERT INTO items
  (name, date_added, section_id, init_quantity, curr_quantity, note)
  VALUES
  ('bag of mushrooms', '2019-10-21T08:19:12-07:00', 2, 1, 1,''), 
  ('bananas', '2019-10-14T08:19:12-07:00', 1, 4, 4, 'For banana bread recipie'),
  ('apples', '2019-10-07T08:19:12-07:00', 1, 5, 3, ''),
  ('whole wheat bread', '2019-10-15T08:19:12-07:00', 3, 1, 1, ''),
  ('bag of peas', '2019-10-15T08:19:12-07:00', 2, 1, 1, ''),
  ('oatmeal', '2019-9-15T08:19:12-07:00', 7, 2, 1, ''),
  ('chicken picnic pack', '2019-8-15T08:19:12-07:00', 9, 1, 1, ''),
  ('Thai', '2019-10-20T08:19:12-07:00', 11, 1, 1, '')