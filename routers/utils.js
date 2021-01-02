sendResponse = (result, response) => {
  if (result.success) {
    if (result.data && result.data.cookies) {
      result.data.cookies.forEach((cookie) => {
        response.cookie(cookie[0], cookie[1], cookie[2] ? cookie[2] : {});
      });
      delete result.data.cookies;
    }
    if (result.data) response.status(200).send(result.data);
    else response.status(200).send();
  } else {
    if (result.error.errors) {
      response.status(400).send(result.error.errors[0].message);
    } else response.status(400).send(result.error);
  }
};

const queryParser = (query) => {
  let { page, pageSize, order, type, ...rest } = query;
  page = page ? parseInt(page) : 0;
  pageSize = pageSize ? parseInt(pageSize) : 10;
  type = type ? type : "DESC";
  if (order) {
    order = [[order, type]];
    return {
      page,
      pageSize,
      order,
      ...rest,
    };
  }

  return {
    page,
    pageSize,
    // order,
    ...rest,
  };
};

module.exports = {
  sendResponse,
  queryParser,
};
