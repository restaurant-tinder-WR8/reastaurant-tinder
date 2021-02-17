import { useState } from "react";
import AppContext from "./app-context";

const AppState = (props) => {
    const [decidee, setDecidee] = useState(null);

    return (
        <AppContext.Provider
            value={{
                decidee,
                setDecidee,
                message: "This is from context,  Its our decidees"
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppState;