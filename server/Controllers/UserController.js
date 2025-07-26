const User = require('../Models/User');

// Add or update user points
exports.getPoints = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: 'username and email are required.' });
    }
    
    console.log('Getting points for user:', { username, email });
    
    // Find user or create if not exists
    let user = await User.findOne({ username, email });
    if (!user) {
      user = new User({ username, email, points: 0 });
      await user.save();
      console.log('Created new user with 0 points');
    } else {
      console.log('Found existing user with points:', user.points);
    }
    
    res.json({ message: 'Points fetched successfully', points: user.points });
  } catch (err) {
    console.log('Error in getPoints:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addPoints = async (req, res) => {
  try {
    const { username, email, increment = 1 } = req.body; // Default increment of 1
    if (!username || !email) {
      return res.status(400).json({ message: 'username and email are required.' });
    }
    
    console.log('Adding points for user:', { username, email, increment });
    
    // Find user or create if not exists
    let user = await User.findOne({ username, email });
    if (!user) {
      user = new User({ username, email, points: 0 });
      console.log('Created new user with 0 points');
    } else {
      console.log('Found existing user with points:', user.points);
    }
    
    // Add points (default increment is 1)
    user.points += increment;
    await user.save();
    
    console.log('Updated user points to:', user.points);
    
    res.json({ message: 'Points updated successfully', points: user.points });
  } catch (err) {
    console.log('Error in addPoints:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Check if user has a free download left for today
exports.hasFreeDownloadToday = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const today = new Date();
    today.setHours(0,0,0,0);
    const downloadsToday = user.downloads.filter(d => {
      const dDate = new Date(d.date);
      dDate.setHours(0,0,0,0);
      return dDate.getTime() === today.getTime();
    });
    res.json({ free: downloadsToday.length < 1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Record a download for a user
exports.recordDownload = async (req, res) => {
  try {
    const { email, videoId } = req.body;
    if (!email || !videoId) return res.status(400).json({ message: 'email and videoId are required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.downloads.push({ date: new Date(), videoId });
    await user.save();
    res.json({ message: 'Download recorded.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 