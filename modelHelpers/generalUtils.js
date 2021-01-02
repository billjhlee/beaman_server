const paginate = (query, data, option = 1) => {
  let result = {};
  if (option == 0) {
    if (data.offset) result.offset = data.offset;
    if (data.limit) result.limit = data.limit;
    else if (data.pageSize) result.limit = data.pageSize;
    return {
      ...query,
      ...result,
    };
  } else {
    result.offset = data.page * data.pageSize;
    result.limit = parseInt(data.pageSize);
    if (data.offset) result.offset += parseInt(data.offset);
    return {
      ...query,
      ...result,
    };
  }
  // const offset = data.page * data.pageSize;
  // const limit = data.pageSize;
  // return {
  //   ...query,
  //   offset,
  //   limit,
  // };
};

const attribute_func = async (attr) => {
  if (attr instanceof Date) {
    return moment(attr).format("YYYY-MM--DDTHH:mm::ssZ");
  }

  if (attr === null) return "";

  return await attr;
};

const instance = async (instance, options = {}) => {
  if (!instance) return null;

  const result = {};

  const attributes = options.attributes || [];
  for (const attribute of attributes) {
    result[attribute] = await attribute_func(instance[attribute]);
  }

  // const associations = options.associations || [];
  // await Promise.all(
  //   associations.map(async association => {
  //     const relative = instance[association];
  //     if (!relative) return null;
  //     result[association] = relative ? await relative.serialize() : null;
  //   })
  // );

  return result;
};

const serialize = (options = {}) => {
  return instance(this, options);
};

const san_options = {
  allowedTags: [
    "strong",
    "em",
    "u",
    "s",
    "blockquote",
    "pre",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "h7",
    "ol",
    "ul",
    "li",
    "sub",
    "sup",
    "span",
    "a",
    "img",
    "iframe",
    "br",
    "p",
  ],
  allowedAttributes: {
    p: ["class", "style"],
    strong: ["class", "style"],
    em: ["class", "style"],
    u: ["class", "style"],
    s: ["class", "style"],
    blockquote: ["class"],
    pre: ["class", "spellcheck"],
    h1: ["class"],
    h2: ["class"],
    h3: ["class"],
    h4: ["class"],
    h5: ["class"],
    h6: ["class"],
    h7: ["class"],
    ol: ["class"],
    ul: ["class"],
    li: ["class"],
    sub: ["class", "style"],
    sup: ["class", "style"],
    span: ["class", "style"],
    a: ["class", "href", "rel", "target", "style"],
    img: ["class", "src", "width", "style", "alt"],
    iframe: ["class", "frameborder", "allowfullscreen", "src"],
  },
  selfClosing: ["img", "br"],
  allowedSchemes: ["http", "https"],
  allowedSchemesByTag: {
    img: ["data", "http", "https"],
  },
};

const san_options_2 = {
  allowedTags: [],
  allowedAttributes: {},
};

const generalUtils = {
  paginate,
  serialize,
  san_options,
  san_options_2,
};

module.exports = generalUtils;
