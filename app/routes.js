// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            // successRedirect : '/adminmap', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
	}),
		// runs if login success
  	function(req, res) {
			var usernameLocal = req.user.username;

      if (req.body.remember) {
      	req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }

			if (usernameLocal.includes("ADMIN-")) {
				res.redirect('/adminmap');
			} else {
				res.redirect('/usermap');
			}
  	}
	);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/login', // redirect to login
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// // =====================================
	// // PROFILE SECTION =========================
	// // =====================================
	// // we will want this protected so you have to be logged in to visit
	// // we will use route middleware to verify this (the isLoggedIn function)
	// app.get('/profile', isLoggedIn, function(req, res) {
	// 	res.render('profile.ejs', {
	// 		user : req.user // get the user out of session and pass to template
	// 	});
	// });

	// =====================================
	// MAIN MAP =========================
	// =====================================
	app.get('/adminmap', isLoggedIn, function(req, res) {

		var usernameLocal = req.user.username;

		if (usernameLocal.includes("ADMIN-")) {
			res.render('adminmap.ejs', {
				user : req.user
			});
		} else {
			res.redirect('/usermap');
		}

	});

	// =====================================
	// USER MAP =========================
	// =====================================
	app.get('/usermap', isLoggedIn, function(req,res) {
		res.render('usermap.ejs', {
			user : req.user
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
