import apis from "src/modules/apis";
import { fileChecksum } from "src/modules/fileHelper";
import { getKeyFromUri } from "src/modules/uriUtils";
import { apiHelperPure, apiHelperWithToken } from "src/modules/apiHelper";
import { Buffer } from "buffer";

export enum FileUploadReturnType {
  Key,
  BlobSignedId,
}
export default function useFileUpload({ attachedRecord }) {
  const createPresignedUrl = async (name, type, byte_size, checksum, attached_record = "post", metadata = {}) => {
    const body = {
      file: {
        filename: name,
        byte_size: byte_size,
        checksum: checksum,
        content_type: type == "image/jpg" ? "image/jpeg" : type,
        metadata,
      },
      attached_record,
    };
    const res = await apiHelperWithToken(apis.presignedUrl._().url, "POST", body);

    return res;
  };
  const uploadImageToPresignedUrl = async (presignedUrlObject, file) => {
    const res = await apiHelperPure({
      url: presignedUrlObject.direct_upload.url,
      body: file,
      method: "PUT",
      headers: presignedUrlObject.direct_upload.headers,
    });
    if (res.status == 200) return res.url;
    return "";
  };
  const uploadFile = async (file: File, returnType = FileUploadReturnType.Key) => {
    let blob = null;
    const checksum = await fileChecksum(file);
    const data = await createPresignedUrl(file.name, file.type, file.size, checksum, attachedRecord);
    const uploadImageToPresignedUrlRes = await uploadImageToPresignedUrl(data.presigned_url_object, file);
    if (!uploadImageToPresignedUrlRes) return;
    return returnType == FileUploadReturnType.Key ? getKeyFromUri(uploadImageToPresignedUrlRes) : data.presigned_url_object.blob_signed_id;
  };

  return { uploadFile };
}
