/********* This is the Error Controller  **************/

exports.get404 = (req, res, next) => {
    // This is what EJS uses to render a view. It passes in a value for 'pageTitle' which we can then call with <%= pageTitle %> in our html template. 
    // To make the 404 page work I had to add 'path: 'Error'' so that a path was defined for the navigation include. The navigation include is looking for the 'path' value in my "class=" JavaScript. In this since there is no path you can just use ' path: '' ' or you can make a dummy name like ' path: 'Error' '. It just needs the 'path' object.
      res.status(404).render('404', { pageTitle: '404 Page Not Found', path: '' });
  };