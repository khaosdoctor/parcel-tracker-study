const passport = require("passport");
const { BasicStrategy } = require("passport-http");

const init = Sender =>
  passport.use(
    new BasicStrategy(function(username, password, done) {
      return Sender.findOne({ email: username })
        .exec()
        .then(sender => {
          if (!sender) {
            return done(null, false);
          }

          return sender
            .authenticate(password)
            .then(matches => {
              if (matches) {
                return done(null, sender);
              } else {
                return done(null, false);
              }
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    })
  );

const middleware = () => passport.authenticate("basic", { session: false });

module.exports = {
  init,
  middleware
};
