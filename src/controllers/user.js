import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/user.js';


const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = user;

        console.log('User logged in:', user);

        req.flash('success', 'Login successful!');
        return res.redirect('/dashboard');
    } catch (error) {
        next(error);
    }
};

const processLogout = (req, res, next) => {
    // Regenerate the session to discard the authenticated session
    // while allowing a logout flash message to be displayed.
    req.session.regenerate((error) => {
        if (error) {
            return next(error);
        }

        req.flash('success', 'You have logged out successfully.');
        return res.redirect('/login');
    });
};

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role_name === role) {
            return next();
        }
        req.flash('error', 'You do not have permission to access that page.');
        return res.redirect('/');
    };
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole };