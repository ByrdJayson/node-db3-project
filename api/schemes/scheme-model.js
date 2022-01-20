const db = require('../../data/db-config')

function find() { // EXERCISE A
  
 
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */
 return db('schemes as sc').leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
 .select('sc.*')
 .count('st.step_id as number_of_steps')
 .groupBy('sc.scheme_id')
}

async function findById(scheme_id) {
  const rows = await db('schemes AS sc')
      .leftJoin('steps AS st', 'sc.scheme_id', 'st.scheme_id')
      .select('sc.scheme_name', 'st.*')
      .where('sc.scheme_id', scheme_id)
      .orderBy('st.step_number', 'ASC')

  const result =  {
      scheme_id: rows[0].scheme_id,
      scheme_name: rows[0].scheme_name,
      steps: (rows[0].step_number  > 0) ?
          rows.map(scheme => {
              return ({
                  step_id: scheme.step_id,
                  step_number: scheme.step_number,
                  instructions: scheme.instructions
              })
          }) : []
  }

  return result
}

async function findSteps(scheme_id) { // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
      const rows = await db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .select('st.step_id', 'st.step_number', 'instructions', 'sc.scheme_name')
      .where('sc.scheme_id', scheme_id)
      .orderBy('step_number')

      if(!rows[0].step_id){
        return []
      } else return rows

}

function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
 return db('schemes').insert(scheme)
  .then(([id]) => {
    return db('schemes').where('id', id)
  })
}

function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
 return db('steps').insert({
   ...step,
   scheme_id
 })
 .then(() => {
   return db('steps').where('scheme_id', scheme_id)
 })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
