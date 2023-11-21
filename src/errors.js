const MONGO_ERRORS = {
  DUPLICATE_KEY: 11000
};

class CustomError extends Error {
  constructor(e, status = 500) {
    super(e);
    this.message = e.message || e;
    this.status = status;
  }
}

class MongoError extends CustomError {
  static fromMongoose(error) {
    switch (error.code) {
      case MONGO_ERRORS.DUPLICATE_KEY:
        return new MongoError("Unique constraint violated", 400);
      default:
        console.error("Unknown error from MongoDB", {
          error: error.message || error,
          stack: error.stack
        });
        return new CustomError("Unknown Server Error");
    }
  }
}

module.exports = {
  CustomError,
  MongoError
};
