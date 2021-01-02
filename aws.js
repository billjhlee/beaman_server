const AWS = require("aws-sdk");
// const s3 = new AWS.S3({
//   accessKeyId: config.aws_access_key_id,
//   secretAccessKey: config.aws_secret_access_key,
//   useAccelerateEndpoint: true
// });

var s3 = new AWS.S3({
  accessKeyId: "AKIAX4RV3DTESEPLRGF4",
  secretAccessKey: "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",
  region: "ap-northeast-2"
});

// var params = {
//   Bucket: "cf-simple-s3-origin-cloudfronts3-542352547017",
//   //   Key: "12345.jpg",
//   Expires: 60 * 60,
//   Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
//   Fields: {
//     "Content-Type": "image/jpeg",
//     key: "12.jpg"
//   }
//   //   ContentType: "image/jpeg"
// };

const createPresignedPost = async params => {
  return s3.createPresignedPost(params);
};

var params = {
  Bucket: "cf-simple-s3-origin-cloudfronts3-542352547017",
//   Key: "03.jpg",
  Expires: 60 * 60
  //   ContentType: "image/jpeg"
};
module.exports = {
  s3,
  params,
  createPresignedPost
};
