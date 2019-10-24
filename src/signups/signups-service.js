const SignupsService = {
  insertSignup(knex, signup) {
    return knex
      .insert(signup)
      .into('signups')
    //don't return anything
  }
}

module.exports = SignupsService;