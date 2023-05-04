const checkUserAuthentication = (req,res,next)=>{
  if(req.session.isAuthenticated) {
    next();
  }else{
    res.send("Please login")
  }
}
module.exports = checkUserAuthentication;