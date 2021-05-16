import React, {useEffect, useState} from "react";
import './Login.css'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from "react-hook-form";
import logo from '../../assets/logo.png';
import loader from '../../assets/small_load.gif';
import { useHistory, Link } from "react-router-dom";
import axios from './../../axios';
import jwt from 'jwt-decode';
import { AuthContext } from "../../App";


const useStyles = makeStyles((theme) => ({
paper: {
    marginTop: '18vh',
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
function Login() {
  const { dispatch, isAuthenticated } = React.useContext(AuthContext);
  let history = useHistory();
  useEffect(() => {
    if(localStorage.getItem('token')) {
        history.push({
            pathname: "/cards"
        });
    }
  },[])
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [newError , setNewError] = useState(null)
  const [isLoading , setIsLoading] = useState(false)
 
  const onSubmit = data => {
    setIsLoading(true);
    axios.post('/api/users/login', {
        email: data.email,
        password: data.password
      })
    //   .then((response) => {
    //       console.log('response ', response)
    //       if(response.data.status === 1) {
    //         const token = response.data.token;
    //         const user = jwt(token); // decode your token here
    //         localStorage.setItem('user', user);
    //         localStorage.setItem('token', token);
    //         console.log(user)
    //         history.push({
    //             pathname: "/cards"
    //         });
    //       } else {
    //         setNewError(response.data.msg)
    //       }
        
    //   }, (error) => {
    //     // console.log(error);
    //     setNewError(error)
    //   })
    // .then(res => {
    //     if (res.ok) {
    //       return res.json();
    //     }
    //     throw res;
    //   })
      .then(resJson => {
        if(resJson.data.status === 1) {
             const token = resJson.data.token;
             const user = jwt(token);
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
            });
        } else {
            
            setIsLoading(false);
            setNewError(resJson.data.msg)
        }
        
      }, (error) => {
        // console.log(error);
        // setNewError(error)
        })
  };
  
  const classes = useStyles();
    return (
        <div className="login-container">
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
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <p style={{color:"red"}}>{newError}</p>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                       {isLoading ? 'Signing In...' : 'Sign In' }  
                        {/* <img src={loader} /> */}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        {/* <Link href="#" variant="body2">
                            Forgot password?
                        </Link> */}
                        </Grid>
                        <Grid item>
                        <Link to="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
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

export default Login;