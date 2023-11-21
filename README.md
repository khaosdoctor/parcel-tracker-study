# Parcel API

## Setup

This project requires `yarn` (`npm` can be used, but there is no lockfile for npm, so version mismatches can occur) and `docker-compose`. Check the `.node-version` file for the tested Node version.

```bash
$ yarn
$ docker-compose up -d
$ yarn start
```

The API is available at `http://localhost:4000/api`.

## Testing

The tests require MongoDB to be running on localhost at port 27017. The easiest way is to run it using docker-compose as explained
in the Setup section. Once it is up, run the tests with `yarn test`, or `yarn test:watch` to keep the test runner active and re-running
on file changes.

The tests currently live in a `__tests__` directory, but the runner is set up to execute any file named `*.spec.js`.

Linting can be done with `yarn lint`, formatting with `yarn format`. To have your editor format automatically, make sure that it integrates
with eslint and respects the `.eslintrc` file.

## API

This is a tiny project that exposes a simple API with two resources:

* Senders
* Parcels

In order to create a `Parcel`, a sender must first register by creating a `Sender`. For example:

```bash
$ curl -XPOST -H "content-type: application/json" \
  --data '{ "email": "test@test.com", "name": "Test McTestFace", "password": "password" }' \ 
  http://localhost:4000/api/sender
{"sender":"5e5d3404557cdf9c556dfd30"}
```

Once the sender has been created, they can use the email and password to create parcels:

```bash
curl -XPOST -H "content-type: application/json" \
  --user test@test.com:password \
  --data '{ "address": "Main Street 123", "dimensions": { "height": 10, "width": 20, "depth": 15 } }' \
  http://localhost:4000/api/parcel
{"parcel":"5e5d345c557cdf9c556dfd31"}
```