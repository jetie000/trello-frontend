import React, { ReactElement } from "react";

function Wrapper({children}: {children: ReactElement}) {
    return ( 
        <div className="main-wrapper ms-auto me-auto">
            {children}
        </div>
     );
}

export default Wrapper;