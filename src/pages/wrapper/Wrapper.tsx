import React, { ReactElement } from "react";

function Wrapper({children}: {children: ReactElement}) {
    return ( 
        <div className="d-flex flex-fill main-wrapper p-3 ms-auto me-auto">
            {children}
        </div>
     );
}

export default Wrapper;