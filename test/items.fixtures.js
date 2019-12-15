const items = [
  {
    id: 1, 
    name: 'test 1',
    date_added: new Date(),
    section_id: 1, 
    note: 'test 1: test',
    init_quantity: 1,
    curr_quantity: 1
  },
  {
    id: 2,
    name: 'test 2',
    date_added: new Date('2019-11-09T03:24:00'),
    section_id: 2,
    note: 'test 2: test test',
    init_quantity: 2,
    curr_quantity: 1
  },
  {
    id: 3, 
    name: 'test 3', 
    date_added: new Date('2019-11-08T03:24:00'),
    section_id: 3,
    note: 'test 3: test test test',
    init_quantity: 3, 
    curr_quantity: 2
  },
  {
    id: 4,
    name: 'test 4' ,
    date_added: new Date('2019-11-07T03:24:00'),
    section_id: 4,
    note: 'test 4: test test test test',
    init_quantity: 4, 
    curr_quantity: 4
  },
];

module.exports = items;