import { useEffect, useState } from "react";
import { createSharedState, requestCreateEvent } from '@puzzlehq/sdk-core';
import {
    getRecords,
    useAccount
} from '@puzzlehq/sdk';

export default function OngoingSwapPageMainContent() {
    
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [eventId, setEventId] = useState();

    const [records, setRecords] = useState();
    const [totalPageCount, setTotalPageCount] = useState(0);
  

    const filter = {
        programId: 'credits.aleo',
        type: 'all'
    };


    const onClick = async () => {
        setLoading(true);
        setError(undefined);
        try {
            // Step 1: Get records first
            const response = await getRecords({
                filter,
                address: "aleo1hrkenfzu8du4aj5u7v8cshgq0lkfl4ttu52gpgct9zcww4vgvvxsx3xcy8"
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
                address: 'aleo1hdn7ts6e8lpt768gaqz57e4hq8rvmuesfpms7hfes5l886gezs9s3p4wqd', // This can be omitted if the address is not always required
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
                        <Link to={"/options"} style={{textDecoration: 'none'}}>
                            <p style={{width: '17%',  whiteSpace: 'nowrap'}}> Back</p>
                        </Link>
                        <p style={{width: '80%'}}><b>Buy Asset</b></p>
                    </div>
                    

                    <img src={betty} style={{height: 117, width: 117, borderRadius: 12}} />

                    <p><b>Pa Salieu: Betty</b></p>
                    
                    <audio loop src={audio} controls style={{height:20, width: 200}}>
                    </audio>
                     
                    <div style={{ marginTop:20, marginLeft:15, marginRight:15, whiteSpace: 'wrap', overflowY:'auto', height: 245}}>
                        <div>
                            <button
                                onClick={ onClick }
                                disabled={ loading }
                            >
                                create event
                            </button>
                            { eventId && <p>event pending: {eventId}</p> }
                            {error && !loading ? <p>error creating event: {error}</p> : null}
                            <br/>
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