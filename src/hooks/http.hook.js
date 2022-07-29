import { useCallback } from "react";

export const useHttp = () => {
    // const [process, setProcess] = useState('waiting');

    const request = async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

        // setProcess('loading');

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch(e) {
            // setProcess('error');
            throw e;
        }
    };

    // const clearError = useCallback(() => {
        // setProcess('loading');
    // }, []);

    return {request, 
            // clearError, 
            // process, 
            // setProcess
        }
}

const skel = 'skeleton';
const showStr = (stat, str, extra) => {
    if(stat === 'idle'){
        return(
            !extra
            ?skel
            :`${str}, ${extra}`
        )
    }
}

console.log(showStr('idle', 'hello', 'bro'));


const older = () => {
    return(
        (erAdam) => {
            console.log(`${erAdam}-ny shakyr`);
        }
    )
}

const shakyr = older();

shakyr('Nurkeldi');