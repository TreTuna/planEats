var db = require('../db');

var columns = {
  Recipe: {
    col1: 'name',
    col2: 'recipe'
  },
  Meals: {
    col1: 'name',
    col2: 'favorited'
  },
  Events:{
    col1: 'name',
    col2: 'meal_time'
  }
}

module.exports = {

  findUser: function(username) {
    return db.Users.findOne({where: {username:username}});
  },

  addUser: function(user) {
    return db.Users.findOrCreate({where: {username:user}});
  },

  getAll: function(username,type) {
    var col1 = columns[type].col1;
    var col2 = columns[type].col2;
    return db.Users.findAll({where:{username:username},
      include: [{
        model: db[type],
        through: {
          attributes: [col1,col2]
        }
      }]
    });
  },

  addRecipe: function(name,recipe) {
    return db.Recipe.create({
      name: name,
      recipe: recipe
    });
  },

  GetMeals: function(req, res, data, field) {
    db.Meals.findAll({include: [db.Users]})
      .then(function(meals) {
        res.json(meals);
      });
  },

  AddMeal: function(req, res) {
    db.User.findOrCreate({where: {username: req.body.username}})
      .spread(function(user, created) {
        db.Meals.create({
          userid: user.get('id'),
          name: req.body.name,
          favorited: req.body.favorited
        }).then(function(meal) {
          res.sendStatus(201);
          console.log('Meal created!');
        });
      });
  },

  GetEvents: function(req, res) {
    db.Events.findAll({include: [db.Users]})
      .then(function(events) {
        res.json(events);
      });
  },

  AddEvent: function(req, res) {
    db.User.findOrCreate({where: {username: req.body.username}})
      .spread(function(user, created) {
        db.Events.create({
          userid: user.get('id'),
          meal_time: req.body.meal_time
        }).then(function(event) {
          res.sendStatus(201);
          console.log('Event created!');
        })
      })
  },

  addJoinTable(Join1, Join2, id1, id2) {
    return db[Join1+'s'+Join2+'s'].create({
      [Join1+'Id']: id1,
      [Join2+'Id']: id2
    })
  }
};

//
//
// meal = {
//   name: 'steak and eggs',
//   user: userId,
//   favorited: boolean,
//   recipesIds: [1, 2, 3, 4, 5]
// }