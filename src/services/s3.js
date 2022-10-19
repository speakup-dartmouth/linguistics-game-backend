import aws from 'aws-sdk';

const S3 = new aws.S3();

const signS3 = async (req, res) => {
  const fileName = req.query.filename;
  const fileType = req.query.type;

  if (!fileName || !fileType) {
    return res.status(400).send({
      error: 'Missing filename or filetype',
    });
  }

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    ACL: 'public-read',
  };
  try {
    const url = await S3.getSignedUrlPromise('putObject', s3Params);
    return res.status(200).send({
      url,
    });
  } catch (error) {
    return res.status(500).send({
      error,
    });
  }
};

export default signS3;
