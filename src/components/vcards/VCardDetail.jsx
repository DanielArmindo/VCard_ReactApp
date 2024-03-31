import { Form } from "react-router-dom";
import React from "react";
import avatarNoneUrl from "../../assets/imgs/avatar-none.png";
import { getUrlDomain } from "../../assets/utils";

const VCardDetail = (props) => {
  const userStore = props.user;
  const edit = props.edit;
  const idGet = props.idGet;
  const vcard = props.vcard;
  const serverBaseUrl = getUrlDomain();
  const errors = props.errors;

  const [vcardTitle, setVcardTitle] = React.useState(null);
  const [editingImageAsBase64, setEditingImageAsBase64] = React.useState(null);
  const inputPhotoFile = React.useRef(null);
  const [deletePhotoOnTheServer, setDeletePhotoOnTheServer] =
    React.useState(false);

  const funcPhotoFullUrl = () => {
    if (deletePhotoOnTheServer) {
      return avatarNoneUrl;
    }
    if (editingImageAsBase64) {
      return editingImageAsBase64;
    } else {
      // Retornar aqui a imagem para o vcard
      return vcard?.photo_url
        ? serverBaseUrl + "/storage/fotos/" + vcard.photo_url
        : avatarNoneUrl;
    }
  };

  const [photoFullUrl, setPhotoFullUrl] = React.useState(funcPhotoFullUrl());

  const textSaveButton = (() => {
    if (edit) {
      if (props.navigation?.state === "submitting"){
        return "Saving..."
      }
      return "Save";
    } else {
      if (props.navigation?.state === "submitting"){
        return "Registing..."
      }
      return "Register";
    }
  })();

  React.useEffect(() => {
    setPhotoFullUrl(funcPhotoFullUrl());
  }, [deletePhotoOnTheServer, editingImageAsBase64]);

  React.useEffect(() => {
    setVcardTitle(() => {
      // if (!vcard) {
      //   return ''
      // }
      return edit ? "Register a new vcard" : "Vcard #" + vcard?.phone_number;
    });
  }, []);

  const changePhotoFile = () => {
    try {
      const file = inputPhotoFile.current.files[0];
      if (!file) {
        setEditingImageAsBase64(null);
      } else {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            setEditingImageAsBase64(reader.result);
            setDeletePhotoOnTheServer(false);
          },
          false,
        );
        if (file) {
          reader.readAsDataURL(file);
        }
      }
    } catch (error) {
      setEditingImageAsBase64(null);
    }
  };

  const resetToOriginalPhoto = () => {
    setDeletePhotoOnTheServer(false);
    setEditingImageAsBase64(null);
    changePhotoFile();
  };

  const cleanPhoto = () => {
    setDeletePhotoOnTheServer(true);
  };

  //Variaveis temporarias
  // const vcardTitle = "Register a new vcard";

  return (
    <>
      <Form
        method="post"
        encType="multipart/form-data"
        className="row g-3 needs-validation"
      >
        <input
          type="text"
          value={vcard?.photo_url ? vcard.photo_url : ""}
          name="photo_url"
          readOnly
          style={{ display: "none" }}
        />
        <input
          type="text"
          value={deletePhotoOnTheServer}
          name="deletePhotoOnTheServer"
          readOnly
          style={{ display: "none" }}
        />
        <textarea
          value={editingImageAsBase64 == null ? "" : editingImageAsBase64}
          name="base64ImagePhoto"
          readOnly
          style={{ display: "none" }}
        ></textarea>
        <h3 className="mt-5 mb-3">{vcardTitle}</h3>
        <hr />
        <div className="d-flex flex-wrap justify-content-between">
          <div className="w-75 pe-4">
            <div className="mb-3">
              <label htmlFor="inputPhoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className={
                  !errors?.phone ? "form-control" : "is-invalid form-control"
                }
                id="inputPhoneNumber"
                placeholder="Phone Number"
                name="phone"
                required
                disabled={!edit}
              />
              {errors?.phone && <p className="text-red">{errors.phone}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="inputName" className="form-label">
                Name
              </label>
              {/*na classe aplicar classe is-invalid se der erro*/}
              <input
                type="text"
                className="form-control"
                id="inputName"
                placeholder="Vcard name"
                name="name"
                required
                disabled={userStore?.id != idGet && !edit}
              />
              {/*Apresentar erro aqui*/}
            </div>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={
                  errors?.email ? "is-invalid form-control" : "form-control"
                }
                id="inputEmail"
                placeholder="Email"
                name="email"
                required
                disabled={userStore?.id != idGet && !edit}
              />
              {errors?.email && <p className="text-red">{errors.email}</p>}{" "}
            </div>

            {/*Apenas Admins*/}
            {userStore?.user_type === "A" && (
              <>
                <div className="mb-3">
                  <label htmlFor="inputBalance" className="form-label">
                    Balance
                  </label>
                  {/*na classe aplicar classe is-invalid se der erro*/}
                  <input
                    type="number"
                    className="form-control"
                    id="inputBalance"
                    placeholder="Balance"
                    disabled
                  />
                  {/*Apresentar erro aqui*/}
                </div>
                <div className="mb-3">
                  <label htmlFor="inputMaxDebit" className="form-label">
                    Max Debit
                  </label>
                  {/*na classe aplicar classe is-invalid se der erro*/}
                  <input
                    type="number"
                    className="form-control"
                    id="inputMaxDebit"
                    placeholder="Max Debit"
                    required
                  />
                  {/*Apresentar erro aqui*/}
                </div>
              </>
            )}

            {/*Apenas ao editar*/}
            {edit && (
              <>
                <div className="mb-3">
                  <label htmlFor="inputPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={
                      errors?.password
                        ? "is-invalid form-control"
                        : "form-control"
                    }
                    id="inputPassword"
                    name="password"
                    placeholder="Password"
                  />
                  {errors?.password && (
                    <p className="text-red">{errors.password}</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="inputConfirmationCode" className="form-label">
                    Confirmation Code
                  </label>
                  {/*na classe aplicar classe is-invalid se der erro*/}
                  <input
                    type="password"
                    className={
                      errors?.code ? "is-invalid form-control" : "form-control"
                    }
                    id="inputConfirmationCode"
                    name="confirmCode"
                    placeholder="Confirmation Code"
                  />
                  {errors?.code && <p className="text-red">{errors.code}</p>}
                </div>
              </>
            )}

            {/*Apenas para Admins*/}
            {userStore?.user_type === "A" && !edit && (
              <div className="d-flex ms-1 mt-4 flex-wrap justify-content-between">
                <div className="mb-3 me-3 flex-grow-1">
                  <div className="form-check">
                    {/*na classe aplicar classe is-invalid se der erro
                atencção aos valores*/}
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="inputBlocked"
                    />
                    {/*class text-danger se vcard.blocked e text-dark se vcard.blocked == 0*/}
                    <label className="form-check-label" htmlFor="inputBlocked">
                      Vcard is blocked
                    </label>
                  </div>
                  {/*Apresentar erro aqui*/}
                </div>
              </div>
            )}
          </div>
          <div className="w-25">
            <div className="d-flex flex-column">
              <label className="form-label">Photo</label>
              <div className="form-control text-center">
                {/*photoFullUrl é verificada*/}
                <img src={photoFullUrl} className="w-100" />
              </div>

              {(userStore?.id == idGet || edit) && (
                <div className="mt-3 d-flex justify-content-between flex-wrap">
                  <label
                    htmlFor="inputPhoto"
                    className="btn btn-dark flex-grow-1 mx-1"
                  >
                    Carregar
                  </label>
                  {vcard?.photo_url && (
                    <button
                      onClick={resetToOriginalPhoto}
                      type="button"
                      className="btn btn-secondary flex-grow-1 mx-1"
                    >
                      Repor
                    </button>
                  )}
                  {(vcard?.photo_url || editingImageAsBase64) && (
                    <button
                      onClick={cleanPhoto}
                      type="button"
                      className="btn btn-danger flex-grow-1 mx-1"
                    >
                      Apagar
                    </button>
                  )}
                </div>
                /*Apresentar erro aqui, o vcard na condição o parametro pode nao ser aquele*/
              )}
            </div>
          </div>
        </div>
        <hr />

        <div className="mt-2 d-flex justify-content-between">
          <div>
            <button
              className="btn btn-primary px-5 mx-2"
              disabled={props.navigation.state === "submitting"}
            >
              {textSaveButton}
            </button>
            {!edit && (
              <>
                <button
                  type="button"
                  onClick={props.cancel}
                  className="btn btn-secondary px-5 mx-2"
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger px-5 mx-2">
                  Delete
                  {userStore?.user_type == "A"
                    ? "Delete"
                    : "Delete my VCard account"}
                </button>
              </>
            )}
          </div>
        </div>
      </Form>
      <input
        type="file"
        style={{ visibility: "hidden" }}
        id="inputPhoto"
        onChange={changePhotoFile}
        ref={inputPhotoFile}
      />
    </>
  );
};

export default VCardDetail;

//ultimo input tipo file
//
//no onChange = changePhotoFile
//tudo relacionado ao save é para o action
