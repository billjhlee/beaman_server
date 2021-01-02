const { paginate } = require("./generalUtils");

let countData = async (data) => {
  let { where, model } = data;
  try {
    let result = await model.count({ where });
    return { data: { count: result }, success: true };
  } catch (error) {
    return { error, success: false };
  }
};

let fetchData = async (data) => {
  if (data.page === undefined) data.page = 0;
  if (data.pageSize === undefined) data.pageSize = 10;

  let {
    page,
    pageSize,
    include,
    where,
    model,
    order,
    offset,
    limit,
    option,
    ...rest
  } = data;

  if (option === undefined) option = 1;
  try {
    let result = await model.findAll(
      paginate(
        {
          where,
          order,
          include,
        },
        { page: data.page, pageSize: data.pageSize, offset, limit },
        option
      )
    );
    let nextPage = result.length === data.pageSize ? data.page + 1 : -1;
    // if (result.length !== data.pageSize + 1) {
    //   nextPage = -1;
    // } else {
    //   nextPage = data.page + 1;
    //   result = result.slice(0, -1);
    // }
    return {
      data: {
        nextPage,
        pageSize: data.pageSize,
        result,
        date: result[0] ? result[0].createdAt : "",
      },
      success: true,
    };
  } catch (error) {
    console.log(error);

    return { error, success: false };
  }
};

let fetchDataOffset = async (data) => {
  let { include, where, model, order, offset, limit, pageSize, ...rest } = data;
  try {
    let result = await model.findAll({
      where,
      order,
      include,
      offset,
      limit,
    });
    let nextPage =
      result.length === limit ? (offset + limit) / pageSize + 1 : -1;
    // if (result.length !== data.pageSize + 1) {
    //   nextPage = -1;
    // } else {
    //   nextPage = data.page + 1;
    //   result = result.slice(0, -1);
    // }
    return {
      data: { nextPage, pageSize: data.pageSize, result },
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

let fetchOne = async (data) => {
  let { include, where, model, order, ...rest } = data;

  try {
    const result = await model.findOne({
      where,
      order,
      include,
    });

    return {
      data: { result },
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

let updateOne = async (data) => {
  let {
    include,
    where,
    model,
    changes,
    order,
    ownership,
    userId,
    ...rest
  } = data;
  try {
    const result = await model.findOne({
      where,
    });

    if (ownership && result.userId != userId) {
      return { error: "No ownership", success: false };
    }

    Object.keys(changes).forEach((attribute) => {
      result[attribute] = changes[attribute];
    });
    await result.save();
    return { data: { result }, success: true };
  } catch (error) {
    return { error, success: false };
  }
};

let deleteOne = async (data) => {
  let { include, where, model, order, ownership, userId, ...rest } = data;
  try {
    const result = await model.findOne({
      where,
    });
    if (ownership && result.userId != userId) {
      return { error: "No ownership", success: false };
    }

    await result.destroy();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
};

module.exports = {
  fetchData,
  fetchDataOffset,
  fetchOne,
  updateOne,
  deleteOne,
  countData,
};
