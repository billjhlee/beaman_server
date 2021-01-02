const { Article } = require("../models/index");
const { paginate, san_options, san_options_2 } = require("./generalUtils");
const sanitizeHtml = require("sanitize-html");

let createArticle = async (data) => {
  try {
    // console.log(data);
    data.title = sanitizeHtml(data.title, san_options_2);
    data.content = sanitizeHtml(data.content, san_options);
    const article = await Article.create(data);
    return { data: article, success: true };
    // return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

let deleteArticle = async (data) => {
  try {
    const result = await Article.destroy({
      where: { ...data },
    });
    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

let findArticleById = async (data) => {
  try {
    const article = await Article.findOne({
      where: { ...data },
    });
    return { data: article, success: true };
  } catch (error) {
    return { error, success: false };
  }
};

let findArticlesByUserId = async (data) => {
  if (!data.page) data.page = 0;
  if (!data.pageSize) data.pageSize = 10;

  let { page, pageSize, ...rest } = data;
  try {
    const articles = await Article.findAll(
      paginate(
        {
          where: {
            ...rest,
          },
        },
        { page: data.page, pageSize: data.pageSize }
      )
    );
    let nextPage = articles.length < data.pageSize ? 0 : data.page + 1;
    return {
      data: { nextPage, pageSize: data.pageSize, articles },
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

// replace everything with this general function.
// This will move to utils
let findArticles = async (data) => {
  if (!data.page) data.page = 0;
  if (!data.pageSize) data.pageSize = 10;

  let { page, pageSize, ...rest } = data;
  try {
    const articles = await Article.findAll(
      paginate(
        {
          where: {
            ...rest,
          },
        },
        { page: data.page, pageSize: data.pageSize }
      )
    );
    let nextPage = articles.length < data.pageSize ? 0 : data.page + 1;
    return {
      data: { nextPage, pageSize: data.pageSize, articles },
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

let fetchArticles = async (data) => {
  if (!data.page) data.page = 0;
  if (!data.pageSize) data.pageSize = 10;

  let { page, pageSize, ...rest } = data;
  try {
    const articles = await Article.findAll(
      paginate(
        {
          where: {
            ...rest,
          },
        },
        { page: page, pageSize: pageSize }
      )
    );
    let nextPage = articles.length < data.pageSize ? 0 : data.page + 1;
    return {
      data: { nextPage, pageSize: data.pageSize, articles },
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

let ArticleMethods = {
  createArticle,
  deleteArticle,
  findArticleById,
  findArticlesByUserId,
  fetchArticles,
};

module.exports = ArticleMethods;
