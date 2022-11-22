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
            <svg id="AsteroidsWrap" width="1350" height="1350" viewBox="0 0 1350 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Asteroids">
                    <path id="RockB" d="M1264.74 227.865C1284.78 246.21 1292.01 278.84 1281.41 304.1C1270.94 328.934 1242.23 346.266 1227.85 379.246C1212.91 412.521 1211.87 461.312 1189.95 485.416C1168.58 509.225 1126.46 507.921 1102.64 485.139C1078.53 461.798 1072.86 416.552 1048.43 385.161C1023.71 353.211 980.647 335.249 968.459 308.103C956.699 281.089 976.106 245.45 1005.87 230.78C1035.2 215.978 1074.9 222.143 1105.66 220.879C1136 219.482 1157.42 210.656 1184.48 207.779C1211.83 205.461 1244.7 209.52 1264.74 227.865Z" fill="#6284FF" fill-opacity="0.5"/>
                    <path id="RockL" d="M177.399 133.488C209.998 114.673 237.895 98.1705 264.534 99.6964C291.173 101.222 317.505 121.032 354.458 127.873C391.886 134.841 439.807 129.315 463.061 147.28C485.712 165.593 483.093 207.746 461.216 236.065C439.338 264.384 398.203 278.87 375.322 295.697C352.314 313 347.306 333.595 332.281 366.812C317.257 400.028 291.74 445.739 265.824 451.039C239.432 456.211 213.117 421.1 189.114 390.691C165.715 359.933 144.977 334.48 125.421 302.711C106.469 270.594 88.0955 232.51 97.5591 202.905C107.499 173.427 144.8 152.302 177.399 133.488Z" fill="#6284FF" fill-opacity="0.5"/>
                    <path id="RockB_2" d="M276.699 1221.5C244.995 1184.2 224.601 1141.53 220.207 1094.97C216.339 1048.91 228.47 998.97 259.133 973.075C290.313 947.171 340.026 945.315 374.472 960.292C408.917 975.269 428.096 1007.08 467.883 1031.81C507.153 1056.56 567.033 1074.22 581.031 1106.12C595.556 1138.52 564.198 1185.16 525.452 1223.62C487.224 1262.08 441.615 1292.88 397.04 1292.06C352.473 1291.76 308.931 1259.32 276.699 1221.5Z" fill="#6284FF" fill-opacity="0.5"/>
                </g>
            </svg>
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
                        <Box  className="inputWrap" width={isNonMobileScreens ? ( isLogin ? "600px" : "700px") : "75%"} height={isNonMobileScreens ? ( isLogin ? "600px" : "700px") : "75%"} p="2rem" m="0 auto" borderRadius="50%" backgroundColor={isLogin ? palette.primary.main : palette.background.default}>
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
                                <motion.div key={isRegister} initial="pageDefault" animate="pageAnimate" exit="pageExit" variants={{
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
                            </motion.div>
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