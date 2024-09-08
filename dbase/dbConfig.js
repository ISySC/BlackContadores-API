exports.dbconnection = function ()
{
    const connect = 
    {
        server: '82.197.95.95',
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
