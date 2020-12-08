const axios = require("axios");


const getData = async ( queries={} ) => {

    const endpoint = 'https://api.coronavirus.data.gov.uk/v1/data';

    const { data, status, statusText } = await axios.get(endpoint, {
        params: queries,
        timeout: 10000
    });

    if ( status >= 400 )
        throw new Error(statusText);

    return data

};  // getData


const main = async () => {

    const
        AreaType = "nation",
        AreaName = "england";

    const
        filters = [
            `areaType=${ AreaType }`,
            `areaName=${ AreaName }`
        ],
        structure = {
            date: "date",
            name: "areaName",
            code: "areaCode",
            newCase: "newCasesByPublishDate"
        },
        formats = [
            "json",
            "xml",
            "csv"
        ];

    const
        apiParams = {
            filters: filters.join(";"),
            structure: JSON.stringify(structure),
            latestBy: "newCasesByPublishDate"
        };


    for ( const fmt of formats ) {

        apiParams.format = fmt;

        const result = await getData(apiParams);

        console.log(`${fmt} data:`);
        console.log(JSON.stringify(result));

    }

};  // main


main().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
