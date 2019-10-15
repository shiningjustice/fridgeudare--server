const SectionsService = {
  getSections(knex) {
    return knex.select('*').from('sections')
  }
}

module.exports = SectionsService;