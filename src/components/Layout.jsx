import { Outlet, Link, useNavigate } from "react-router-dom";
import "../assets/dashboard.css";
import TopBar from "./TopBar";
import LeftBar from "./LeftBar";
import { logout } from "../assets/api";
import { useSelector, useDispatch } from "react-redux";
import { clear } from "../stores/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clickMenuOption = () => {
    const domReference = document.getElementById("buttonSidebarExpandId");
    if (domReference) {
      if (window.getComputedStyle(domReference).display !== "none") {
        domReference.click();
      }
    }
  };

  async function logoutClick() {
    const leaved = await logout();
    if (leaved) {
      toast.success('Logout Completed!');
      dispatch(clear());
    } else {
      toast.error("Error to Logout!!");
    }
    navigate("/");
  }

  //Variaveis temporarias
  const vCardsStore = {
    vcardMaxDebit: 100,
    vcardBalance: 1000,
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top flex-md-nowrap p-0 shadow">
        <div className="container-fluid">
          <Link
            className="navbar-brand col-md-3 col-lg-2 me-0 px-3"
            to="."
            onClick={clickMenuOption}
          >
            <img
              src="/react.svg"
              alt="Logotype"
              width="30"
              height="24"
              className="d-inline-block align-text-top me-2 ms-2"
            />
            VCard
          </Link>

          <button
            id="buttonSidebarExpandId"
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <TopBar
            user={user}
            logout={logoutClick}
            clickMenuOption={clickMenuOption}
            vCardsStore={vCardsStore}
          />
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <LeftBar
            user={user}
            logout={logoutClick}
            clickMenuOption={clickMenuOption}
          />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
