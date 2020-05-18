const bcryptjs = require('bcryptjs')

const express = require('express');

const router = express.Router();

const Users = require("./users-model");
const {isValid} = require("./users-service")

// router.get('/', (req, res) => {
//   if (req.session && req.session.user) {
//     const { username, password } = req.headers;
//     Users.find()
//     .then(users => {
//       res.json(users);
//     })
//     .catch(err => res.send(err));
//   } else {
//     res.status(401).json({ message: "You shall not pass!" })
//   }
// })

router.get('/', (req, res, next) => {
  if (req.session && req.session.loggedIn) {
      Users.find()
      .then(users => {
          res.json(users)
      })
      .catch(err => {
          res.status(500).json({ message: 'Failed to get the users' });
      })
  } else {
      res.status(401).json({you: "cannot pass!"});
  }
})

router.get('/logout', (req, res) => {
  if (req.session.loggedIn) {
      req.session.destroy(err => {
          if(err){
              res.json('error when logging out!')
          } else {
              res.status(200).json({message: 'bye, thanks for coming!'})
          }
      })
  } else {
      res.status(200).json({message: 'You are not logged in'})
  }
})

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
  .then(user => {
    if(user && bcryptjs.compareSync(password, user.password)) {
      req.session.user = user;
      req.session.loggedIn = true;
      res.status(200).json({ message: `Welcome ${user.username}` })
    } else  {
      res.status(401).json({ message: "invalid credentials" })
    }
  })
  .catch(error => {
    res.status(500).json(error)
  })
})

router.post('/register', (req, res) => {
  let user = req.body;

  const hash = bcryptjs.hashSync(user.password, 12);

  user.password = hash;

  Users.add(user)
  .then(saved => {
    res.status(201).json(saved);
  }) 
  .catch(error => {
    res.status(500).json(error);
  })
})

module.exports = router;