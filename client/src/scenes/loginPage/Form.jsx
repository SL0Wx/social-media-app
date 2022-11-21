import { useState, useRef } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { motion, AnimatePresence } from 'framer-motion';
import Galaxy from "components/Galaxy";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("Pole wymagane"),
    lastName: yup.string().required("Pole wymagane"),
    email: yup.string().email("invalid email").required("Pole wymagane"),
    password: yup.string().required("Pole wymagane"),
    location: yup.string().required("Pole wymagane"),
    picture: yup.string().required("Pole wymagane"),
});

const loginSchema = yup.object().shape({
    email: yup.string().email("Niepoprawny email").required("Pole wymagane"),
    password: yup.string().required("Pole wymagane"),
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    picture: "",
};

const initialValuesLogin = {
    email: "",
    password: "",
};

const Form = () => {
    const [pageType, setPageType] = useState("welcome");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isWelcome = pageType === "welcome";
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const formikRef = useRef();

    const register = async (values, onSubmitProps) => {
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture.name);

        const savedUserResponse = await fetch(
            "http://localhost:3001/auth/register",
            {
                method: "POST",
                body: formData,
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            setPageType("login");
        }
    };

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            "http://localhost:3001/auth/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();

        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            navigate("/home");
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    };

    return (
        <>
            <Box width="100%" backgroundColor={palette.primary.nav} p="0.5rem 6%" textAlign="center" className="headerNav">
                <FlexBetween maxWidth="1350px" margin="0 auto">
                    <img className="logoImg" src="/assets/sfera_logo.svg" height="50px" onClick={() => { setPageType("welcome"); }}/>
                    <Box>
                        <button className="login" onClick={ () => { setPageType("login"); formikRef.current?.resetForm(); }}>ZALOGUJ SIĘ</button>
                        <button className="register" onClick={() => { setPageType("register"); formikRef.current?.resetForm(); }}>ZAREJESTRUJ SIĘ</button>
                    </Box>
                </FlexBetween>
            </Box>
            <Box width="100%" backgroundColor={isWelcome ? palette.background.default : (isLogin ? palette.background.default : palette.primary.main)}>
            <AnimatePresence exitBeforeEnter>
                {!isWelcome ? (
                    <motion.div key="forms" initial="pageDefault" animate="pageAnimate" exit="pageExit" variants={{
                        pageDefault: {
                          opacity: 0
                        },
                        pageAnimate: {
                          opacity: 1
                        },
                        pageExit: {
                          opacity: 0,
                          transition: {
                            duration: .5,
                            delay: .15
                          }
                        }
                      }}>
                    <Box height="100vh" pt="75px">
                        <Box  className="inputWrap" width={isNonMobileScreens ? ( isLogin ? "600px" : "700px") : "93%"} height={isNonMobileScreens ? ( isLogin ? "600px" : "700px") : "93%"} p="2rem" m="0 auto" borderRadius="50%" backgroundColor={isLogin ? palette.primary.main : palette.background.default}>
                            <Formik innerRef={formikRef} onSubmit={handleFormSubmit} initialValues={isLogin ? initialValuesLogin : initialValuesRegister} validationSchema={isLogin ? loginSchema : registerSchema}>
                            {({
                                values,
                                errors,
                                touched,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                setFieldValue,
                                resetForm,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <h2 className={isLogin ? "headerWhite" : "headerBlack"}>{isLogin ? "LOGOWANIE" : "REJESTRACJA"}</h2>
                                    <Box className="inputWrap" display="grid" gap="10px" gridTemplateColumns="repeat(4, minmax(0, 1fr))" sx={{"& > div": { gridColumn: isNonMobile ? undefined : "span 4"}}}>
                                        {isRegister && (
                                            <>   
                                                <TextField 
                                                    className={isLogin ? "inputLogField" : "inputRedField"}
                                                    label="Imię" 
                                                    onBlur={handleBlur} 
                                                    onChange={handleChange} 
                                                    value={values.firstName} 
                                                    name="firstName"
                                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                                    helperText={touched.firstName && errors.firstName}
                                                    size="small"
                                                    sx={{ gridColumn: "span 4",
                                                    "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "#212121" },
                                                    },}}
                                                    InputProps={{
                                                        style: {
                                                            backgroundColor: "white",
                                                            borderRadius: "8px",
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        style: { color: '#212121'},
                                                    }}
                                                />
                                                <TextField 
                                                    className="inputField"
                                                    label="Nazwisko" 
                                                    onBlur={handleBlur} 
                                                    onChange={handleChange} 
                                                    value={values.lastName} 
                                                    name="lastName"
                                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                                    helperText={touched.lastName && errors.lastName}
                                                    size="small"
                                                    sx={{ gridColumn: "span 4",
                                                    "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "#212121" },
                                                    },}}
                                                    InputProps={{
                                                        style: {
                                                            backgroundColor: "white",
                                                            borderRadius: "8px",
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        style: { color: '#212121'},
                                                    }}
                                                />
                                                <TextField 
                                                    className="inputField"
                                                    label="Miejscowość" 
                                                    onBlur={handleBlur} 
                                                    onChange={handleChange} 
                                                    value={values.location} 
                                                    name="location"
                                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                                    helperText={touched.location && errors.location}
                                                    size="small"
                                                    sx={{ gridColumn: "span 4",
                                                    "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "#212121" },
                                                    },}}
                                                    InputProps={{
                                                        style: {
                                                            backgroundColor: "white",
                                                            borderRadius: "8px",
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        style: { color: '#212121'},
                                                    }}
                                                />
                                                <Box gridColumn="span 4" border={`1px solid #212121`} borderRadius="5px" p="1rem" className="inputField" backgroundColor="white">
                                                    <Dropzone acceptedFiles=".jpg,.jpeg,.png" multiple={false} 
                                                        onDrop={(acceptedFiles) =>
                                                            setFieldValue("picture", acceptedFiles[0])
                                                        }
                                                    >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="0.1rem" textAlign="center" sx={{ "&:hover": { cursor: "pointer" } }}>
                                                            <input {...getInputProps()} />
                                                            {!values.picture ? (
                                                                <p>Dodaj swoje zdjęcie</p>
                                                            ) : (
                                                                <FlexBetween>
                                                                    <Typography>{values.picture.name}</Typography>
                                                                    <EditOutlinedIcon />
                                                                </FlexBetween>
                                                            )}
                                                        </Box>
                                                    )}
                                                    </Dropzone>
                                                </Box>
                                            </>
                                        )}

                                        <TextField 
                                            className="inputField"
                                            label="Email" 
                                            onBlur={handleBlur} 
                                            onChange={handleChange} 
                                            value={values.email} 
                                            name="email"
                                            error={Boolean(touched.email) && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                            size="small"
                                            sx={{ gridColumn: "span 4",
                                            "& .MuiOutlinedInput-root": {
                                              "& > fieldset": { borderColor: "#212121" },
                                            },}}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: "white",
                                                    borderRadius: "8px",
                                                }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#212121'},
                                            }}
                                        />
                                        <TextField 
                                            className="inputField"
                                            label="Hasło" 
                                            type="password"
                                            onBlur={handleBlur} 
                                            onChange={handleChange} 
                                            value={values.password} 
                                            name="password"
                                            error={Boolean(touched.password) && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                            size="small"
                                            sx={{ gridColumn: "span 4",
                                            "& .MuiOutlinedInput-root": {
                                              "& > fieldset": { borderColor: "#212121" },
                                            },}}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: "white",
                                                    borderRadius: "8px",
                                                }
                                            }}
                                            InputLabelProps={{
                                                style: { color: '#212121'},
                                            }}
                                        />
                                    </Box>

                                    {/* BUTTONS */}
                                    <Box className="buttonField">
                                        <Button fullWidth type="submit" 
                                            sx={{
                                                m: "1rem 0",
                                                p: "0.75rem",
                                                fontSize: "1.1rem",
                                                backgroundColor: isLogin ? palette.background.alt : palette.primary.main,
                                                color: isLogin ? palette.primary.main : palette.background.alt,
                                                border: "2px solid transparent",
                                                "&:hover": { color: isLogin ? palette.background.alt : palette.primary.main, border: isLogin ? `2px solid ${palette.background.alt}` : `2px solid ${palette.primary.main}`},
                                            }}
                                        >
                                            {isLogin ? "ZALOGUJ SIĘ" : "ZAREJESTRUJ SIĘ"}
                                        </Button>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </Box>
                </motion.div>
                ) : (
                    <Box>
                        <motion.div key={"welcome"} initial="hidden" exit="visible" variants={{
                                visible: {
                                    scale: 25,
                                    background: "transparent",
                                    transition: {
                                    duration: 0.8
                                    }
                                },
                                exit: {
                                    scale: 1,
                                    transition: {
                                    duration: 0.8
                                    }
                                }
                                }}>
                            <div className="content">
                                <div className="main">
                                    <motion.div initial="hidden" animate="visible" variants={{
                                        hidden: {
                                            translateX: 50,
                                            opacity: 0
                                        },
                                        visible: {
                                            translateX: 0,
                                            opacity: 1,
                                            transition: {
                                                delay: .25,
                                                duration: 1
                                            }
                                        }
                                    }}>
                                    <h1>
                                        DOŁĄCZ <br /> DO NASZEGO <br /> WSZECHŚWIATA
                                    </h1>
                                    </motion.div>
                                    <motion.div initial="hidden" animate="visible" variants={{
                                        hidden: {
                                            position: "relative",
                                            left: 0,
                                            top: 0,
                                            scale: .8,
                                            opacity: 0
                                        },
                                        visible: {
                                            position: "absolute",
                                            scale: 1,
                                            opacity: 1,
                                            transition: {
                                                delay: .25,
                                                duration: 1 
                                            }
                                        }
                                    }}>
                                    <Galaxy />
                                    </motion.div>
                                </div>
                            </div> 
                        </motion.div>
                    </Box>
                )}
            </AnimatePresence>
            </Box>
        </>
    )
}

export default Form;