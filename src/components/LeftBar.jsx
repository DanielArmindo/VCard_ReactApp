import { Link, NavLink } from "react-router-dom";
import {
  BsBoxArrowInRight,
  BsFillPersonCheckFill,
  BsPersonSquare,
  BsKeyFill,
  BsArrowRight,
  BsPersonGear,
  BsFiles,
  BsCash,
  BsBank,
  BsPiggyBank,
  BsListCheck,
} from "react-icons/bs";
import { getPhotoURL } from "../assets/utils";
import defaultImg from "../assets/imgs/avatar-none.png";

const LeftBar = (props) => {
  const userStore = props.user;
  const clickMenuOption = props.clickMenuOption;
  const logout = props.logout

  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
    >
      <div className="position-sticky pt-3">
        <>
          {userStore && (
            <ul className="nav flex-column">
              {/*Meter activo quando tiver caso e para a rota correpondente*/}
              <li className="nav-item m-2">
                <Link className="nav-link" to="">
                  <BsListCheck className="me-2" size={24} />
                  Categories
                </Link>
              </li>
              <li className="nav-item m-2">
                <Link className="nav-link" to="">
                  <BsFiles className="me-2" size={24} />
                  Statistics
                </Link>
              </li>

              {userStore?.user_type === "A" && (
                <>
                  <li className="nav-item m-2">
                    <Link className="nav-link" to="" onClick={clickMenuOption}>
                      <BsPersonGear className="me-2" size={24} />
                      Admins
                    </Link>
                  </li>
                  <li className="nav-item m-2">
                    <Link className="nav-link" to="" onClick={clickMenuOption}>
                      <BsFiles className="me-2" size={24} />
                      VCards
                    </Link>
                  </li>
                  <li className="nav-item m-2">
                    <Link className="nav-link" to="">
                      <BsCash className="me-2" size={24} />
                      Credit transaction
                    </Link>
                  </li>
                </>
              )}
              {userStore?.user_type !== "A" && (
                <li className="nav-item m-2">
                  <Link className="nav-link" to="">
                    <BsBank className="me-2" size={24} />
                    Transactions
                  </Link>
                </li>
              )}
              {userStore?.user_type === "V" && (
                <li className="nav-item m-2">
                  <Link className="nav-link" to="">
                    <BsPiggyBank className="me-2" size={24} />
                    Piggy Bank
                  </Link>
                </li>
              )}
            </ul>
          )}

          <div className="d-block d-md-none">
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>User</span>
            </h6>
            <ul className="nav flex-column mb-2">
              {/*TODO: meter active e para a respetiva rota*/}
              {userStore ? (
                <li className="nav-item dropdown">
                  {/*Colocar na 1ª imagem a foto do utilizador*/}
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdownMenuLink2"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={
                        userStore.photo_url
                          ? getPhotoURL(userStore.photo_url)
                          : defaultImg
                      }
                      className="rounded-circle z-depth-0 avatar-img"
                      alt="Avatar image"
                    />
                    <span className="avatar-text">{userStore?.name}</span>
                  </a>

                  {/*Repetir a mesma cena como na navbar1*/}
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdownMenuLink2"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to=""
                        onClick={clickMenuOption}
                      >
                        <BsPersonSquare className="me-2" size={24} />
                        Profile
                      </Link>
                    </li>

                    <li>
                      <NavLink
                        className={({ isActive }) => (isActive ? "active dropdown-item" : "dropdown-item")}
                        to="credentials/password"
                        onClick={clickMenuOption}
                      >
                        <BsKeyFill className="me-2" size={24} />
                        Change password
                      </NavLink>
                    </li>
                    {userStore?.user_type === "V" && (
                      <li>
                        <NavLink
                          className={({ isActive }) => (isActive ? "active dropdown-item" : "dropdown-item")}
                          to="credentials/confirmation_code"
                          onClick={clickMenuOption}
                        >
                          <BsKeyFill className="me-2" size={24} />
                          Change confirmation code
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a onClick={logout} className="dropdown-item linkwherf">
                        <BsArrowRight className="me-2" size={24} />
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")} to="vcards/new" onClick={clickMenuOption}>
                      <BsFillPersonCheckFill className="me-2" size={24} />
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) => (isActive ? "active nav-link" : "nav-link")}
                      to="login"
                      onClick={clickMenuOption}
                    >
                      <BsBoxArrowInRight className="me-2" size={24} />
                      Login
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      </div>
    </nav>
  );
};

export default LeftBar;
