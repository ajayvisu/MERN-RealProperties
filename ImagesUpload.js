import React, { useState } from "react";
import axios from "axios";
import "./Style.css";

function ImagesUpload() {
  const [userInfo, setuserInfo] = useState({
    file: [],
    filepreview: null,
  });

  const handleInputChange = (event) => {
    setuserInfo({
      ...userInfo,
      file: event.target.files,
      filepreview: URL.createObjectURL(event.target.files[0]),
    });
  };
  const [isSucces, setSuccess] = useState(null);
  const submit = () => {
    const formdata = new FormData();
    for (let i = 0; i < userInfo.file.length; i++) {
      formdata.append("avatar", userInfo.file[i]);
    }

    axios
      .post("http://localhost:4000/api/property/images-upload", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.warn(res);
        if (res.data.success === 1) {
          setSuccess("Image upload successfully");
        }
      });
  };

  return (
    <div className="container mr-60">
      <div className="formdesign">
        {isSucces !== null ? <h4> {isSucces} </h4> : null}
        <div className="form-row">
          <label className="text-white">Select Image :</label>
          <input
            type="file"
            className="form-control"
            name="upload_file"
            onChange={handleInputChange}
            multiple
          />
        </div>

        <div className="form-row">
          <button
            type="submit"
            className="btn btn-dark"
            onClick={() => submit()}
          >
            Save Image
          </button>
        </div>
      </div>

      {userInfo.filepreview !== null ? (
        <img
          className="previewimg"
          src={userInfo.filepreview}
          alt="UploadImage"
        />
      ) : null}
    </div>
  );
}
export default ImagesUpload;
