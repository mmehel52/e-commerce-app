import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_SUCCESS":
      return { ...state, loading: false };
    case "UPDATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function ProfileScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerLogo, setSellerLogo] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await Axios.put(
        "/api/users/profile",
        { name, email, password, sellerName, sellerLogo, sellerDescription },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      dispatch({ type: "UPDATE_SUCCESS" });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated succesfully");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate();
    }
  }, [navigate, userInfo]);
  console.log(userInfo);
  return (
    <Container className="small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
        {userInfo.isSeller && (
          <>
            <h2>Seller</h2>
            <Form.Group>
              <Form.Label htmlFor="sellerName">Seller Name</Form.Label>
              <Form.Control
                id="sellerName"
                type="text"
                placeholder="Enter Seller Name"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="sellerLogo">Seller Logo</Form.Label>
              <Form.Control
                id="sellerLogo"
                type="text"
                placeholder="Enter Seller Logo"
                value={sellerLogo}
                onChange={(e) => setSellerLogo(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="sellerDescription">
                Seller Description
              </Form.Label>
              <Form.Control
                id="sellerDescription"
                type="text"
                placeholder="Enter Seller Description"
                value={sellerDescription}
                onChange={(e) => setSellerDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </>
        )}
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </Container>
  );
}
