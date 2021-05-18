import React, {useState} from "react";
import './Signup.css'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from "react-hook-form";
import logo from '../../assets/logo.png';
import { useHistory, Link } from "react-router-dom";
import axiosMiddleware from './../../axios';
import axios from 'axios';
import jwt from 'jwt-decode';
import { AuthContext } from "../../App";
import { DropzoneDialog } from "material-ui-dropzone";
import config from '../../config';


const useStyles = makeStyles((theme) => ({
paper: {
    marginTop: '15vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
},
avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
},
form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
//   alignItems: 'center'
},
submit: {
    margin: theme.spacing(3, 0, 2),
    width: '50%',
    margin: '3vh auto',
    marginBottom: '5vh',
    background:' linear-gradient(40deg ,#de4686 65%, #ff8544 100%); '
},
}));
function Signup() {
    const { dispatch, isAuthenticated } = React.useContext(AuthContext);
  let history = useHistory();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [newError , setNewError] = useState(null);
  const [isLoading , setIsLoading] = useState(false);
  const [openImgUp, setOpenImgUp] = React.useState(false);
  const [imageFile, setImageFile] = useState(null)
 
    const handleOpenBox = () => {
        setOpenImgUp(true);
  };

  const handleCloseBox = () => {
    setOpenImgUp(false);
  };

  const handleSave = files => {
    setImageFile(files[0]);
    setNewError(null)
    handleCloseBox();
  };
  const onSubmit = data => {
      
    if(imageFile) {
        axiosMiddleware.post('/api/users/signup', {
            name: data.name,
            email: data.email,
            password: data.password
          })
          .then(resJson => {
            if(resJson.data.status === 1) {
                const token = resJson.data.token;
                const user = jwt(token);
                var bodyFormData = new FormData();
                bodyFormData.append('imageFile', imageFile);
                bodyFormData.append('userId', user._id);
                axios({
                    method: "post",
                    url: config.BASE_URL + '/api/users/upload-dp',
                    data: bodyFormData,
                    headers: { "Content-Type": "multipart/form-data" },
                  })
                    .then(function (response) {
                        const dataMain = {
                            user: user,
                            token: token
                        }
                        setIsLoading(false);
                        dispatch({
                            type: "LOGIN",
                            payload: dataMain
                        })
                        history.push({
                           pathname: "/cards"
                       });;
                    })
                    .catch(function (response) {
                      //handle error
                      console.log(response);
                    }); 
                 
                 
            } else {
                setIsLoading(false);
                setNewError(resJson.data.msg)
            }
            
          }, (error) => {
            // console.log(error);
            // setNewError(error)
            })
    }
    else {
        setNewError('You must upload an image!')
    }
    // history.push({
    //     pathname: "/cards"
    // });
  };
  
  const classes = useStyles();
    return (
        <div className="login-container signup">
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    {/* <Avatar className={classes.avatar}> */}
                    <img  className="header_logo_form" src={logo} />
                    {/* </Avatar> */}
                    <Typography component="h1" variant="h5">
                    Welcome to the Tinder!
                    </Typography>
                    <form className={classes.form + ' auth-form'}  onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        // label="Email Address"
                        placeholder="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        helperText={ (errors.name?.type === "required" &&
                        "Name is required")}
                        {...register("name", {
                            required: true,
                        })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        // label="Email Address"
                        placeholder="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        helperText={ errors.email ? (errors.email?.type === "required" ? 'Email is required' : errors.email?.type === 'pattern' ?  'Email format is invalid' : '' ) : ''}
                        {...register("email", {
                            required: true,
                            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        // label="Password"
                        placeholder="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register("password", {
                            required: true
                        })}
                        helperText={(errors.password?.type === "required" &&
                        "Password is required")}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        // size="small"
                        style={{marginTop: '15px'}}
                        onClick={handleOpenBox}
                    >
                        Add Image
                    </Button>
                    <p>{imageFile ? imageFile.name : null}</p>
                    <DropzoneDialog
                        open={openImgUp}
                        filesLimit={1}
                        onSave={handleSave}
                        acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                        showPreviews={true}
                        maxFileSize={5000000}
                        onClose={handleCloseBox}
                        cancelButtonText={"Cancel"}
                        submitButtonText={"Submit"}
                        showFileNamesInPreview={true}
                        dialogTitle={"Upload Image"}
                        dropzoneText={"Drop or click to browse for image"}
                    />
                    <p style={{color:"red"}}>{newError}</p>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        
                        {isLoading ? 'Signing up...' : 'Sign Up' }
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        {/* <Link href="#" variant="body2">
                            Forgot password?
                        </Link> */}
                        </Grid>
                        <Grid item>
                        <Link to="/login" variant="body2">
                            {"Already have an account? Login"}
                        </Link>
                        </Grid>
                        <Grid item xs>
                        {/* <Link href="#" variant="body2">
                            Forgot password?
                        </Link> */}
                        </Grid>
                    </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    {/* <Copyright /> */}
                </Box>
                </Container>
        </div>
    )
}

export default Signup;