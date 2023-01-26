const axios = require('axios')

const url = `https://api.helius.xyz/v1/active-listings?api-key=4e1a7733-bb6a-453c-9e71-651674691782`

export const getActiveListings = async () => {
        const { data } = await axios.post(url, {
            "query": {
                "marketplaces": ["SOLANART"]
            }
        });
        console.log(data)
        console.log("Active listings: ", data.result);
};