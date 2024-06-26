import CryptoJS from "crypto-js";
import { apiHelperPure, apiHelperWithToken } from "./apiHelper";
import apis from "./apis";
import fetch from "isomorphic-unfetch";

const md5FromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (fileEvent) => {
      let binary = CryptoJS.lib.WordArray.create(fileEvent.target.result);
      const md5 = CryptoJS.MD5(binary);
      resolve(md5);
    };
    reader.onerror = () => {
      reject("oops, something went wrong with the file reader.");
    };
    reader.readAsArrayBuffer(file);
  });
};

export const fileChecksum = async (file) => {
  const md5 = await md5FromFile(file);
  // @ts-ignore
  const checksum = md5.toString(CryptoJS.enc.Base64);
  return checksum;
};

export const createPresignedUrl = async (name, type, byte_size, checksum, attached_record = "post", metadata = {}) => {
  const body = {
    file: {
      filename: name,
      byte_size: byte_size,
      checksum: checksum,
      content_type: type,
      metadata,
    },
    attached_record,
  };
  const res = await apiHelperWithToken(apis.presignedUrl._(), "POST", body);
  return res;
};

export const uploadToPresignedUrl = async (presignedUrlObject, file) => {
  const res = await apiHelperPure({ url: presignedUrlObject.direct_upload.url, method: "PUT", body: file, headers: presignedUrlObject.direct_upload.headers });
  return res.status == 200;
};
