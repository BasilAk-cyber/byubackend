import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

const processVolunteer = async (req, res) => {
    const projectId = Number(req.params.projectId);
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You are now volunteering for this project.');
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'Could not sign you up for that project.');
    }

    return res.redirect(`/project/${projectId}`);
};

const processUnvolunteer = async (req, res) => {
    const projectId = Number(req.params.projectId);
    const userId = req.session.user.user_id;

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You are no longer volunteering for this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Could not remove you from that project.');
    }

    // Only allow two known destinations (avoids an open redirect)
    if (req.body.from === 'dashboard') {
        return res.redirect('/dashboard');
    }
    return res.redirect(`/project/${projectId}`);
};

export { processVolunteer, processUnvolunteer };