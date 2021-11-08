import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOG_OUT: "LOG_OUT",
    LOG_IN: "LOG_IN"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.LOG_OUT: {
                return setAuth({
                    user: payload,
                    loggedIn: false
                });
            }
            case AuthActionType.LOG_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userData, store) {
        const response = await api.registerUser(userData);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
    }
    auth.loginUser = async function(userData, store){
        const response = await api.loginUser(userData);      
        console.log(response.status);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOG_IN,
                payload: {
                    user: response.data.user,
                    loggedIn: response.data.loggedIn
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
    }
    auth.logoutUser = async function(){
        // const response = await api.logoutUser();
        // console.log(response.status);
        // if(response.status === 200){
            authReducer({
                type: AuthActionType.LOG_OUT,
                payload:{
                }
            })
            history.push("/");
        // }
    }
    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };