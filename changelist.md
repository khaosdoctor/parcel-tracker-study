# Things I would change

- Convert to TypeScript
- Include tests along with the files
- Use ESM
- Create a `data` directory and move `resources` and `models` in there
- Would not use bcrypt and use the internal Node crypto pbkdf2 module instead
  - To compare I would use the `crypto.timingSafeEqual` method
- Would remove mongoose and use the native mongodb driver, then use a domain layer to abstract the database to entities `Sender` and `Parcel` that would be used in the application layer, this makes the application more testable and easier to maintain
  - Mongoose models can mix up application logic with database logic like in authentication
- Would use a logger like [debug](https://npm.im/debug) or [pino](http://npm.im/pino)
- Would use Zod to validate all the request bodies and internal objects
- Would remove `uuid` package in favor of the native `crypto.randomUUID` method
- Would use a `Dockerfile` to create a container for the application so it's more portable
- Would separate the `jest` configuration into a `jest.config.js` file
- Remove body-parser as it's deprecated and use the native `express.json` middleware
- Update dependencies
- Use node 20.6 to use the env file support to reduce the number of dependencies
  - Downside is that we need to validate the env variables ourselves using Zod and probably passing it through a config object, we can't extend
- Would remove Jest and use the native node test runner as Jest is very wonky with TypeScript
