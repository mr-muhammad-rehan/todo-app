
module.exports = (req, res, next)=>{
    try{ 
        //Auth logic here
        next();
    }catch(err){
        res.status(401).json({
            error: 'Auth Faild',
            trace: err
        });
    }
}