
import { Link } from 'react-router-dom'



export default function SideBar() {
    return (
        <>
        <div style={{width: '20%', display: 'flow',  height:'610px', marginTop:0, borderTopRightRadius: 40, borderBottomRightRadius: 40, backgroundColor:'rgb(2, 244, 35)', zIndex: 100 }}>

            
            <div style={{paddingLeft: 6, paddingTop: 8, paddingBottom:8 }} className="sidebar-element">
                
                <center>
                <p style={{fontWeight: 'bold', cursor: "pointer"}} className="sidebar-text">- <br/></p>
                </center>
                
            </div>

            <div style={{}} className="sidebar-element">
                <Link to={"/ongoingswap"} style={{textDecoration: 'none'}}>
                    <center>
                    <p style={{fontWeight: 'bold', cursor: "pointer"}} className="sidebar-text">Get <br/>Records<br/>& Create Event</p>
                    </center>
                </Link>
            </div>


        </div> 
        </>
    )
}