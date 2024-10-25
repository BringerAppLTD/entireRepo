import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { createSharedState, requestCreateEvent } from '@puzzlehq/sdk';
import { connect, configureConnection } from '@puzzlehq/sdk';
import {
    getRecords,
    useAccount
} from '@puzzlehq/sdk';


var dAppName = "";
var dAppDescription = "";
var dAppUrl = "";
var dAppIconURL = "";
var projectId = ""; 

configureConnection(
    dAppName="Bonds",
    dAppDescription="Bonds NFT Platfom",
    dAppUrl="https://usebonds.netlify.app/ongoingswap",
    dAppIconURL="https://github.com/BringerAppLTD/Bonds-web-app/blob/main/front-end/src/assets/Bonds_new.png",
    // projectId="<YOUR WALLETCONNECT PROJECT ID>" // optional
)

export default function OngoingSwapPageMainContent() {
    
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [eventId, setEventId] = useState();
    const [session, setSession] = useState(null); // Initialize session state
    const [success, setSuccess] = useState(false);
    const [address, setAddress] = useState(null);
    const [records, setRecords] = useState();
    const [totalPageCount, setTotalPageCount] = useState(0);
  

    const filter = {
        programId: 'credits.aleo',
        type: 'all'
    };


    const onClick = async () => {
        setLoading(true);
        setError(undefined);
        setSuccess(false);
        try {
          const newSession = await connect(); // Connect to the wallet
          setSession(newSession); // Store the session in state
          console.log('Session details:', newSession);

          // Extract the wallet address from the session object
          const walletAddress = newSession.namespaces?.aleo?.accounts[0]; // Adjust this path based on the session structure
          setAddress(walletAddress);
          console.log('Connected wallet address:', walletAddress);

            // Step 1: Get records first
            const response = await getRecords({
                filter
            });
            console.log('Response:', response);


            // Check if response contains records
            if (response && response.records) {
                setRecords(response.records);
                setTotalPageCount(response.pageCount);
            } else {
                setRecords([]);
                setError('No records found for the specified address and filter.');
            } 

          
            const EventType = {
                Deploy: 'Deploy',
                Execute: 'Execute',
                Send: 'Send',
                Join: 'Join',
                Split: 'Split',
                Shield: 'Shield',
                Unshield: 'Unshield'
            };
            
            Object.freeze(EventType); // This will make the object immutable
        
        
            const CreateEventRequestData = {
                type: EventType.Send, // Should be set to a value from EventType
                programId: 'credits.aleo',
                functionId: 'transfer_private',
                fee: 0.053613,
                inputs: [response.records ? response.records[0] : null, 'aleo1hdn7ts6e8lpt768gaqz57e4hq8rvmuesfpms7hfes5l886gezs9s3p4wqd', '1u64'] // Array of either objects (records) or strings
            };

            if (!response.records || response.records.length === 0) {
                setError('No available records to create an event.');
                return;
            }

          // Step 2: After successfully getting records, create an event
          const createEventResponse = await requestCreateEvent(CreateEventRequestData);
          if (createEventResponse.error) {
            setError(createEventResponse.error);
          } else {
            setEventId(createEventResponse.eventId);
          }
        } catch (e) {
          // Catch any errors from either step
          setError(e.message);
        } finally {
          setLoading(false);
        }
    };


    return (
        <>
            <div style={{ color:'white', width: '80%', marginTop:0, float:'left' }}> 
                    
                    {/* <Header/> */}
                    <div style={{display: 'flex', marginTop:20}}>
                            <p style={{width: '17%',  whiteSpace: 'nowrap'}}> -</p>
                        <p style={{width: '80%'}}><b>Create Event</b></p>
                    </div>
                    
                     
                    <div style={{ marginTop:20, marginLeft:15, marginRight:15, whiteSpace: 'wrap', overflowY:'auto', height: 245}}>
                        <div>
                            <button
                                onClick={ onClick }
                                disabled={ loading }
                            >
                                {loading ? 'Loading' : 'get records & create event'}
                            </button>
                            { eventId && <p>event pending: {eventId}</p> }
                            {error && !loading ? <p>error creating event: {error}</p> : null}
                            <br/>
                            {address && <div><p style={{whiteSpace:'wrap'}}>Wallet address:</p><p style={{fontSize:18}}>{address}</p></div>}
                            {Array.isArray(records) && (
                                <div>
                                <p>there are {totalPageCount} pages of records</p>
                                {records.map((record, index) => (
                                    <p key={index}>{record.plaintext}</p>
                                ))}
                                </div>
                            )}
                            { error && <p>error fetching records: {error}</p> }
                        </div>
                    </div>
            </div>          
        </>          
    )
}
