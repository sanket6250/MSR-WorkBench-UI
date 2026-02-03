import { useContext, useEffect, useRef, useState } from 'react';
import { ChatBot } from './ChatBot';
const Footer = ()=>
{
    const [openChat, setOpenChat] = useState(false);
    return(
        <>
        <div style={{width: '100%',minHeight:'40px',bottom: '0',backgroundColor: 'white'}}>
          <hr style={{margin:'0px 5px 0px 0px' ,  opacity: '0.10'}} /> <label style={{fontFamily:'bootstrap-icons' , margin: '5px'}}>Copyright © MSR-Workbench</label>
          <ChatBot/>
        </div>
        </>
    );
}

export default Footer;