exports.dbconnection = function ()
{
    var connect = 
    {
        server: 'lnxsrvblackcontadoressolutions.eastus2.cloudapp.azure.com',
        database : 'BLACKCONTADORES',
        user: 'SA',
        password: 'bl4ckc0nt4d0r35.',
        port: 1433,
        setTimeout: 30000,
    
        options:{
            encrypt: false,
            trustedconnection: true,
        }
    }

    return connect;
};