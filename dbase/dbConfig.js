exports.dbconnection = function ()
{
    var connect = 
    {
        server: 'lnxsrvzeus.eastus.cloudapp.azure.com',
        database : 'BLACKCONTADORES',
        user: 'black_user',
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