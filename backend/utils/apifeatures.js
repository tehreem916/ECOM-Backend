class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};
    this.query = this.query.find(keyword);
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    ["keyword", "page", "limit"].forEach((key) => delete queryCopy[key]);
    const queryStr = JSON.stringify(queryCopy).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    this.query = this.query.limit(resultPerPage).skip(resultPerPage * (currentPage - 1));
    return this;
  }
}

module.exports = ApiFeatures;
