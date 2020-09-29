import styles from './auth.css'
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIcons } from "../redux/actions/iconsActions";
import { signup } from "../redux/actions/authActions";

import { Dropdown } from 'react-bootstrap';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";


const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required.
            </div>
        );
    }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vusername = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                Username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = (value) => {
    if (value.length < 8 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                Password must be between 8 and 40 characters.
            </div>
        );
    }
};

const Signup = () => {
    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [iconPick, setIconPick] = useState(null);
    const [icons, setIcons] = useState(null);

    const iconData = useSelector(state => state.icons).items;
    const fetchingIcons = useSelector(state => state.icons).fetching;
    const iconsFetched = useSelector(state => state.icons).fetched;

    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!iconsFetched && !fetchingIcons)
            dispatch(fetchIcons());
    });

    useEffect(() => {
        setIcons(iconData.map(i => {
            return (
                <Dropdown.Item value={i.name} onClick={() => handleIconClick(i)}>
                    <img className="icon" src={i.image_url} />
                    {i.name + ' '}
                </Dropdown.Item>
            )
        }))
    }, [iconData]);

    const handleIconClick = (icon) => {
        setIconPick({
            name: icon.name,
            image_url: icon.image_url,
            element: (
                <>
                    <img className="icon" src={icon.image_url} />
                    {icon.name + ' '}
                </>
            )
        });
    };

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleSignup = (e) => {
        e.preventDefault();

        setSuccessful(false);
        
        form.current.validateAll();
        
        if (checkBtn.current.context._errors.length === 0 && iconPick) {
            dispatch(signup(username, email, iconPick.name, password))
                .then(() => {
                    setSuccessful(true);
                })
                .catch(() => {
                    setSuccessful(false);
                });
        }
    };

    return (
        <div className="col-md-12">
            <div className="card card-container">

                <Form onSubmit={handleSignup} ref={form}>
                    {!successful && (
                        <div>
                            <div className="form-group">
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                                        {iconPick ? iconPick.element : "Choose Icon"}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {icons}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={username}
                                    onChange={onChangeUsername}
                                    validations={[required, vusername]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    onChange={onChangeEmail}
                                    validations={[required, validEmail]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={onChangePassword}
                                    validations={[required, vpassword]}
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-block">Sign Up</button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );
};

export default Signup;

// const mapStateToProps = state => ({
//     signingUp: state.account.signingUp,
//     loggingIn: state.account.loggingIn,
//     isLoggedIn: state.account.isLoggedIn
// });

// // tell redux what actions we want to use (the same ones we imported at the top)
// const mapDispatchToProps = {
//     signup
// }

// Signup.PropTypes = {
//     signingUp: PropTypes.bool.isRequired,
//     loggingIn: PropTypes.bool.isRequired,
//     isLoggedIn: PropTypes.bool.isRequired,
//     signup: PropTypes.func.isRequired
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Signup);