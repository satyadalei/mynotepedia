const checkUserAuthentication = (req,res,next)=>{
  if(req.session.isAuthenticated) {
    next();
  }else{
        const msg = "plaese login";
        const success = false;
        const error = "not authorised"
        res.json({
            "msg" : msg,
            "success" : success,
            "error" : error
        });
  }
}
module.exports = checkUserAuthentication;