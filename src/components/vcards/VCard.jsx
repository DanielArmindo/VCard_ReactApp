import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import VCardDetail from "./VCardDetail";
import { useActionData } from "react-router-dom";
import { useSelector } from "react-redux";

const VCard = () => {
  const dataFromLoader = useLoaderData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const errors = useActionData();
  // console.log(user)

  if (errors === true) {
    console.log("Registou")
    //meter para ir para tras
    navigate("/")
  }else if (errors === false) {
    console.log("Falhou")
  }else{
    // console.log(errors)
    if (errors?.status === 422) {
      console.log("Nao foi possivel fazer o pedido")
      console.log(errors.data.errors)
    }
  }

  const deleteClick = () =>{

  }

  const cancel = () =>{
     navigate(-1);
  }
  // console.log(user);
  return <VCardDetail vcard={null} user={user} cancel={cancel} edit={dataFromLoader.edit} idGet={dataFromLoader.id} errors={errors} navigation={navigation} />;
};

export default VCard;
