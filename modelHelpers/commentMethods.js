const { Comment, User } = require("../models/index");
const { paginate } = require("./generalUtils");
// const { User } = require("../models/index");

let createComment = async (data) => {
  try {
    const comment = await Comment.create({
      ...data,
      // include: [
      //   {
      //     model: User
      //   }
      //
    });
    return comment;
  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
};

let deleteComment = async (data) => {
  try {
    const result = await Comment.destroy({
      where: { ...data },
    });
    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

let findCommentById = async (data) => {
  try {
    const comment = await Comment.findOne({
      where: { ...data },
    });
    return { data: comment, success: true };
  } catch (error) {
    return { error, success: false };
  }
};

let findCommentsByUserId = async (data) => {
  if (!data.page) data.page = 0;
  if (!data.pageSize) data.pageSize = 10;
  let { page, pageSize, ...rest } = data;

  try {
    const comments = await Comment.findAll(
      paginate(
        {
          where: {
            ...rest,
          },
        },
        { page: data.page, pageSize: data.pageSize }
      )
    );
    let nextPage = comments.length < data.pageSize ? 0 : data.page + 1;
    return {
      data: { nextPage, pageSize: data.pageSize, comments },
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

let findCommentsByArticleId = async (data) => {
  if (!data.page) data.page = 0;
  if (!data.pageSize) data.pageSize = 10;
  let { page, pageSize, ...rest } = data;

  try {
    const comments = await Comment.findAll(
      paginate(
        {
          where: {
            ...rest,
          },
          include: [
            { model: User, as: "users_liked" },
            { model: User },
            { model: Comment, limit: 1 },
          ],
        },
        { page: data.page, pageSize: data.pageSize }
      )
    );
    let nextPage = comments.length < data.pageSize ? 0 : data.page + 1;
    return {
      data: { nextPage, pageSize: data.pageSize, comments },
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

let findChildrenById = async (data) => {
  if (!data.page) data.page = 0;
  if (!data.pageSize) data.pageSize = 10;
  let { page, pageSize, ...rest } = data;

  try {
    const comments = await Comment.findAll(
      paginate(
        {
          where: {
            ...rest,
          },
          include: [{ model: User }],
        },
        { page: data.page, pageSize: data.pageSize }
      )
    );
    let nextPage = comments.length < data.pageSize ? 0 : data.page + 1;
    return {
      data: { nextPage, pageSize: data.pageSize, comments },
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
};

// let findCommentsByArticleId = async data => {
//   if (!data.page) data.page = 0;
//   if (!data.pageSize) data.pageSize = 10;
//   let { page, pageSize, ...rest } = data;

//   try {
//     const comments = await Comment.findAll(
//       paginate(
//         {
//           where: {
//             ...rest
//           },
//           include: [{ model: User }]
//         },
//         { page: data.page, pageSize: data.pageSize }
//       )
//     );
//     let nextPage = comments.length < data.pageSize ? 0 : data.page + 1;
//     return {
//       data: { nextPage, pageSize: data.pageSize, comments },
//       success: true
//     };
//   } catch (error) {
//     console.log(error);
//     return { error, success: false };
//   }
// };

let fetchComments = async (data) => {
  if (!data.page) data.page = 0;
  if (!data.pageSize) data.pageSize = 10;
  let { page, pageSize, ...rest } = data;

  try {
    const comments = await Comment.findAll(
      paginate(
        {
          where: {
            ...rest,
          },
        },
        { page: data.page, pageSize: data.pageSize }
      )
    );
    let nextPage = comments.length < data.pageSize ? 0 : data.page + 1;
    return {
      data: { nextPage, pageSize: data.pageSize, comments },
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

let CommentMethods = {
  createComment,
  deleteComment,
  findCommentById,
  findCommentsByUserId,
  findCommentsByArticleId,
  fetchComments,
  findChildrenById,
};

module.exports = CommentMethods;
