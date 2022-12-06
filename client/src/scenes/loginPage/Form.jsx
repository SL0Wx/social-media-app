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
import { themeSettings } from "theme";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("Pole wymagane"),
    lastName: yup.string().required("Pole wymagane"),
    email: yup.string().email("Niepoprawny email").required("Pole wymagane"),
    password: yup.string().required("Pole wymagane").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Hasło musi składać się z conajmniej 8 znaków, w tym z jednej dużej i małej litery oraz cyfry"
      ),
    location: yup.string().required("Pole wymagane"),
    picture: yup.string(),
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
    const [isHovered, setIsHovered] = useState(false);
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isWelcome = pageType === "welcome";
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const formikRef = useRef();
    const [confPassword, setConfPassword] = useState("");
    const [isTheSame, setIsTheSame] = useState(true);

    const register = async (values, onSubmitProps) => {
        if(values.password === confPassword) {
            setIsTheSame(true);
            const formData = new FormData();
            for (let value in values) {
                formData.append(value, values[value])
            }
            formData.append('picturePath', values.picture.name !== undefined ? values.picture.name : "profile_icon.svg");

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
        } else {
            setIsTheSame(false);
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

    const isSame = async(e) => {
        setConfPassword(e.target.value);
    }

    return (
        <>
            <Box width="100%" backgroundColor={palette.primary.nav} p="0.5rem 6%" textAlign="center" className="headerNav">
                <FlexBetween maxWidth="1350px" margin="0 auto" flexDirection={isNonMobile ? "row" : "column"}>
                    <img className="logoImg" src="/assets/sfera_logo.svg" height="50px" onClick={() => { setPageType("welcome"); }}/>
                    <Box>
                        <button className="login" onClick={ () => { setPageType("login"); formikRef.current?.resetForm(); }}>ZALOGUJ SIĘ</button>
                        <button className="register" onClick={() => { setPageType("register"); formikRef.current?.resetForm(); }}>ZAREJESTRUJ SIĘ</button>
                    </Box>
                </FlexBetween>
            </Box>
            <Box overflow="hidden" height={isNonMobile ? "100vh" : "auto"} width="100%" backgroundColor={isWelcome ? palette.background.default : (isLogin ? palette.background.default : palette.primary.main)}>
            <motion.div animate={isHovered ? 'hide' : 'show'} variants={{
                        hide: {
                          opacity: 0,
                        },
                        show: {
                          opacity: 1,
                        },
                      }}>
            <svg id={isLogin ? "AsteroidsWrapLog" : "AsteroidsWrapReg"} width="1350" height="1350" viewBox="0 0 1350 1350" fill="none" visibility={isWelcome ? "hidden" : "visible"} xmlns="http://www.w3.org/2000/svg">
                <g id="Asteroids">
                <path id="RockB" d="M1280.59 227.794C1299.93 245.501 1306.91 276.997 1296.68 301.38C1286.58 325.35 1258.86 342.081 1244.98 373.914C1230.56 406.033 1229.56 453.129 1208.4 476.396C1187.77 499.377 1147.11 498.118 1124.12 476.128C1100.85 453.598 1095.38 409.924 1071.8 379.624C1047.93 348.784 1006.37 331.446 994.602 305.243C983.25 279.168 1001.98 244.768 1030.71 230.607C1059.03 216.319 1097.34 222.271 1127.04 221.05C1156.32 219.702 1177 211.182 1203.12 208.406C1229.52 206.168 1261.24 210.086 1280.59 227.794Z" fill="#6284FF" fillOpacity="0.5"/>
                <path id="RockB_2" d="M272.32 785.068C278.5 802.345 272.518 824.107 258.22 835.846C244.136 847.371 221.522 848.66 202.53 863.814C183.111 878.968 167.1 907.774 146.404 915.249C126.134 922.724 101.394 908.654 94.3621 887.537C87.3308 865.993 98.222 837.189 93.5393 810.738C88.8568 783.861 68.8134 759.549 70.1014 739.496C71.6026 719.655 94.4349 704.5 116.834 705.131C139.02 705.549 160.774 721.753 179.543 730.705C198.099 739.445 213.672 740.932 230.736 747.751C247.799 754.998 266.14 767.79 272.32 785.068Z" fill="#6284FF" fillOpacity="0.5"/>
                <path id="RockL" d="M126.277 167.852C153.139 152.349 176.128 138.75 198.079 140.007C220.03 141.265 241.728 157.589 272.178 163.225C303.02 168.967 342.509 164.414 361.671 179.217C380.336 194.308 378.178 229.043 360.15 252.379C342.123 275.715 308.225 287.652 289.371 301.518C270.412 315.776 266.285 332.747 253.904 360.118C241.524 387.49 220.497 425.156 199.142 429.524C177.394 433.786 155.709 404.854 135.93 379.795C116.649 354.45 99.5602 333.476 83.4457 307.297C67.8286 280.832 52.6879 249.449 60.4862 225.054C68.6769 200.764 99.4141 183.356 126.277 167.852Z" fill="#6284FF" fillOpacity="0.5"/>
                <path id="RockL_2" d="M1095.84 1175.65C1075.87 1196 1058.85 1213.71 1039.1 1218C1019.34 1222.3 996.101 1213.18 967.739 1215.69C939.004 1218.2 905.145 1231.96 884.523 1223.57C864.272 1214.8 857.626 1183.5 867.846 1158.39C878.066 1133.27 905.152 1114.35 918.438 1097.42C931.72 1080.12 931.195 1064.07 935.419 1036.77C939.642 1009.48 948.988 970.929 966.83 961.799C985.045 952.666 1011.38 972.952 1035.08 990.277C1058.4 1007.98 1078.71 1022.35 1099.43 1041.57C1119.78 1061.16 1140.93 1085.23 1140.03 1108.77C1138.76 1132.3 1115.82 1155.29 1095.84 1175.65Z" fill="#6284FF" fillOpacity="0.5"/>
                <path id="RockB_3" d="M338.386 1233.96C311.977 1202.88 294.99 1167.34 291.329 1128.55C288.107 1090.19 298.212 1048.59 323.753 1027.02C349.726 1005.44 391.136 1003.9 419.828 1016.37C448.52 1028.85 464.495 1055.35 497.637 1075.95C530.348 1096.56 580.226 1111.27 591.886 1137.84C603.985 1164.84 577.865 1203.68 545.59 1235.72C513.747 1267.75 475.756 1293.41 438.626 1292.73C401.503 1292.48 365.234 1265.45 338.386 1233.96Z" fill="#6284FF" fillOpacity="0.5"/>
                <path id="RockB_4" d="M1192.74 721.017C1210.76 712.835 1229.62 709.646 1248.21 713.109C1266.54 716.72 1284.61 726.983 1291.27 741.78C1297.88 756.779 1293.08 776.312 1283.43 788.039C1273.78 799.767 1259.29 803.69 1245.25 816.411C1231.27 828.929 1217.75 850.246 1203.8 852.146C1189.59 854.193 1174.94 836.823 1164.29 817.488C1153.58 798.355 1146.67 777.202 1151.94 759.964C1157.01 742.672 1174.46 729.348 1192.74 721.017Z" fill="#6284FF" fillOpacity="0.5"/>
                <path id="RockB_5" d="M768.29 69.9752C797.383 84.7291 820.907 105.696 835.604 133.175C849.845 160.477 855.258 194.291 843.088 218.103C830.601 242.053 800.532 256.001 775.507 255.672C750.483 255.344 730.503 240.738 699.682 235.79C669.177 230.703 627.831 235.274 611.012 219.282C593.739 203.112 600.993 166.378 614.892 132.76C628.475 99.2811 648.564 68.6019 676.166 57.6216C703.629 46.3252 738.743 55.0439 768.29 69.9752Z" fill="#6284FF" fillOpacity="0.5"/>
                </g>
            </svg>
            </motion.div>
            <AnimatePresence mode='wait'>
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
                        <Box  className="inputWrap" width={isNonMobileScreens ? ( isLogin ? "600px" : "700px") : "90vw"} height={isNonMobileScreens ? ( isLogin ? "600px" : "700px") : ( isLogin ? "400px" : "600px")} p="2rem" m="0 auto" borderRadius={isNonMobileScreens ? "50%" : "25px"} backgroundColor={isLogin ? palette.primary.main : palette.background.default}>
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
                                                    className={isLogin ? "inputLogField" : "inputRegField"}
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
                                                <Box gridColumn="span 4" border={`1px solid #212121`} zIndex="100" borderRadius="5px" p="1rem" className="inputField" backgroundColor="white" color="black">
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
                                        {isRegister && (
                                            <>
                                                <TextField 
                                                    className="inputField"
                                                    label="Powtórz Hasło" 
                                                    type="password"
                                                    onBlur={handleBlur}
                                                    onChange={isSame}
                                                    name="confPassword"
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
                                                {isTheSame === false && (
                                                    <Typography>ZŁE HASŁA</Typography>
                                                )}
                                            </>
                                        )}
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
                                            onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)} 
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
                    <Box backgroundColor={palette.background.default}>
                        <motion.div key={"welcome"} initial="hidden" exit="visible" variants={{
                                visible: {
                                    scale: 25,
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
                                <div className="main" style={{ background: palette.background.default}}>
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
                                    {isNonMobile ? (
                                        <h1>DOŁĄCZ <br /> DO NASZEGO <br /> WSZECHŚWIATA</h1>
                                    ) : (
                                        <h1 style={{ fontSize: "4rem" }}>DOŁĄCZ <br /> DO NASZEGO <br /> WSZECH <br /> ŚWIATA</h1>
                                    )}
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
                                    {isNonMobileScreens && (
                                        <Galaxy />
                                    )}
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