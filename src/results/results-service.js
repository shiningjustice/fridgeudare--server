const ResultsService = {
  getResultsSearchOnly(knex, searchTerm) {
    return knex('items', {only: searchTerm})
      .select('*')
      .where('name', 'like', `%${searchTerm}%`)
  },
  getResultsSectionsOnly(knex, filteredFolders) {
    return knex('items')
      .select('*')
      .whereIn('section_id', filteredFolders)
  }, 
  getResultsSortOnly(knex, sortField, sortOrder) {
    return knex('items')
      .select('*')
      .orderBy(sortField, sortOrder)
  },
  getResultsSearchSections(knex, searchTerm, filteredFolders) {
    return knex('items')
      .select('*')
      .whereIn('section_id', filteredFolders)
      .andWhere('name', 'like', `%${searchTerm}%`)
  },
  getResultsSearchSort(knex, searchTerm, sortField, sortOrder) {
    return knex('items')
      .select('*')
      .andWhere('name', 'like', `%${searchTerm}%`)
      .orderBy(sortField, sortOrder)
  },
  getResultsSectionsSort(knex, filteredFolders, sortField, sortOrder) {
    return knex('items')
      .select('*')
      .whereIn('section_id', filteredFolders)
      .orderBy(sortField, sortOrder)
  },
  getResultsSearchSectionsSort(knex, searchTerm, filteredFolders, sortField, sortOrder) {
    return knex('items')
      .select('*')
      .whereIn('section_id', filteredFolders)
      .andWhere('name', 'like', `%${searchTerm}%`)
      .orderBy(sortField, sortOrder)
  }
}

module.exports = ResultsService;