class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i", // without case sensitive
                  },
              }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        // Removing Fields of Category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Filter for Price and Rating
        // console.log("first", queryCopy);

        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        // console.log("third", queryStr);

        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        // skip product per page
        const skip = (currentPage - 1) * resultPerPage;

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;
